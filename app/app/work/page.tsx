"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Plus,
  CheckCircle,
  Clock,
  DollarSign,
  Sun,
  Moon,
  ArrowLeft,
  FileText,
  Send,
  Verified,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { WalletConnect } from "@/components/wallet-connect"
import { useAccount } from "wagmi"
import { useTaskBoard, type Task } from "@/hooks/use-task-board"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function WorkZone() {
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const [mounted, setMounted] = useState(false)
  const { address } = useAccount()
  const { tasks, createTask, completeTaskByAssignee, confirmTaskByCreator, getStats, isLoading } = useTaskBoard()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [submissionUrl, setSubmissionUrl] = useState("")
  const [verificationNotes, setVerificationNotes] = useState("")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    reward: "",
  })
  const [isCreatingTask, setIsCreatingTask] = useState(false)

  const stats = getStats

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F7FA" }}
      >
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !newTask.assignee.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreatingTask(true)

    const loadingToast = toast({
      title: "Creating task...",
      description: "Recording task on the blockchain",
    })

    setTimeout(() => {
      createTask({
        ...newTask,
        creator: address || "anonymous",
      })
      setNewTask({ title: "", description: "", assignee: "", reward: "" })
      setIsCreateDialogOpen(false)
      setIsCreatingTask(false)

      loadingToast.dismiss()
      toast({
        title: "Success",
        description: "Task created successfully!",
      })
    }, 1800)
  }

  const handleMarkDone = (taskId: string) => {
    const loadingToast = toast({
      title: "Marking task done...",
      description: "Recording completion on the blockchain",
    })

    setTimeout(() => {
      completeTaskByAssignee(Number(taskId))
      loadingToast.dismiss()
      toast({
        title: "Success",
        description: "Task marked as done!",
      })
    }, 1200)
  }

  const handleConfirmDone = (taskId: string) => {
    const loadingToast = toast({
      title: "Confirming task...",
      description: "Processing confirmation on the blockchain",
    })

    setTimeout(() => {
      confirmTaskByCreator(Number(taskId))
      loadingToast.dismiss()
      toast({
        title: "Success",
        description: "Task confirmed successfully!",
      })
    }, 1500)
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-500"
      case "doneByAssignee":
        return "bg-purple-500"
      case "confirmedByCreator":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return <Users className="w-4 h-4" />
      case "doneByAssignee":
        return <Send className="w-4 h-4" />
      case "confirmedByCreator":
        return <Verified className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filterTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F7FA" }}>
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
              <Link href="/app" className="hover:text-[#00FFE5] transition-colors flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Zones
              </Link>
              <span>/</span>
              <span>Work</span>
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

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                Work Zone
              </h1>
              <p
                className="text-lg"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                Manage teams and projects with transparent workflows
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" style={{ backgroundColor: isDarkMode ? "#242424" : "white" }}>
                <DialogHeader>
                  <DialogTitle style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Task Title *
                    </Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="e.g., Design landing page"
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
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Describe the task requirements..."
                      style={{
                        backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assignee" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Assignee Wallet *
                    </Label>
                    <Input
                      id="assignee"
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      placeholder="0x..."
                      style={{
                        backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Reward (ETH)
                    </Label>
                    <Input
                      id="reward"
                      value={newTask.reward}
                      onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                      placeholder="0.1"
                      type="number"
                      step="0.01"
                      style={{
                        backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleCreateTask}
                    disabled={isCreatingTask}
                    className="w-full bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90 disabled:opacity-50"
                  >
                    {isCreatingTask ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Task"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

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
                      Total Tasks
                    </p>
                    <p className="text-2xl font-bold text-[#00FFE5]">{stats.totalTasks}</p>
                  </div>
                  <FileText className="w-8 h-8 text-[#00FFE5]" />
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
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-[#00FFE5]">{stats.completedTasks}</p>
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
                      Pending Review
                    </p>
                    <p className="text-2xl font-bold text-[#00FFE5]">{stats.pendingTasks}</p>
                  </div>
                  <Clock className="w-8 h-8 text-[#00FFE5]" />
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
                      Total Rewards
                    </p>
                    <p className="text-2xl font-bold text-[#00FFE5]">{stats.totalRewards.toFixed(3)} ETH</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-[#00FFE5]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading && address ? (
            <Card
              className="border-2 border-[#00FFE5]/20 p-12 text-center"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <div className="flex flex-col items-center space-y-4">
                <LoadingSpinner size="lg" className="text-[#00FFE5]" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    Loading tasks...
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
                  >
                    Fetching your tasks from the blockchain
                  </p>
                </div>
              </div>
            </Card>
          ) : tasks.length > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList
                className="grid w-full grid-cols-4"
                style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
              >
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="assigned">Assigned</TabsTrigger>
                <TabsTrigger value="doneByAssignee">Done</TabsTrigger>
                <TabsTrigger value="confirmedByCreator">Confirmed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isDarkMode={isDarkMode}
                      address={address}
                      onMarkDone={handleMarkDone}
                      onConfirmDone={handleConfirmDone}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </div>
              </TabsContent>

              {["assigned", "doneByAssignee", "confirmedByCreator"].map((status) => (
                <TabsContent key={status} value={status} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterTasksByStatus(status as Task["status"]).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isDarkMode={isDarkMode}
                        address={address}
                        onMarkDone={handleMarkDone}
                        onConfirmDone={handleConfirmDone}
                        getStatusColor={getStatusColor}
                        getStatusIcon={getStatusIcon}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card
              className="border-2 border-dashed border-[#00FFE5]/20 p-12 text-center"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.02)" : "rgba(255, 255, 255, 0.5)" }}
            >
              <Users className="w-16 h-16 text-[#00FFE5] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                No tasks yet
              </h3>
              <p
                className="text-lg mb-6"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
              >
                {address ? "Create your first task to start managing your team" : "Connect your wallet to create tasks"}
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90"
                disabled={!address}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Task
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskCard({
  task,
  isDarkMode,
  address,
  onMarkDone,
  onConfirmDone,
  getStatusColor,
  getStatusIcon,
}: {
  task: Task
  isDarkMode: boolean
  address: string | undefined
  onMarkDone: (taskId: string) => void
  onConfirmDone: (taskId: string) => void
  getStatusColor: (status: Task["status"]) => string
  getStatusIcon: (status: Task["status"]) => React.ReactNode
}) {
  return (
    <Card
      className="border-2 border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-all duration-300"
      style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
            {task.title}
          </CardTitle>
          <Badge className={`${getStatusColor(task.status)} text-white flex items-center space-x-1`}>
            {getStatusIcon(task.status)}
            <span className="capitalize">
              {task.status === "doneByAssignee"
                ? "Done"
                : task.status === "confirmedByCreator"
                  ? "Confirmed"
                  : "Assigned"}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className="text-sm mb-4"
          style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
        >
          {task.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-medium"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
            >
              Assignee
            </span>
            <span className="text-sm font-mono text-[#00FFE5]">
              {task.assignee.slice(0, 6)}...{task.assignee.slice(-4)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-sm font-medium"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
            >
              Creator
            </span>
            <span className="text-sm font-mono text-[#00FFE5]">
              {task.creator.slice(0, 6)}...{task.creator.slice(-4)}
            </span>
          </div>

          {task.reward && (
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
              >
                Reward
              </span>
              <span className="font-bold text-[#00FFE5]">{task.reward} ETH</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {/* Assignee can mark task as done */}
          {task.status === "assigned" && address?.toLowerCase() === task.assignee.toLowerCase() && (
            <Button
              onClick={() => onMarkDone(task.id.toString())}
              className="w-full bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Done
            </Button>
          )}

          {/* Creator can confirm task completion */}
          {task.status === "doneByAssignee" && address?.toLowerCase() === task.creator.toLowerCase() && (
            <Button
              onClick={() => onConfirmDone(task.id.toString())}
              className="w-full bg-green-500 text-white hover:bg-green-600"
            >
              <Verified className="w-4 h-4 mr-2" />
              Confirm Done
            </Button>
          )}

          {/* Show status for completed tasks */}
          {task.status === "confirmedByCreator" && (
            <div className="text-center py-2">
              <span className="text-green-500 font-medium">✓ Task Completed & Confirmed</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
