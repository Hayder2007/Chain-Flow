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
    inputs: [
      { name: "habitId", type: "uint256" },
      { name: "dayIndex", type: "uint256" },
    ],
    name: "getCheckin",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export async function POST(request: NextRequest, { params }: { params: { habitId: string; dayIndex: string } }) {
  try {
    const { contractAddress, chainId } = await request.json()
    const habitId = Number.parseInt(params.habitId)
    const dayIndex = Number.parseInt(params.dayIndex)

    if (habitId < 0 || dayIndex < 0) {
      return NextResponse.json(false)
    }

    const client = createPublicClient({
      chain: baseMainnet,
      transport: http(),
    })

    try {
      const habitsCount = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            inputs: [],
            name: "getHabitsCount",
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "getHabitsCount",
      })

      // If habitId is greater than or equal to total habits count, habit doesn't exist
      if (BigInt(habitId) >= habitsCount) {
        return NextResponse.json(false)
      }
    } catch (error) {
      console.error("Error checking habits count:", error)
      return NextResponse.json(false)
    }

    const result = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getCheckin",
      args: [BigInt(habitId), BigInt(dayIndex)],
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error checking habit checkin:", error)
    return NextResponse.json(false)
  }
}
