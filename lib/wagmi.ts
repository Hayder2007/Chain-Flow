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

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId && typeof window !== "undefined") {
  console.error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set")
}

const getAppUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return "https://chainflow.app" // fallback for SSR
}

export const config = createConfig({
  chains: [somniaTestnet],
  connectors: projectId
    ? [
        walletConnect({
          projectId,
          metadata: {
            name: "ChainFlow",
            description: "Blockchain-powered productivity and habit tracking",
            url: getAppUrl(),
            icons: [`${getAppUrl()}/favicon.ico`],
          },
          showQrModal: true,
          disableProviderPing: true,
        }),
        injected({
          shimDisconnect: true,
        }),
        coinbaseWallet({
          appName: "ChainFlow",
          appLogoUrl: `${getAppUrl()}/favicon.ico`,
        }),
      ]
    : [injected({ shimDisconnect: true })],
  transports: {
    [somniaTestnet.id]: http("https://dream-rpc.somnia.network/"),
  },
  ssr: false,
})

if (typeof window !== "undefined") {
  // Suppress Web3Modal analytics errors
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn

  console.error = (...args) => {
    const message = args.join(" ")
    if (
      message.includes("Analytics SDK") ||
      message.includes("AnalyticsSDKApiError") ||
      message.includes("analytics") ||
      message.includes("fetch failed")
    ) {
      return // Suppress analytics-related errors
    }
    originalConsoleError.apply(console, args)
  }

  console.warn = (...args) => {
    const message = args.join(" ")
    if (
      message.includes("Analytics SDK") ||
      message.includes("AnalyticsSDKApiError") ||
      message.includes("analytics")
    ) {
      return // Suppress analytics-related warnings
    }
    originalConsoleWarn.apply(console, args)
  }
}

if (projectId && typeof window !== "undefined") {
  try {
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      enableAnalytics: false, // Keep analytics disabled to prevent SDK errors
      enableOnramp: false,
      enableWalletFeatures: false,
      enableSwaps: false,
      allowUnsupportedChain: true,
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
        url: getAppUrl(),
        icons: [`${getAppUrl()}/favicon.ico`],
      },
      featuredWalletIds: [
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
        "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
        "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
        "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget
      ],
    })
  } catch (error) {
    const errorMessage = error?.message || ""
    if (!errorMessage.includes("Analytics") && !errorMessage.includes("analytics")) {
      console.warn("Web3Modal initialization failed, continuing without modal:", error)
    }
  }
}

export { somniaTestnet }
