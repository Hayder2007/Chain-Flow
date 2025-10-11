import { createConfig, http, fallback } from "wagmi"
import { injected } from "wagmi/connectors"

const baseMainnet = {
  id: 8453,
  name: "Base Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [
        "https://mainnet.base.org",
        "https://base.llamarpc.com",
        "https://base-rpc.publicnode.com",
        "https://base.meowrpc.com",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Base Explorer",
      url: "https://base.blockscout.com/",
    },
  },
  testnet: false,
} as const

const somniaMainnet = {
  id: 5031,
  name: "Somnia Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia",
    symbol: "SOMI",
  },
  rpcUrls: {
    default: {
      http: ["https://api.infra.mainnet.somnia.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://explorer.somnia.network",
    },
  },
  testnet: false,
} as const

export const config = createConfig({
  chains: [baseMainnet, somniaMainnet],
  connectors: [injected()],
  transports: {
    [baseMainnet.id]: fallback([
      http("https://mainnet.base.org"),
      http("https://base.llamarpc.com"),
      http("https://base-rpc.publicnode.com"),
      http("https://base.meowrpc.com"),
    ]),
    [somniaMainnet.id]: http("https://api.infra.mainnet.somnia.network"),
  },
  ssr: true,
})

export { baseMainnet, somniaMainnet }
