"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Target,
  Users,
  Zap,
  TrendingUp,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle,
  Shield,
  Coins,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === "dark"

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToHero = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMenuOpen])

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F7FA" }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md py-4 border-b"
        style={{
          backgroundColor: isDarkMode ? "rgba(26, 26, 26, 0.9)" : "rgba(255, 255, 255, 0.9)",
          borderColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <button onClick={scrollToHero} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img
              src={isDarkMode ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="ChainFlow"
              className="w-8 h-8 transition-opacity duration-300"
            />
            <span className="text-xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              ChainFlow
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("about")}
              className="transition-colors hover:text-[#00FFE5]"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="transition-colors hover:text-[#00FFE5]"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("roadmap")}
              className="transition-colors hover:text-[#00FFE5]"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              Roadmap
            </button>
            <button
              onClick={() => scrollToSection("community")}
              className="transition-colors hover:text-[#00FFE5]"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              Community
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(26, 26, 26, 0.1)",
                color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
              }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/app">
              <Button className="bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90 font-semibold">Launch dApp</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(26, 26, 26, 0.1)",
              color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
            }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 w-full border-b backdrop-blur-md"
            style={{
              backgroundColor: isDarkMode ? "rgba(26, 26, 26, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="px-6 py-4 space-y-4">
              <button
                onClick={() => {
                  scrollToSection("about")
                  setIsMenuOpen(false)
                }}
                className="block py-2 transition-colors hover:text-[#00FFE5] w-full text-left"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection("features")
                  setIsMenuOpen(false)
                }}
                className="block py-2 transition-colors hover:text-[#00FFE5] w-full text-left"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                Features
              </button>
              <button
                onClick={() => {
                  scrollToSection("roadmap")
                  setIsMenuOpen(false)
                }}
                className="block py-2 transition-colors hover:text-[#00FFE5] w-full text-left"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                Roadmap
              </button>
              <button
                onClick={() => {
                  scrollToSection("community")
                  setIsMenuOpen(false)
                }}
                className="block py-2 transition-colors hover:text-[#00FFE5] w-full text-left"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                Community
              </button>
              <div className="flex items-center justify-between py-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(26, 26, 26, 0.1)",
                    color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                  }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              <Link href="/app" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90 font-semibold">
                  Launch dApp
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative pt-32 pb-20 px-6"
        style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F7FA" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}
            >
              Own Your{" "}
              <span className="bg-gradient-to-r from-[#00FFE5] to-[#0099CC] bg-clip-text text-transparent">Flow</span>
            </h1>
            <p
              className="text-xl md:text-2xl mb-6 leading-relaxed"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              One platform to track your personal growth and manage decentralized workstreams — all verified onchain.
            </p>

            {/* Built on Somnia */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="w-2 h-2 bg-[#00FFE5] rounded-full" />
              <span
                className="text-sm font-medium"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                Built on Somnia
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/app">
                <Button className="bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90 font-semibold px-8 py-4 text-lg">
                  Start For Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => scrollToSection("about")}
                className={`px-8 py-4 text-lg font-semibold ${
                  isDarkMode
                    ? "border-[#00FFE5] text-[#00FFE5] hover:bg-[#00FFE5]/10"
                    : "border-[#00FFE5] text-[#00FFE5] hover:bg-[#00FFE5]/10"
                }`}
              >
                Explore Workflows
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-[#00FFE5]" />
                <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                  Blockchain Verified
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#00FFE5]" />
                <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                  Decentralized
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-[#00FFE5]" />
                <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                  Crypto Rewards
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFE5] mb-2">N/A</div>
              <div style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                Habits Tracked
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFE5] mb-2">N/A</div>
              <div style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                Tasks Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFE5] mb-2">N/A</div>
              <div style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                ETH Distributed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Breaker */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
      />

      {/* About Section */}
      <section id="about" className="py-20 px-6" style={{ backgroundColor: isDarkMode ? "#242424" : "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              About ChainFlow
            </h2>
            <p
              className="text-xl max-w-4xl mx-auto leading-relaxed"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              ChainFlow is a smart-contract-powered platform merging task management, habit tracking, and automated
              onchain payouts. Like Notion, Trello, and GitHub but fully onchain. Teams manage work, assign tasks, and
              track proof of effort. Individuals build habits. All verifiable. All transparent. All in one flow.
            </p>
          </div>

          {/* How It Works */}
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              How It Works
            </h3>
            <p
              className="text-xl max-w-3xl mx-auto mb-12"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              Simple steps to start building habits and managing tasks on the blockchain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#00FFE5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#00FFE5]">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                Connect Wallet
              </h3>
              <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                Connect your Web3 wallet to the Somnia Testnet and start your decentralized journey
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#00FFE5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#00FFE5]">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                Choose Your Zone
              </h3>
              <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                Select Personal Zone for habits or Work Zone for team collaboration and task management
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#00FFE5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#00FFE5]">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                Start Building
              </h3>
              <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                Create habits, assign tasks, and watch your progress get recorded immutably on the blockchain
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Breaker */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
      />

      {/* Features Section */}
      <section id="features" className="py-20 px-6" style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#f7f7f7" }}>
        <div className="max-w-7xl mx-auto">
          {/* Why Choose ChainFlow */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              Why Choose ChainFlow?
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              Built for the decentralized future, designed for today's productivity needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <Card
              className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#00FFE5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#00FFE5]" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Habit Tracking
                </h3>
                <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                  Build consistent habits with blockchain-verified streaks and rewards.
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#00FFE5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#00FFE5]" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Team Management
                </h3>
                <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                  Coordinate decentralized teams with transparent task assignment and payments.
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#00FFE5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#00FFE5]" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Smart Automation
                </h3>
                <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                  Automate payments, verifications, and rewards with smart contracts.
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#00FFE5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-[#00FFE5]" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Analytics & Insights
                </h3>
                <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                  Track progress with detailed analytics and performance insights.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Two Powerful Zones */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              Two Powerful Zones
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              Whether you're building personal habits or managing teams, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card
              className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#00FFE5]/10 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-[#00FFE5]" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    Personal Zone
                  </h3>
                </div>
                <p
                  className="text-lg mb-6"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
                >
                  Build lasting habits with blockchain accountability. Track streaks, set goals, and maintain
                  consistency with immutable records.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                    <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                      Daily habit tracking
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                    <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                      Streak rewards & milestones
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                    <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                      Immutable progress records
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#00FFE5]/10 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-[#00FFE5]" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    Work Zone
                  </h3>
                </div>
                <p
                  className="text-lg mb-6"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
                >
                  Manage teams and projects with transparent, automated workflows. Assign tasks, verify completion, and
                  distribute rewards seamlessly.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                    <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                      Decentralized task management
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                    <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                      Automated crypto payments
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#00FFE5] mr-3" />
                    <span style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                      Transparent verification
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Breaker */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
      />

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 px-6" style={{ backgroundColor: isDarkMode ? "#242424" : "#FFFFFF" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              Roadmap
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div
              className="absolute left-8 top-0 bottom-0 w-0.5 z-0"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(107, 114, 128, 0.3)" }}
            />

            <div className="space-y-12">
              {/* Phase 1 - Current */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-[#00FFE5] rounded-full flex items-center justify-center mr-8 relative z-10">
                  <span className="text-xl font-bold text-[#1A1A1A]">1</span>
                </div>
                <Card
                  className="flex-1 border-2 border-[#00FFE5] shadow-lg"
                  style={{ backgroundColor: isDarkMode ? "rgba(0, 255, 229, 0.05)" : "rgba(0, 255, 229, 0.05)" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                        Phase 1
                      </h3>
                      <span className="bg-[#00FFE5] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-medium">
                        Current
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-[#00FFE5]">Core Foundation</h4>
                    <ul className="space-y-2">
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Vercel-hosted frontend live
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Habit tracker with workout/fasting check-ins
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Basic personal streak system (logs + timestamps)
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Manual task board (assign + submit)
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Basic team coordination (wallet + task name)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Phase 2 */}
              <div className="relative flex items-start">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-8 relative z-10 border-2"
                  style={{
                    backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(255, 255, 255, 0.9)",
                    borderColor: isDarkMode ? "rgba(245, 247, 250, 0.3)" : "rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <span className="text-xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    2
                  </span>
                </div>
                <Card
                  className="flex-1 border-2"
                  style={{
                    backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                    borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(107, 114, 128, 0.2)",
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                        Phase 2
                      </h3>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(107, 114, 128, 0.1)",
                          color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)",
                        }}
                      >
                        Coming Soon
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-3" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Work MVP
                    </h4>
                    <ul className="space-y-2">
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Wallet-based contributor assignment
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Role/permission logic added
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Task status: Assigned → Submitted → Verified
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Manual payout setup per task
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Smart contract upgrade for team ops
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Phase 3 */}
              <div className="relative flex items-start">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-8 relative z-10 border-2"
                  style={{
                    backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(255, 255, 255, 0.9)",
                    borderColor: isDarkMode ? "rgba(245, 247, 250, 0.3)" : "rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <span className="text-xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    3
                  </span>
                </div>
                <Card
                  className="flex-1 border-2"
                  style={{
                    backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                    borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(107, 114, 128, 0.2)",
                  }}
                >
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Phase 3
                    </h3>
                    <h4 className="text-lg font-semibold mb-3" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Proof Engine (zk/AI)
                    </h4>
                    <ul className="space-y-2">
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • AI-based check-in + task verification
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Optional ZK check-ins for privacy
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Onchain scoreboard for personal/team flow
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Slashing/staking layer for abuse prevention
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Phase 4 */}
              <div className="relative flex items-start">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-8 relative z-10 border-2"
                  style={{
                    backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(255, 255, 255, 0.9)",
                    borderColor: isDarkMode ? "rgba(245, 247, 250, 0.3)" : "rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <span className="text-xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    4
                  </span>
                </div>
                <Card
                  className="flex-1 border-2"
                  style={{
                    backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                    borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(107, 114, 128, 0.2)",
                  }}
                >
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Phase 4
                    </h3>
                    <h4 className="text-lg font-semibold mb-3" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Token + Expansion
                    </h4>
                    <ul className="space-y-2">
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Launch token
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Token-gated premium tools
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Mobile-friendly responsive UI
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Templates for DAO setups
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Ecosystem grants via Somnia L1
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Breaker */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
      />

      {/* Community Section */}
      <section id="community" className="py-20 px-6" style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#f7f7f7" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              Powered by
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <Card
              className="p-6 text-center border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="5.4" fill="#000" />
                    <rect x="2" y="2" width="20" height="20" rx="3.4" fill="#fff" />
                    <path
                      d="M8.001 9.932l1.804 3.122a.343.343 0 00.295.171h4.084c.131 0 .24-.083.295-.171L16.283 9.932c.064-.111-.016-.253-.142-.253h-7.998a.17.17 0 00-.142.253z"
                      fill="#000"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Vercel
                </h3>
                <p
                  className="text-sm"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                >
                  Frontend deployment platform
                </p>
              </CardContent>
            </Card>

            <Card
              className="p-6 text-center border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🦊</span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  MetaMask
                </h3>
                <p
                  className="text-sm"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                >
                  Web3 wallet integration
                </p>
              </CardContent>
            </Card>

            <Card
              className="p-6 text-center border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#00FFE5" />
                    <path
                      d="M8 12l2 2 4-4"
                      stroke="#1A1A1A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Somnia
                </h3>
                <p
                  className="text-sm"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                >
                  High-performance L1 blockchain
                </p>
              </CardContent>
            </Card>

            <Card
              className="p-6 text-center border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12.158.955l-7.91 4.565a2.285 2.285 0 00-1.135 1.976v9.008c0 .815.436 1.567 1.135 1.976l7.91 4.565a2.285 2.285 0 002.284 0l7.91-4.565a2.285 2.285 0 001.135-1.976V7.496a2.285 2.285 0 00-1.135-1.976L14.442.955a2.285 2.285 0 00-2.284 0z"
                      fill="#627EEA"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  ⚡ Solidity
                </h3>
                <p
                  className="text-sm"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                >
                  Smart contract development
                </p>
              </CardContent>
            </Card>

            <Card
              className="p-6 text-center border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1568 2.4189Z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  GitHub
                </h3>
                <p
                  className="text-sm"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                >
                  Version control & collaboration
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Breaker */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
      />

      {/* Footer */}
      <footer className="py-12 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start">
            {/* Left side - Our Socials */}
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-white">Our Socials</h3>
              <div className="flex items-center space-x-6">
                <a
                  href="https://x.com/chainflow_xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/KW8DZmHmSP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1568 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/Hayder2007/Chain-Flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right side - Newsletter */}
            <div className="w-full md:w-auto">
              <h3 className="text-xl font-bold mb-4 text-white">Stay Updated</h3>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE5] transition-colors"
                  />
                </div>
                <Button className="bg-[#00FFE5] text-black hover:bg-[#00FFE5]/90 font-semibold px-6 py-3 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-2">Get updates on new features and releases</p>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/logo-dark.svg" alt="ChainFlow" className="w-6 h-6" />
              <span className="text-lg font-bold text-white">ChainFlow</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 ChainFlow. Built on Somnia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
