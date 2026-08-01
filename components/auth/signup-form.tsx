"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"
import { CheckCircle2, AlertCircle, Eye, EyeOff, Chrome } from "lucide-react"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"email" | "password" | "confirm">("email")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  // Validation helpers
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const isValidPassword = (p: string) => p.length >= 6
  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleNextStep = () => {
    if (step === "email") {
      if (!isValidEmail(email)) {
        setError("Please enter a valid email address")
        return
      }
      setError("")
      setStep("password")
    } else if (step === "password") {
      if (!isValidPassword(password)) {
        setError("Password must be at least 6 characters")
        return
      }
      setError("")
      setStep("confirm")
    }
  }

  const handlePrevStep = () => {
    if (step === "password") setStep("email")
    else if (step === "confirm") setStep("password")
    setError("")
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError("")
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
        setGoogleLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred with Google sign-up")
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!passwordsMatch) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      // <CHANGE> Skip email confirmation and auto-confirm user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: {
            email_confirm: true
          }
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // <CHANGE> Automatically sign in the user after registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setError(signInError.message)
          return
        }

        // <CHANGE> Redirect to profile setup to collect username and details
        router.push("/auth/profile-setup")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Progress Indicator */}
      <div className="flex gap-2">
        <div className={`flex-1 h-1 rounded-full transition-all ${step === "email" || step === "password" || step === "confirm" ? "bg-blue-500" : "bg-muted"}`} />
        <div className={`flex-1 h-1 rounded-full transition-all ${step === "password" || step === "confirm" ? "bg-blue-500" : "bg-muted"}`} />
        <div className={`flex-1 h-1 rounded-full transition-all ${step === "confirm" ? "bg-blue-500" : "bg-muted"}`} />
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200/50 bg-red-50/50 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 min-h-[200px]">
        {/* Step 1: Email */}
        {step === "email" && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-11 border-2 border-muted hover:border-muted/70 focus:border-blue-500 transition-colors"
              />
              {email && isValidEmail(email) && (
                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Valid email
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Password */}
        {step === "password" && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Create password</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-2 border-muted hover:border-muted/70 focus:border-blue-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && isValidPassword(password) && (
                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Strong password
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Confirm Password */}
        {step === "confirm" && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 border-2 border-muted hover:border-muted/70 focus:border-blue-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordsMatch && (
                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Passwords match
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {step !== "email" && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevStep}
            className="flex-1 h-11 border-2"
          >
            Back
          </Button>
        )}
        {step !== "confirm" && (
          <Button 
            type="button" 
            onClick={handleNextStep}
            disabled={
              (step === "email" && !isValidEmail(email)) ||
              (step === "password" && !isValidPassword(password))
            }
            className={`flex-1 h-11 bg-gradient-to-r ${step === "confirm" ? "hidden" : ""} ${
              step === "email" && !isValidEmail(email) ? "opacity-50" : ""
            }`}
          >
            Next
          </Button>
        )}
        {step === "confirm" && (
          <Button 
            type="submit" 
            disabled={loading || !passwordsMatch}
            className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="relative pt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
        </div>
      </div>

      {/* Google Sign Up Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignUp}
        disabled={googleLoading}
        className="w-full h-11 border-2 border-muted hover:border-muted/70 hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
      >
        <Chrome className="h-4 w-4" />
        {googleLoading ? "Creating account..." : "Sign up with Google"}
      </Button>
    </form>
  )
}
