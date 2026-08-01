import { ProfileSetupForm } from "@/components/auth/profile-setup-form"

export default function ProfileSetupPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,70,229,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(to_right,rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.05)_1px,transparent_1px)]" />

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-foreground">Complete Your Profile</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Add your details to get started
          </p>
        </div>

        {/* Form Container with Glassmorphism */}
        <div className="glass rounded-xl p-6 sm:p-8 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5">
          <ProfileSetupForm />
        </div>
      </div>
    </div>
  )
}
