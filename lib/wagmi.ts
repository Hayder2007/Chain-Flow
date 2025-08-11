import { createConfig, http } from "wagmi"
import { injected } from "wagmi/connectors"

const somniaTestnet = {
  id: 50312,
  name: "Somnia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Token",
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

export const config = createConfig({
  chains: [somniaTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [somniaTestnet.id]: http("https://dream-rpc.somnia.network/"),
  },
  ssr: false,
})
