import { type NextRequest, NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { defineChain } from "viem"

const baseMainnet = defineChain({
  id: 8453,
  name: "Base Mainnet",
  network: "base-mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"],
    },
    public: {
      http: ["https://mainnet.base.org"],
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { contractAddress, chainId } = await request.json()
    const habitId = Number.parseInt(params.id)

    const client = createPublicClient({
      chain: baseMainnet,
      transport: http(),
    })

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
