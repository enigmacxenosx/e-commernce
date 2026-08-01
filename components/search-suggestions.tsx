"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Tag, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Suggestion {
  type: "product" | "brand" | "category" | "popular"
  text: string
  value: string
}

interface SearchSuggestionsProps {
  onSearch?: (query: string) => void
  className?: string
}

export function SearchSuggestions({ onSearch, className }: SearchSuggestionsProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const debounceTimer = useRef<NodeJS.Timeout>()

  // Fetch suggestions as user types
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (!value) {
      setSuggestions([])
      setOpen(false)
      return
    }

    setLoading(true)
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/suggestions?q=${encodeURIComponent(value)}`)
        const data = await response.json()

        if (data.success) {
          setSuggestions(data.suggestions)
          setOpen(true)
        }
      } catch (error) {
        console.error("[enosx] Error fetching suggestions:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [value])

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setValue(suggestion.value)
    setOpen(false)

    if (onSearch) {
      onSearch(suggestion.value)
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion.value)}`)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      setOpen(false)
      if (onSearch) {
        onSearch(value)
      } else {
        router.push(`/search?q=${encodeURIComponent(value)}`)
      }
    }
  }

  const getIconForType = (type: Suggestion["type"]) => {
    switch (type) {
      case "product":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "brand":
        return <Tag className="h-4 w-4 text-purple-500" />
      case "category":
        return <Search className="h-4 w-4 text-green-500" />
      case "popular":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      if (!acc[suggestion.type]) {
        acc[suggestion.type] = []
      }
      acc[suggestion.type].push(suggestion)
      return acc
    },
    {} as Record<string, Suggestion[]>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <form onSubmit={handleSearch} className={cn("w-full", className)}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search electronics, brands, products..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pl-10 pr-4 py-2 h-10 w-full text-sm"
              onFocus={() => value && suggestions.length > 0 && setOpen(true)}
            />
          </div>
        </form>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandList>
            {loading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading suggestions...
              </div>
            )}

            {!loading && suggestions.length === 0 && value.length >= 2 && (
              <CommandEmpty>No suggestions found for "{value}"</CommandEmpty>
            )}

            {!loading && suggestions.length > 0 && (
              <>
                {groupedSuggestions.product && groupedSuggestions.product.length > 0 && (
                  <CommandGroup heading="Products">
                    {groupedSuggestions.product.map((suggestion) => (
                      <CommandItem
                        key={`${suggestion.type}-${suggestion.value}`}
                        value={suggestion.value}
                        onSelect={() => handleSelectSuggestion(suggestion)}
                        className="cursor-pointer"
                      >
                        {getIconForType(suggestion.type)}
                        <span className="ml-2">{suggestion.text}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {groupedSuggestions.brand && groupedSuggestions.brand.length > 0 && (
                  <CommandGroup heading="Brands">
                    {groupedSuggestions.brand.map((suggestion) => (
                      <CommandItem
                        key={`${suggestion.type}-${suggestion.value}`}
                        value={suggestion.value}
                        onSelect={() => handleSelectSuggestion(suggestion)}
                        className="cursor-pointer"
                      >
                        {getIconForType(suggestion.type)}
                        <span className="ml-2">{suggestion.text}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {groupedSuggestions.category && groupedSuggestions.category.length > 0 && (
                  <CommandGroup heading="Categories">
                    {groupedSuggestions.category.map((suggestion) => (
                      <CommandItem
                        key={`${suggestion.type}-${suggestion.value}`}
                        value={suggestion.value}
                        onSelect={() => handleSelectSuggestion(suggestion)}
                        className="cursor-pointer"
                      >
                        {getIconForType(suggestion.type)}
                        <span className="ml-2">{suggestion.text}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {groupedSuggestions.popular && groupedSuggestions.popular.length > 0 && (
                  <CommandGroup heading="Popular">
                    {groupedSuggestions.popular.map((suggestion) => (
                      <CommandItem
                        key={`${suggestion.type}-${suggestion.value}`}
                        value={suggestion.value}
                        onSelect={() => handleSelectSuggestion(suggestion)}
                        className="cursor-pointer"
                      >
                        {getIconForType(suggestion.type)}
                        <span className="ml-2">{suggestion.text}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
