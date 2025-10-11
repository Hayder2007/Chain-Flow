import { type NextRequest, NextResponse } from "next/server"
import { createPublicClient, defineChain } from "viem"
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

const baseClient = createPublicClient({
  chain: baseMainnet,
  transport: createBaseTransport(),
})

const somniaClient = createPublicClient({
  chain: somniaMainnet,
  transport: createSomniaTransport(),
})

export async function POST(request: NextRequest, { params }: { params: { habitId: string; dayIndex: string } }) {
  try {
    const { contractAddress, chainId } = await request.json()
    const habitId = Number.parseInt(params.habitId)
    const dayIndex = Number.parseInt(params.dayIndex)

    if (habitId < 0 || dayIndex < 0) {
      return NextResponse.json(false)
    }

    const client = chainId === 5031 ? somniaClient : baseClient

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
