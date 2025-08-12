import { createConfig, http } from "wagmi"
import { defineChain } from "viem"
import { injected, metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors"

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

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

export const config = createConfig({
  chains: [somniaTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
    metaMask(),
    coinbaseWallet({ appName: "ChainFlow" }),
    walletConnect({ projectId }),
  ],
  transports: {
    [somniaTestnet.id]: http(),
  },
})

export { somniaTestnet }
