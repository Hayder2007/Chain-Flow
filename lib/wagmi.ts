import { createConfig, http } from "wagmi"
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
      http: ["https://mainnet.base.org"],
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

export const config = createConfig({
  chains: [baseMainnet],
  connectors: [injected()],
  transports: {
    [baseMainnet.id]: http(),
  },
  ssr: true,
})

export { baseMainnet }
