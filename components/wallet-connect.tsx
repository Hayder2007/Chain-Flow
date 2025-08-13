"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useDisconnect, useSwitchChain } from "wagmi"
import { Wallet, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { somniaTestnet } from "@/lib/wagmi"

export function WalletConnect({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { open } = useWeb3Modal()
  const { toast } = useToast()
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)

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
    try {
      await open()
    } catch (err) {
      console.error("Connection error:", err)
      toast({
        title: "Connection Error",
        description: "Failed to open wallet selection. Please try again.",
        variant: "destructive",
      })
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
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
