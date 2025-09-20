"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { baseMainnet } from "@/lib/wagmi"
import { useToast } from "@/hooks/use-toast"

export function WalletConnect({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const chainId = useChainId()
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const switchToBase = async () => {
    try {
      await switchChain({ chainId: baseMainnet.id })
      toast({
        title: "Network Switched",
        description: "Successfully connected to Base Mainnet",
      })
    } catch (error: any) {
      console.log("[v0] Switch chain error:", error)

      // If chain is not added to wallet, try to add it
      if (error.code === 4902 || error.message?.includes("Unrecognized chain ID")) {
        try {
          // Add Base Mainnet to wallet
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x2105", // 8453 in hex
                chainName: "Base",
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://mainnet.base.org"],
                blockExplorerUrls: ["https://basescan.org"],
              },
            ],
          })

          // After adding, try to switch again
          await switchChain({ chainId: baseMainnet.id })
          toast({
            title: "Base Network Added",
            description: "Base Mainnet has been added and selected",
          })
        } catch (addError: any) {
          console.log("[v0] Add chain error:", addError)
          toast({
            title: "Network Setup Failed",
            description: "Please manually add Base Mainnet to your wallet",
            variant: "destructive",
          })
        }
      } else if (error.code === 4001) {
        // User rejected the request
        toast({
          title: "Network Switch Cancelled",
          description: "You need to be on Base Mainnet to use this app",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to Base Mainnet",
          variant: "destructive",
        })
      }
    }
  }

  useEffect(() => {
    if (isConnected && chainId !== baseMainnet.id) {
      switchToBase()
    }
  }, [isConnected, chainId])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector })
      toast({
        title: "Wallet Connected",
        description: "Checking network...",
      })

      // Network switching will be handled by useEffect after connection
    } catch (error: any) {
      console.log("[v0] Connection error:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    }
    setIsOpen(false)
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
    setIsOpen(false)
  }

  const handleNetworkSwitch = () => {
    switchToBase()
  }

  const isWrongNetwork = isConnected && chainId !== baseMainnet.id

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {isWrongNetwork && (
          <Button
            onClick={handleNetworkSwitch}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-orange-500 border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 bg-transparent"
            disabled={isSwitching}
          >
            <AlertTriangle className="w-4 h-4" />
            {isSwitching ? "Switching..." : "Switch to Base"}
          </Button>
        )}

        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10"
              style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {formatAddress(address)}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            style={{
              backgroundColor: isDarkMode ? "#2A2A2A" : "#FFFFFF",
              borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
            }}
          >
            <DropdownMenuItem disabled className="text-xs opacity-60">
              Network: {chainId === baseMainnet.id ? "Base Mainnet" : "Wrong Network"}
            </DropdownMenuItem>
            {isWrongNetwork && (
              <DropdownMenuItem
                onClick={handleNetworkSwitch}
                className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                disabled={isSwitching}
              >
                {isSwitching ? "Switching..." : "Switch to Base"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10 bg-transparent"
          style={{
            color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
            borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
          }}
          disabled={isPending}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isPending ? "Connecting..." : "Connect Wallet"}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48"
        style={{
          backgroundColor: isDarkMode ? "#2A2A2A" : "#FFFFFF",
          borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
        }}
      >
        {connectors.map((connector) => (
          <DropdownMenuItem
            key={connector.uid}
            onClick={() => handleConnect(connector)}
            className="flex items-center gap-2 hover:bg-[#00FFE5]/10"
            style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}
          >
            <Wallet className="w-4 h-4" />
            {connector.name === "Injected" ? "MetaMask" : connector.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem disabled className="text-xs opacity-60 border-t mt-1 pt-2">
          Will connect to: Base Mainnet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
