import { http, fallback, type Transport } from "viem"

export const BASE_RPC_URLS = [
  "https://base.gateway.tenderly.co",
  "https://base-mainnet.public.blastapi.io",
  "https://base.llamarpc.com",
  "https://base-rpc.publicnode.com",
  "https://base.meowrpc.com",
  "https://mainnet.base.org",
]

export const SOMNIA_RPC_URLS = ["https://api.infra.mainnet.somnia.network"]

// Create fallback transports with retry logic
export function createBaseTransport(): Transport {
  return fallback(
    BASE_RPC_URLS.map((url) =>
      http(url, {
        timeout: 10_000,
        retryCount: 3,
        retryDelay: 1000,
      }),
    ),
    {
      rank: true, // Automatically rank transports by latency
    },
  )
}

export function createSomniaTransport(): Transport {
  return fallback(
    SOMNIA_RPC_URLS.map((url) =>
      http(url, {
        timeout: 10_000,
        retryCount: 3,
        retryDelay: 1000,
      }),
    ),
  )
}
