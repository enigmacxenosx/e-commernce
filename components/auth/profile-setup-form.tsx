"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function ProfileSetupForm() {
  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const isValidUsername = (u: string) => u.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(u)
  const isValidPhone = (p: string) => p.length >= 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate inputs
      if (!isValidUsername(username)) {
        setError("Username must be at least 3 characters (letters, numbers, _ or -)")
        setLoading(false)
        return
      }

      if (!firstName.trim()) {
        setError("First name is required")
        setLoading(false)
        return
      }

      if (!lastName.trim()) {
        setError("Last name is required")
        setLoading(false)
        return
      }

      if (!isValidPhone(phone.replace(/\D/g, ""))) {
        setError("Please enter a valid phone number")
        setLoading(false)
        return
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("No user session found. Please sign up again.")
        setLoading(false)
        return
      }

      // Update user profile in users table
      const { error: updateError } = await supabase.from("users").upsert(
        {
          id: user.id,
          email: user.email,
          username: username,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      )

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      // Redirect to homepage
      router.push("/")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("[enosx] Profile setup error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="border-red-200/50 bg-red-50/50 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="username" className="text-sm font-medium">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="johndoe"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 h-11 border-2 border-muted hover:border-muted/70 focus:border-blue-500 transition-colors"
        />
        {username && isValidUsername(username) && (
          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Valid username
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-2 h-11 border-2 border-muted hover:border-muted/70 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-2 h-11 border-2 border-muted hover:border-muted/70 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+254 712 345 678"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 h-11 border-2 border-muted hover:border-muted/70 focus:border-blue-500 transition-colors"
        />
        {phone && isValidPhone(phone.replace(/\D/g, "")) && (
          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Valid phone
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || !isValidUsername(username) || !firstName.trim() || !lastName.trim() || !isValidPhone(phone.replace(/\D/g, ""))}
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
      >
        {loading ? "Setting up profile..." : "Complete Setup"}
      </Button>
    </form>
  )
}
