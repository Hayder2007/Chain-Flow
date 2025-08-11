"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "light", ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load theme from localStorage before hydration
    const savedTheme = localStorage.getItem("chainflow-theme") as Theme
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      setTheme(savedTheme)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Apply theme to document body
    if (theme === "dark") {
      document.body.style.backgroundColor = "#1A1A1A"
      document.body.style.color = "#F5F7FA"
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.body.style.backgroundColor = "#F5F7FA"
      document.body.style.color = "#1A1A1A"
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    }

    // Save to localStorage
    localStorage.setItem("chainflow-theme", theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
