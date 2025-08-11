"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

export function WalletConnect({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const { address, isConnected } = useAccount()
  const { connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      console.error("Wallet connection error:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleConnect = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && !window.ethereum) {
        toast({
          title: "Wallet Not Found",
          description: "Please install MetaMask or another Web3 wallet to continue.",
          variant: "destructive",
        })
        return
      }

      await connect({
        connector: injected({
          target: "metaMask",
        }),
      })
    } catch (err) {
      console.error("Connection error:", err)
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
    }
  }, [isConnected, address, toast])

  if (address && isConnected) {
    return (
      <Button
        variant="ghost"
        className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10"
        style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}
        onClick={() => disconnect()}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {`${address.slice(0, 6)}…${address.slice(-4)}`}
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      disabled={isPending}
      className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10 bg-transparent"
      style={{
        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
      }}
      onClick={handleConnect}
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
