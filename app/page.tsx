"use client"

import type React from "react"

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
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
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

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch("https://formspree.io/f/xpwlnlny", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setSubmitMessage("Thanks for subscribing! We'll reach out to you soon.")
        form.reset()
      } else {
        setSubmitMessage("Something went wrong. Please try again.")
      }
    } catch (error) {
      setSubmitMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <Button className="w-full bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90 font-semibold px-8 py-4 text-lg">
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
              Your one platform to track your personal growth and manage decentralized workstreams onchain.
            </p>

            {/* Built on Somnia */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="w-2 h-2 bg-[#00FFE5] rounded-full" />
              <span
                className="text-sm font-medium"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                Built on Base
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
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#00FFE5]/10 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-[#00FFE5]" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    Personal Zone
                  </h3>
                </div>
                <div className="flex-grow">
                  <p
                    className="text-lg pb-2 mb-6"
                    style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
                  >
                    Build lasting habits with blockchain accountability. Track streaks, set goals, and maintain
                    consistency with immutable records.
                  </p>
                  <ul className="space-y-3 mb-6">
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
                </div>
                <Link href="/app/personal">
                  <Button className="w-full bg-[#00FFE5] hover:bg-[#00FFE5]/90 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105">
                    Enter Personal Zone
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#00FFE5]/10 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-[#00FFE5]" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    Work Zone
                  </h3>
                </div>
                <div className="flex-grow">
                  <p
                    className="text-lg mb-6"
                    style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
                  >
                    Manage teams and projects with transparent, automated workflows. Assign tasks, verify completion,
                    and distribute rewards seamlessly.
                  </p>
                  <ul className="space-y-3 mb-6">
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
                </div>
                <Link href="/app/work">
                  <Button className="w-full bg-[#00FFE5] hover:bg-[#00FFE5]/90 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105">
                    Enter Work Zone
                  </Button>
                </Link>
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
      <section
        id="roadmap"
        className="text-lg mb-6 pb-4"
        style={{ backgroundColor: isDarkMode ? "#242424" : "#FFFFFF" }}
      >
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
              {/* Phase 1 - Completed */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-8 relative z-10">
                  <span className="text-xl font-bold text-white">✓</span>
                </div>
                <Card
                  className="flex-1 border-2 border-green-500/30 shadow-lg"
                  style={{ backgroundColor: isDarkMode ? "rgba(34, 197, 94, 0.05)" : "rgba(34, 197, 94, 0.05)" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                        Phase 1
                      </h3>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Completed
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

              {/* Phase 2 - Completed */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-8 relative z-10">
                  <span className="text-xl font-bold text-white">✓</span>
                </div>
                <Card
                  className="flex-1 border-2 border-green-500/30 shadow-lg"
                  style={{ backgroundColor: isDarkMode ? "rgba(34, 197, 94, 0.05)" : "rgba(34, 197, 94, 0.05)" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                        Phase 2
                      </h3>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-[#00FFE5]">Work MVP</h4>
                    <ul className="space-y-2">
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Wallet-based contributor assignment
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Role/permission logic added
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Task status: Assigned → Submitted → Verified
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Manual payout setup per task
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.9)" : "rgba(75, 85, 99, 1)" }}>
                        • Smart contract upgrade for team ops
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Phase 3 - Coming Soon */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-[#00FFE5] rounded-full flex items-center justify-center mr-8 relative z-10">
                  <span className="text-xl font-bold text-[#1A1A1A]">3</span>
                </div>
                <Card
                  className="flex-1 border-2 border-[#00FFE5] shadow-lg"
                  style={{ backgroundColor: isDarkMode ? "rgba(0, 255, 229, 0.05)" : "rgba(0, 255, 229, 0.05)" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                        Phase 3
                      </h3>
                      <span className="bg-[#00FFE5] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-medium">
                        Coming Soon
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-[#00FFE5]">Proof Engine (zk/AI)</h4>
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
                        • Token gated premium tools
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Mobile-friendly responsive UI
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • Ecosystem grants
                      </li>
                      <li style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}>
                        • More Features
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
                  <svg className="w-14 h-14" viewBox="0 0 318.6 318.6" fill="none">
                    <image href="/vercel-icon-light.svg" width="318.6" height="318.6" />
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
                <div className="w-20 h-20 mx-auto mb-0 flex items-center justify-center -translate-y-2">
                  <svg className="w-20 h-20" viewBox="0 0 318.6 318.6" fill="none">
                    <image href="/Remix.svg" width="318.6" height="318.6" />
                  </svg>
                </div>

                <h3 className="text-lg font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Remix
                </h3>
                <p
                  className="text-sm"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                >
                  Ethereum smart contract IDE
                </p>
              </CardContent>
            </Card>

            <Card
              className="p-6 text-center border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <img src="/baselogo.png" alt="Base Logo" className="w-14 h-14" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Base
                </h3>
                <p
                  className="text-sm"
                  style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                >
                  High-performance L2 blockchain
                </p>
              </CardContent>
            </Card>

            <Card
              className="p-6 text-center border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16" viewBox="0 0 318.6 318.6" fill="none">
                    <image href="/solidity.svg" width="318.6" height="318.6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Solidity
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
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                      fill={isDarkMode ? "#F5F7FA" : "#1A1A1A"}
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

      {/* Footer Section */}
      <footer className="bg-black py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-8">
            {/* Left Side - Social Links */}
            <div className="lg:flex-shrink-0">
              <h3 className="text-xl font-bold text-white mb-4">Our Socials</h3>
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/Hayder2007/Chain-Flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00FFE5] transition-colors group"
                >
                  <img
                    src="/github.png"
                    alt="GitHub"
                    className="w-6 h-6 filter brightness-75 group-hover:brightness-100 group-hover:hue-rotate-180 transition-all duration-300"
                  />
                </a>
                <a
                  href="https://x.com/chainflow_xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00FFE5] transition-colors"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/aaW6G3A427"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00FFE5] transition-colors group"
                >
                  <img
                    src="/discord.png"
                    alt="discord"
                    className="h-9 ml-[-7px] w-[50px] filter brightness-75 group-hover:brightness-100 group-hover:hue-rotate-180 transition-all duration-300"
                  />
                </a>
              </div>
            </div>

            {/* Right Side - Newsletter Subscription */}
            <div className="lg:max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE5] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#00FFE5] text-black font-semibold rounded-lg hover:bg-[#00FFE5]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {submitMessage && <p className="mt-3 text-sm text-[#00FFE5]">{submitMessage}</p>}
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="w-full h-px bg-gray-700 mb-6"></div>

          {/* License Line */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">© 2025 ChainFlow. All rights reserved. | Built on Base By Hayder.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
