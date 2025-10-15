import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChainFlow - Own Your Flow",
  description:
    "One platform to track your personal growth and manage decentralized workstreams — all verified onchain.",
  generator: "v0.dev",
  icons: {
    icon: "/logo-light.svg",
    shortcut: "/logo-light.svg",
    apple: "/logo-light.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="desktop-only-overlay">
          <div className="desktop-only-content">
            {/* Logo */}
            <div className="desktop-only-logo">
              <img src="/logo-dark.svg" alt="ChainFlow" className="w-20 h-20" />
              <span className="text-3xl font-bold text-[#F5F7FA] mt-4">ChainFlow</span>
            </div>

            {/* Main Message */}
            <div className="desktop-only-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h1 className="desktop-only-title">Desktop Only</h1>
            <p className="desktop-only-message">
              This website is optimized for desktop viewing only.
              <br />
              Please switch to a desktop device to access the full experience.
            </p>
            <p className="desktop-only-submessage">Phone version hasn't launched yet...</p>

            {/* Explore Text */}
            <p className="desktop-only-explore">Explore productivity reimagined on the blockchain</p>

            {/* Social Links */}
            <div className="desktop-only-socials">
              <a
                href="https://github.com/Hayder2007/Chain-Flow"
                target="_blank"
                rel="noopener noreferrer"
                className="desktop-only-social-link"
              >
                <img src="/github.png" alt="GitHub" className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/chainflow_xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="desktop-only-social-link"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/aaW6G3A427"
                target="_blank"
                rel="noopener noreferrer"
                className="desktop-only-social-link"
              >
                <img src="/discord.png" alt="Discord" className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
