import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { defineChain } from "viem"
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors"

const somniaTestnet = defineChain({
  id: 50312,
  name: "Somnia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Token",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.somnia.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://explorer.somnia.network",
    },
  },
  testnet: true,
})

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn("WalletConnect Project ID is not defined. Some wallet features may not work.")
}

// Create wagmiConfig - defaultWagmiConfig already includes WalletConnect
export const config = defaultWagmiConfig({
  chains: [somniaTestnet],
  projectId: projectId || "demo-project-id", // Use demo ID if not provided
  metadata: {
    name: "ChainFlow",
    description: "ChainFlow - Decentralized Task and Habit Management",
    url: "https://chainflow.xyz",
    icons: ["https://chainflow.xyz/logo.png"],
  },
  connectors: [injected({ shimDisconnect: true }), metaMask(), coinbaseWallet({ appName: "ChainFlow" })],
})

export { somniaTestnet }
