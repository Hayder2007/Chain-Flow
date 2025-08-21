"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, CheckCircle, Flame, TrendingUp, Sun, Moon, ArrowLeft, Activity, Zap } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { useAccount } from "wagmi"
import { useHabitTracker, type Habit } from "@/hooks/use-habit-tracker"
import { useToast } from "@/hooks/use-toast"
import { BlockchainLoading } from "@/components/blockchain-loading"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function PersonalZone() {
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const { address } = useAccount()
  const { habits, addHabit, checkInHabit, getStats, isLoadingHabits } = useHabitTracker()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "fitness" as Habit["category"],
  })
  const [isCreatingHabit, setIsCreatingHabit] = useState(false)

  const stats = getStats

  const handleCreateHabit = useCallback(async () => {
    if (!newHabit.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive",
      })
      return
    }

    setIsCreatingHabit(true)

    const loadingToastId = toast({
      title: "Creating habit...",
      description: "Recording your habit on the blockchain",
    })

    try {
      await addHabit(newHabit)
      setNewHabit({ name: "", description: "", category: "fitness" })
      setIsCreateDialogOpen(false)
      loadingToastId.dismiss()
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Habit created successfully!",
        })
      }, 500)
    } catch (error) {
      loadingToastId.dismiss()
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingHabit(false)
    }
  }, [newHabit, addHabit, toast])

  const handleCheckIn = useCallback(
    async (habitId: string) => {
      const loadingToastId = toast({
        title: "Checking in...",
        description: "Verifying your progress on the blockchain",
      })

      try {
        await checkInHabit(Number.parseInt(habitId))
        loadingToastId.dismiss()
        setTimeout(() => {
          toast({
            title: "Great job!",
            description: "Habit checked in successfully",
          })
        }, 500)
      } catch (error) {
        loadingToastId.dismiss()
        toast({
          title: "Error",
          description: "Failed to check in. Please try again.",
          variant: "destructive",
        })
      }
    },
    [checkInHabit, toast],
  )

  const getCategoryIcon = useCallback((category: Habit["category"]) => {
    switch (category) {
      case "fitness":
        return <Activity className="w-4 h-4" />
      case "nutrition":
        return <Target className="w-4 h-4" />
      case "mindfulness":
        return <Sun className="w-4 h-4" />
      case "productivity":
        return <Zap className="w-4 h-4" />
      case "learning":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }, [])

  const getCategoryColor = useCallback((category: Habit["category"]) => {
    switch (category) {
      case "fitness":
        return "bg-red-500"
      case "nutrition":
        return "bg-green-500"
      case "mindfulness":
        return "bg-blue-500"
      case "productivity":
        return "bg-purple-500"
      case "learning":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }, [])

  if (isLoadingHabits) {
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
              <Link href="/app" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
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
                <Link href="/app" className="hover:text-[#00FFE5] transition-colors flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Zones
                </Link>
                <span>/</span>
                <span>Personal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(26, 26, 26, 0.1)",
                  color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                }}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Loading Content */}
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-center min-h-[60vh]">
            <BlockchainLoading message="Fetching your personal habits from the blockchain..." isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    )
  }

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
            <Link href="/app" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
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
              <Link href="/app" className="hover:text-[#00FFE5] transition-colors flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Zones
              </Link>
              <span>/</span>
              <span>Personal</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.1)" : "rgba(26, 26, 26, 0.1)",
                color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
              }}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                Personal Zone
              </h1>
              <p
                className="text-lg"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                Build lasting habits with blockchain accountability
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Habit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" style={{ backgroundColor: isDarkMode ? "#242424" : "white" }}>
                <DialogHeader>
                  <DialogTitle style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>Create New Habit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Habit Name
                    </Label>
                    <Input
                      id="name"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                      placeholder="e.g., Morning workout"
                      style={{
                        backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                      placeholder="Describe your habit..."
                      style={{
                        backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Category
                    </Label>
                    <Select
                      value={newHabit.category}
                      onValueChange={(value) => setNewHabit({ ...newHabit, category: value as Habit["category"] })}
                    >
                      <SelectTrigger
                        style={{
                          backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                          borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                          color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleCreateHabit}
                    disabled={isCreatingHabit}
                    className="w-full bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90 disabled:opacity-50"
                  >
                    {isCreatingHabit ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Habit"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card
              className="border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                    >
                      Total Habits
                    </p>
                    <p className="text-2xl font-bold text-[#00FFE5]">{stats.totalHabits}</p>
                  </div>
                  <Target className="w-8 h-8 text-[#00FFE5]" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                    >
                      Active Streaks
                    </p>
                    <p className="text-2xl font-bold text-[#00FFE5]">{stats.activeStreaks}</p>
                  </div>
                  <Flame className="w-8 h-8 text-[#00FFE5]" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                    >
                      Total Check-ins
                    </p>
                    <p className="text-2xl font-bold text-[#00FFE5]">{stats.totalCheckins}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-[#00FFE5]" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#00FFE5]/20"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                    >
                      Longest Streak
                    </p>
                    <p className="text-2xl font-bold text-[#00FFE5]">{stats.longestStreak}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#00FFE5]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Habits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <Card
                key={habit.id}
                className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300"
                style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(habit.category)}`} />
                      <CardTitle className="text-lg" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                        {habit.name}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      {getCategoryIcon(habit.category)}
                      <span className="capitalize">{habit.category}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm mb-4"
                    style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
                  >
                    {habit.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                      >
                        Current Streak
                      </span>
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-[#00FFE5]">{habit.streak} days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                      >
                        Total Check-ins
                      </span>
                      <span className="font-bold text-[#00FFE5]">{habit.totalCheckins}</span>
                    </div>

                    <Progress value={Math.min((habit.streak / 30) * 100, 100)} className="h-2" />

                    <div className="flex space-x-2 pt-2">
                      <Button
                        onClick={() => handleCheckIn(habit.id)}
                        className="flex-1 bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90"
                        disabled={!address}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Check In
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {habits.length === 0 && (
            <Card
              className="border-2 border-dashed border-[#00FFE5]/20 p-12 text-center"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.02)" : "rgba(255, 255, 255, 0.5)" }}
            >
              <Target className="w-16 h-16 text-[#00FFE5] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                No habits yet
              </h3>
              <p
                className="text-lg mb-6"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                Create your first habit to start building consistency
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Habit
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
