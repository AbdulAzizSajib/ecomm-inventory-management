"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import { loginSchema, useLogin, type LoginFormValues } from "@/features/auth"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const { mutate: doLogin, isPending } = useLogin()

  const onSubmit = (values: LoginFormValues) => {
    setSubmitError(null)
    doLogin(values, {
      onSuccess: () => router.replace("/"),
      onError: (error) => setSubmitError(getApiErrorMessage(error, "Invalid email or password")),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="size-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
            <span className="text-white text-base font-bold">H</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Sign in to Ecomm Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Please enter your details.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@happymart.com"
                  aria-invalid={!!errors.email}
                  className={cn(
                    "w-full h-9 pl-9 pr-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  className={cn(
                    "w-full h-9 pl-9 pr-9 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {submitError && (
              <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full h-9 rounded-md bg-indigo-600 text-white text-sm font-medium",
                "hover:bg-indigo-700 transition-colors",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Contact your administrator
          </Link>
        </p>
      </div>
    </div>
  )
}
