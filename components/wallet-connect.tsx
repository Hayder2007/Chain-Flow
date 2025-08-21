"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { somniaTestnet } from "@/lib/wagmi"
import { useToast } from "@/hooks/use-toast"

export function WalletConnect({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const chainId = useChainId()
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isConnected && chainId !== somniaTestnet.id) {
      // Auto-switch to Somnia network
      switchChain(
        { chainId: somniaTestnet.id },
        {
          onError: (error) => {
            toast({
              title: "Network Switch Required",
              description: "Please switch to Somnia Testnet to use this app",
              variant: "destructive",
            })
          },
          onSuccess: () => {
            toast({
              title: "Network Switched",
              description: "Successfully connected to Somnia Testnet",
            })
          },
        },
      )
    }
  }, [isConnected, chainId, switchChain, toast])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = (connector: any) => {
    connect(
      { connector },
      {
        onSuccess: () => {
          // Network switching will be handled by useEffect
          toast({
            title: "Wallet Connected",
            description: "Switching to Somnia Testnet...",
          })
        },
        onError: (error) => {
          toast({
            title: "Connection Failed",
            description: error.message,
            variant: "destructive",
          })
        },
      },
    )
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
    switchChain(
      { chainId: somniaTestnet.id },
      {
        onSuccess: () => {
          toast({
            title: "Network Switched",
            description: "Successfully switched to Somnia Testnet",
          })
        },
        onError: (error) => {
          toast({
            title: "Switch Failed",
            description: "Failed to switch network. Please try manually.",
            variant: "destructive",
          })
        },
      },
    )
  }

  const isWrongNetwork = isConnected && chainId !== somniaTestnet.id

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
            {isSwitching ? "Switching..." : "Switch to Somnia"}
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
              Network: {chainId === somniaTestnet.id ? "Somnia Testnet" : "Wrong Network"}
            </DropdownMenuItem>
            {isWrongNetwork && (
              <DropdownMenuItem
                onClick={handleNetworkSwitch}
                className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                disabled={isSwitching}
              >
                {isSwitching ? "Switching..." : "Switch to Somnia"}
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
          Will connect to: Somnia Testnet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
