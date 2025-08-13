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
import { BlockchainLoading } from "@/components/blockchain-loading"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function WorkZone() {
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const { address } = useAccount()
  const { tasks, createTask, updateTaskStatus, submitTask, verifyTask, deleteTask, getStats } = useTaskBoard()
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
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingTask, setIsCreatingTask] = useState(false)

  const stats = getStats

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // 2.5 second loading simulation

    return () => clearTimeout(timer)
  }, [])

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

  const handleSubmitTask = (taskId: string) => {
    if (!submissionUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide a submission URL",
        variant: "destructive",
      })
      return
    }

    const loadingToast = toast({
      title: "Submitting task...",
      description: "Recording submission on the blockchain",
    })

    setTimeout(() => {
      submitTask(taskId, submissionUrl)
      setSubmissionUrl("")
      loadingToast.dismiss()
      toast({
        title: "Success",
        description: "Task submitted for review!",
      })
    }, 1200)
  }

  const handleVerifyTask = (taskId: string) => {
    const loadingToast = toast({
      title: "Verifying task...",
      description: "Processing verification on the blockchain",
    })

    setTimeout(() => {
      verifyTask(taskId, verificationNotes)
      setVerificationNotes("")
      loadingToast.dismiss()
      toast({
        title: "Success",
        description: "Task verified successfully!",
      })
    }, 1500)
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500"
      case "assigned":
        return "bg-yellow-500"
      case "submitted":
        return "bg-purple-500"
      case "verified":
        return "bg-green-500"
      case "paid":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "open":
        return <FileText className="w-4 h-4" />
      case "assigned":
        return <Users className="w-4 h-4" />
      case "submitted":
        return <Send className="w-4 h-4" />
      case "verified":
        return <Verified className="w-4 h-4" />
      case "paid":
        return <DollarSign className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filterTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  if (isLoading) {
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
                <span>Work</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
          <div className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-center min-h-[60vh]">
            <BlockchainLoading message="Fetching your work tasks from the blockchain..." isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    )
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

          <Tabs defaultValue="all" className="w-full">
            <TabsList
              className="grid w-full grid-cols-6"
              style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
            >
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDarkMode={isDarkMode}
                    address={address}
                    onSubmit={handleSubmitTask}
                    onVerify={handleVerifyTask}
                    onDelete={deleteTask}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    submissionUrl={submissionUrl}
                    setSubmissionUrl={setSubmissionUrl}
                    verificationNotes={verificationNotes}
                    setVerificationNotes={setVerificationNotes}
                  />
                ))}
              </div>
            </TabsContent>

            {["open", "assigned", "submitted", "verified", "paid"].map((status) => (
              <TabsContent key={status} value={status} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterTasksByStatus(status as Task["status"]).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isDarkMode={isDarkMode}
                      address={address}
                      onSubmit={handleSubmitTask}
                      onVerify={handleVerifyTask}
                      onDelete={deleteTask}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                      submissionUrl={submissionUrl}
                      setSubmissionUrl={setSubmissionUrl}
                      verificationNotes={verificationNotes}
                      setVerificationNotes={setVerificationNotes}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {tasks.length === 0 && (
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
                Create your first task to start managing your team
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90"
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
  onSubmit,
  onVerify,
  onDelete,
  getStatusColor,
  getStatusIcon,
  submissionUrl,
  setSubmissionUrl,
  verificationNotes,
  setVerificationNotes,
}: {
  task: Task
  isDarkMode: boolean
  address: string | undefined
  onSubmit: (taskId: string) => void
  onVerify: (taskId: string) => void
  onDelete: (taskId: string) => void
  getStatusColor: (status: Task["status"]) => string
  getStatusIcon: (status: Task["status"]) => React.ReactNode
  submissionUrl: string
  setSubmissionUrl: (url: string) => void
  verificationNotes: string
  setVerificationNotes: (notes: string) => void
}) {
  const [showSubmissionInput, setShowSubmissionInput] = useState(false)
  const [showVerificationInput, setShowVerificationInput] = useState(false)

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
            <span className="capitalize">{task.status}</span>
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

        {task.submissionUrl && (
          <div className="mb-4">
            <p
              className="text-sm font-medium mb-1"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
            >
              Submission
            </p>
            <a
              href={task.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#00FFE5] hover:underline break-all"
            >
              {task.submissionUrl}
            </a>
          </div>
        )}

        {task.verificationNotes && (
          <div className="mb-4">
            <p
              className="text-sm font-medium mb-1"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
            >
              Verification Notes
            </p>
            <p
              className="text-sm"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              {task.verificationNotes}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {task.status === "assigned" && address === task.assignee && (
            <>
              {!showSubmissionInput ? (
                <Button
                  onClick={() => setShowSubmissionInput(true)}
                  className="w-full bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Work
                </Button>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="Submission URL (GitHub, Drive, etc.)"
                    style={{
                      backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                      borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                      color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                    }}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onSubmit(task.id)}
                      className="flex-1 bg-[#00FFE5] text-[#1A1A1A] hover:bg-[#00FFE5]/90"
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSubmissionInput(false)}
                      style={{
                        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {task.status === "submitted" && address === task.creator && (
            <>
              {!showVerificationInput ? (
                <Button
                  onClick={() => setShowVerificationInput(true)}
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                >
                  <Verified className="w-4 h-4 mr-2" />
                  Verify & Approve
                </Button>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Verification notes (optional)"
                    style={{
                      backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white",
                      borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                      color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                    }}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onVerify(task.id)}
                      className="flex-1 bg-green-500 text-white hover:bg-green-600"
                    >
                      Verify
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowVerificationInput(false)}
                      style={{
                        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {address === task.creator && (
            <Button
              variant="outline"
              onClick={() => onDelete(task.id)}
              className="w-full"
              style={{
                borderColor: "rgba(239, 68, 68, 0.5)",
                color: "rgb(239, 68, 68)",
              }}
            >
              Delete Task
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
