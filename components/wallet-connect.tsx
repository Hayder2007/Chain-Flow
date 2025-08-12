"use client"

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const SOMNIA_TESTNET_CHAIN_ID = 50312

export function WalletConnect({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const { address, isConnected, chainId } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { toast } = useToast()
  const [showModal, setShowModal] = useState(false)

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

  const handleConnect = (connector: any) => {
    connect({ connector })
    setShowModal(false)
  }

  if (!isConnected) {
    return (
      <>
        <Button
          onClick={() => setShowModal(true)}
          variant="outline"
          className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10 bg-transparent"
          style={{
            color: isDarkMode ? "#F5F7FA" : "#1A1A1A",
            borderColor: isDarkMode ? "rgba(245, 247, 250, 0.2)" : "rgba(0, 0, 0, 0.2)",
          }}
        >
          Connect Wallet
        </Button>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect a Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  variant="outline"
                  className="w-full justify-start h-12"
                >
                  <span className="ml-2">{connector.name}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <Button
      onClick={() => disconnect()}
      variant="ghost"
      className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-[#00FFE5]/10"
      style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}
    >
      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
    </Button>
  )
}
