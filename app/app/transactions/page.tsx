"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Sun,
  Moon,
  History,
  ExternalLink,
  Search,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Target,
  Briefcase,
  Wallet,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { WalletConnect } from "@/components/wallet-connect"
import { useTransactionHistory, type Transaction } from "@/hooks/use-transaction-history"
import { useActiveAccount } from "thirdweb/react"

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterZone, setFilterZone] = useState<"all" | "personal" | "work">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "failed">("all")
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const account = useActiveAccount()
  const { transactions, getStats, clearTransactions } = useTransactionHistory()

  const stats = getStats()

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.details.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.details.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.hash && tx.hash.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesZone = filterZone === "all" || tx.zone === filterZone
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus

    return matchesSearch && matchesZone && matchesStatus
  })

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    }
  }

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "habit_create":
      case "habit_checkin":
        return <Target className="w-4 h-4 text-[#00FFE5]" />
      case "task_create":
      case "task_submit":
      case "task_verify":
      case "task_pay":
        return <Briefcase className="w-4 h-4 text-[#00FFE5]" />
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const exportTransactions = () => {
    const dataStr = JSON.stringify(transactions, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `chainflow_transactions_${account?.address?.slice(0, 8)}_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
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
                Zone Selector
              </Link>
              <span>/</span>
              <span>Transaction History</span>
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
      {!account && (
        <div className="fixed top-20 left-0 right-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div
              className="flex items-center justify-between p-4 rounded-lg border border-orange-500/20"
              style={{ backgroundColor: isDarkMode ? "rgba(255, 165, 0, 0.1)" : "rgba(255, 165, 0, 0.1)" }}
            >
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-orange-500" />
                <span style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                  Connect your wallet to view your transaction history
                </span>
              </div>
              <WalletConnect isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      )}

      <div className="pt-20" style={{ marginTop: !account ? "60px" : "0" }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              Transaction History
            </h1>
            <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
              Track all your onchain activities across personal and work zones
            </p>
          </div>

          {account ? (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card
                  className="border-2 border-[#00FFE5]/20"
                  style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="w-8 h-8 text-[#00FFE5]" />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Total Transactions
                    </h3>
                    <div className="text-2xl font-bold text-[#00FFE5]">{stats.total}</div>
                  </CardContent>
                </Card>

                <Card
                  className="border-2 border-[#00FFE5]/20"
                  style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Confirmed
                    </h3>
                    <div className="text-2xl font-bold text-green-500">{stats.confirmed}</div>
                  </CardContent>
                </Card>

                <Card
                  className="border-2 border-[#00FFE5]/20"
                  style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="w-8 h-8 text-[#00FFE5]" />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Personal Zone
                    </h3>
                    <div className="text-2xl font-bold text-[#00FFE5]">{stats.personalTxs}</div>
                  </CardContent>
                </Card>

                <Card
                  className="border-2 border-[#00FFE5]/20"
                  style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Briefcase className="w-8 h-8 text-[#00FFE5]" />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                      Work Zone
                    </h3>
                    <div className="text-2xl font-bold text-[#00FFE5]">{stats.workTxs}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <Card className="mb-8" style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`pl-10 ${
                            isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : ""
                          }`}
                        />
                      </div>
                      <select
                        value={filterZone}
                        onChange={(e) => setFilterZone(e.target.value as any)}
                        className={`px-3 py-2 border rounded-md ${
                          isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"
                        }`}
                      >
                        <option value="all">All Zones</option>
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className={`px-3 py-2 border rounded-md ${
                          isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"
                        }`}
                      >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={exportTransactions}
                        disabled={transactions.length === 0}
                        className={isDarkMode ? "border-gray-700 text-white hover:bg-gray-800" : ""}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearTransactions}
                        disabled={transactions.length === 0}
                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction List */}
              <Card style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}>
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                    <History className="w-6 h-6 text-[#00FFE5] mr-3" />
                    Recent Transactions ({filteredTransactions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                        No transactions found
                      </h3>
                      <p style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                        {transactions.length === 0
                          ? "Start using ChainFlow to see your transaction history here"
                          : "Try adjusting your search or filter criteria"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-[#00FFE5]/20 hover:border-[#00FFE5]/40 transition-colors"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(tx.type)}
                              {getStatusIcon(tx.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-1">
                                <h4 className="font-medium" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                                  {tx.details.title}
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${tx.zone === "personal" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"}`}
                                >
                                  {tx.zone}
                                </Badge>
                              </div>
                              <p
                                className="text-sm"
                                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}
                              >
                                {tx.details.description}
                              </p>
                              {tx.details.amount && (
                                <p className="text-sm font-medium text-[#00FFE5] mt-1">{tx.details.amount}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                              <p
                                className="text-xs mt-1"
                                style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.5)" : "rgba(107, 114, 128, 0.7)" }}
                              >
                                {formatTimestamp(tx.timestamp)}
                              </p>
                            </div>
                            {tx.hash && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(`https://testnet-explorer.somnia.network/tx/${tx.hash}`, "_blank")
                                }
                                className="p-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
                Connect Your Wallet
              </h3>
              <p className="mb-6" style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.7)" : "rgba(107, 114, 128, 1)" }}>
                Connect your wallet to view your transaction history and track all your onchain activities
              </p>
              <WalletConnect isDarkMode={isDarkMode} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
