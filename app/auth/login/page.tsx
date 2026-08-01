import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { Zap } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,70,229,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(to_right,rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.05)_1px,transparent_1px)]" />

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="text-white h-6 w-6" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="gradient-text">Enosx</span>
            </h1>
            <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-foreground">Welcome back</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Form Container with Glassmorphism */}
        <div className="glass rounded-xl p-6 sm:p-8 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5">
          <LoginForm />
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/auth/signup" className="font-semibold gradient-text hover:underline transition-all">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
