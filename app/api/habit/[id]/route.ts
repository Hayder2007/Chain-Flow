import { type NextRequest, NextResponse } from "next/server"
import { createPublicClient } from "viem"
import { defineChain } from "viem/chains"
import { createBaseTransport, createSomniaTransport } from "@/lib/rpc-config"

const baseMainnet = defineChain({
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
    default: { name: "Base Explorer", url: "https://base.blockscout.com/" },
  },
})

const somniaMainnet = defineChain({
  id: 5031,
  name: "Somnia Mainnet",
  network: "somnia-mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "SOMI",
    symbol: "SOMI",
  },
  rpcUrls: {
    default: {
      http: ["https://api.infra.mainnet.somnia.network/"],
    },
    public: {
      http: ["https://api.infra.mainnet.somnia.network/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://explorer.somnia.network",
    },
  },
})

const CONTRACT_ABI = [
  {
    inputs: [{ name: "habitId", type: "uint256" }],
    name: "getHabit",
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "category", type: "string" },
      { name: "creator", type: "address" },
      { name: "lastCheckinDay", type: "uint256" },
      { name: "currentStreak", type: "uint256" },
      { name: "maxStreak", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

const baseClient = createPublicClient({
  chain: baseMainnet,
  transport: createBaseTransport(),
})

const somniaClient = createPublicClient({
  chain: somniaMainnet,
  transport: createSomniaTransport(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { contractAddress, chainId } = await request.json()
    const habitId = Number.parseInt(params.id)

    const client = chainId === 5031 ? somniaClient : baseClient

    const result = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getHabit",
      args: [BigInt(habitId)],
    })

    return NextResponse.json({
      name: result[0],
      description: result[1],
      category: result[2],
      creator: result[3],
      lastCheckinDay: result[4],
      currentStreak: result[5],
      maxStreak: result[6],
    })
  } catch (error) {
    console.error("Error fetching habit:", error)
    return NextResponse.json({ error: "Failed to fetch habit" }, { status: 500 })
  }
}
