"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useDisconnect, useSwitchChain } from "wagmi"
import { Wallet, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { somniaTestnet } from "@/lib/wagmi"

interface WindowWithEthereum extends Window {
  ethereum?: {
    request: (args: { method: string }) => Promise<string[]>
  }
}

declare const window: WindowWithEthereum

export function WalletConnect({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { toast } = useToast()
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [web3Modal, setWeb3Modal] = useState<any>(null)

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== "undefined") {
      import("@web3modal/wagmi/react")
        .then((module) => {
          setWeb3Modal(module.useWeb3Modal)
        })
        .catch(() => {
          // Silently fail if Web3Modal is not available
        })
    }
  }, [])

  useEffect(() => {
    if (isConnected && chain && chain.id !== somniaTestnet.id) {
      setIsWrongNetwork(true)
      // Automatically attempt to switch to Somnia Testnet
      switchChain(
        { chainId: somniaTestnet.id },
        {
          onError: (error) => {
            console.error("Failed to switch network:", error)
            toast({
              title: "Network Switch Required",
              description:
                "Please switch to Somnia Testnet to use this app. You can add it manually in your wallet settings.",
              variant: "destructive",
            })
          },
          onSuccess: () => {
            setIsWrongNetwork(false)
            toast({
              title: "Network Switched",
              description: "Successfully connected to Somnia Testnet!",
            })
          },
        },
      )
    } else if (isConnected && chain && chain.id === somniaTestnet.id) {
      setIsWrongNetwork(false)
    }
  }, [isConnected, chain, switchChain, toast])

  useEffect(() => {
    if (isConnected && address && !isWrongNetwork) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)} on Somnia Testnet`,
      })
    }
  }, [isConnected, address, toast, isWrongNetwork])

  const handleConnect = async () => {
    if (!isMounted) return

    setIsConnecting(true)
    try {
      // Check if WalletConnect is properly configured
      if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
        // Fallback to injected wallet if WalletConnect is not configured
        if (typeof window !== "undefined" && window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" })
        } else {
          toast({
            title: "No Wallet Found",
            description: "Please install MetaMask or another Web3 wallet.",
            variant: "destructive",
          })
        }
      } else {
        if (web3Modal) {
          const { open } = web3Modal()
          await open()
        } else if (typeof window !== "undefined" && window.ethereum) {
          // Fallback to direct wallet connection
          await window.ethereum.request({ method: "eth_requestAccounts" })
        }
      }
    } catch (err) {
      console.error("Connection error:", err)
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleNetworkSwitch = async () => {
    try {
      await switchChain({ chainId: somniaTestnet.id })
    } catch (error) {
      console.error("Network switch failed:", error)
      toast({
        title: "Network Switch Failed",
        description: "Please manually switch to Somnia Testnet in your wallet.",
        variant: "destructive",
      })
    }
  }

  if (!isMounted) {
    return (
      <Button
        variant="outline"
        className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10 bg-transparent"
        style={{
          color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
          borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
        }}
        disabled
      >
        <Wallet className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (isConnected && isWrongNetwork) {
    return (
      <Button
        variant="destructive"
        className="flex items-center px-3 py-2 rounded-lg transition-colors"
        onClick={handleNetworkSwitch}
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Wrong Network
      </Button>
    )
  }

  if (address && isConnected && !isWrongNetwork) {
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
      className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10 bg-transparent"
      style={{
        color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
        borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
      }}
      onClick={handleConnect}
      disabled={isConnecting}
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
