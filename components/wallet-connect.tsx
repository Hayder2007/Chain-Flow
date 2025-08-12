"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useSwitchChain } from "wagmi"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const SOMNIA_TESTNET_CHAIN_ID = 50312

export function WalletConnect({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const { open } = useWeb3Modal()
  const { address, isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const { toast } = useToast()

  // Check network and prompt to switch if needed
  useEffect(() => {
    if (isConnected && chainId !== SOMNIA_TESTNET_CHAIN_ID) {
      toast({
        title: "Switch Network",
        description: "Please switch to Somnia Testnet to use this app.",
        action: (
          <Button
            size="sm"
            onClick={() => {
              try {
                switchChain({ chainId: SOMNIA_TESTNET_CHAIN_ID })
              } catch (error) {
                toast({
                  title: "Network Switch Failed",
                  description: "Please manually switch to Somnia Testnet in your wallet.",
                  variant: "destructive",
                })
              }
            }}
          >
            Switch Network
          </Button>
        ),
      })
    }
  }, [isConnected, chainId, switchChain, toast])

  if (!isConnected) {
    return (
      <Button
        onClick={() => open()}
        variant="outline"
        className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10 bg-transparent"
        style={{
          color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
          borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
        }}
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <Button
      onClick={() => open()}
      variant="ghost"
      className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10"
      style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}
    >
      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
    </Button>
  )
}
