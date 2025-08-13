import { createConfig, http } from "wagmi"
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors"
import { createWeb3Modal } from "@web3modal/wagmi/react"

const somniaTestnet = {
  id: 50312,
  name: "Somnia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Test Token",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://shannon-explorer.somnia.network/",
    },
  },
  testnet: true,
}

// Get projectId from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set")
}

export const config = createConfig({
  chains: [somniaTestnet],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: "ChainFlow",
        description: "Blockchain-powered productivity and habit tracking",
        url: "https://chainflow.app",
        icons: ["https://chainflow.app/logo.png"],
      },
    }),
    injected(), // Single injected connector - Web3Modal will handle wallet detection
    coinbaseWallet({
      appName: "ChainFlow",
      appLogoUrl: "https://chainflow.app/logo.png",
    }),
  ],
  transports: {
    [somniaTestnet.id]: http("https://dream-rpc.somnia.network/"),
  },
  ssr: false,
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: false,
  themeMode: "dark",
  themeVariables: {
    "--w3m-color-mix": "#00FFE5",
    "--w3m-color-mix-strength": 20,
    "--w3m-accent": "#00FFE5",
    "--w3m-border-radius-master": "8px",
  },
  metadata: {
    name: "ChainFlow",
    description: "Blockchain-powered productivity and habit tracking",
    url: "https://chainflow.app",
    icons: ["https://chainflow.app/logo.png"],
  },
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
    "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget
  ],
})

export { somniaTestnet }
