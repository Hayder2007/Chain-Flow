"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, ArrowRight, Sun, Moon, ArrowLeft, CheckCircle, Clock, Wallet } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { WalletConnect } from "@/components/wallet-connect"
import { useAccount } from "wagmi"

export default function ZoneSelector() {
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const { address } = useAccount()

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F7FA" }}>
      {/* Top Navigation */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md py-4 border-b"
        style={{
          backgroundColor: isDarkMode ? "rgba(26, 26, 26, 0.9)" : "rgba(255, 255, 255, 0.9)",
          borderColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img
                src={isDarkMode ? "/logo-dark.svg" : "/logo-light.svg"}
                alt="ChainFlow"
                className="w-7 h-7 transition-opacity duration-300"
              />
              <span className="text-lg font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                ChainFlow
              </span>
            </Link>
            <div
              className="flex items-center space-x-2 text-sm"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.6)" : "rgba(107, 114, 128, 1)" }}
            >
              <Link href="/" className="hover:text-[#00FFE5] transition-colors flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Home
              </Link>
              <span>/</span>
              <span>Zone Selector</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <WalletConnect isDarkMode={isDarkMode} />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(26, 26, 26, 0.1)",
                color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
              }}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Wallet Connection Alert */}
      {!address && (
        <div className="fixed top-20 left-0 right-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div
              className="flex items-center justify-between p-4 rounded-lg border border-orange-500/20"
              style={{ backgroundColor: isDarkMode ? "rgba(255, 165, 0, 0.1)" : "rgba(255, 165, 0, 0.1)" }}
            >
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-orange-500" />
                <span style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Connect your wallet to access ChainFlow zones and track your onchain activities
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-20" style={{ marginTop: !address ? "60px" : "0" }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              Choose Your{" "}
              <span className="bg-gradient-to-r from-[#00FFE5] to-[#0099CC] bg-clip-text text-transparent">Zone</span>
            </h1>
            <p
              className="text-xl md:text-2xl max-w-3xl mx-auto"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              Select the perfect environment for your goals. Build personal habits or manage team workflows with
              blockchain accountability.
            </p>
          </div>

          {/* Zone Cards */}
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Personal Zone */}
            <Card
              className="group p-8 border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/60 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <Link href="/app/personal">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-[#00FFE5]/10 rounded-xl flex items-center justify-center group-hover:bg-[#00FFE5]/20 transition-colors">
                      <Target className="w-8 h-8 text-[#00FFE5]" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-[#00FFE5] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    Personal Zone
                  </h2>
                  <p
                    className="text-lg mb-6"
                    style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
                  >
                    Build lasting habits with blockchain accountability. Track daily routines, maintain streaks, and
                    achieve personal growth goals with immutable progress records.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                      <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        Daily habit tracking
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                      <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        Streak rewards & milestones
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                      <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        Progress analytics
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-[#00FFE5] mr-3" />
                      <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        Wellness tracking (coming soon)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            {/* Work Zone */}
            <Card
              className="group p-8 border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/60 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <Link href="/app/work">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-[#00FFE5]/10 rounded-xl flex items-center justify-center group-hover:bg-[#00FFE5]/20 transition-colors">
                      <Users className="w-8 h-8 text-[#00FFE5]" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-[#00FFE5] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    Work Zone
                  </h2>
                  <p
                    className="text-lg mb-6"
                    style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
                  >
                    Manage teams and projects with transparent, automated workflows. Assign tasks, verify completion,
                    and distribute crypto rewards seamlessly through smart contracts.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                      <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        Decentralized task management
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                      <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        Automated crypto payments
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                      <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        Transparent verification
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-[#00FFE5] mr-3" />
                      <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        Advanced analytics (coming soon)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
