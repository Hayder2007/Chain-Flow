import { type NextRequest, NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { defineChain } from "viem"

const somniaTestnet = defineChain({
  id: 50312,
  name: "Somnia Testnet",
  network: "somnia-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Token",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network/"],
    },
    public: {
      http: ["https://dream-rpc.somnia.network/"],
    },
  },
})

const CONTRACT_ABI = [
  {
    inputs: [{ name: "habitId", type: "uint256" }],
    name: "getHabit",
    outputs: [
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "address" },
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
      chain: somniaTestnet,
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
    })
  } catch (error) {
    console.error("Error fetching habit:", error)
    return NextResponse.json({ error: "Failed to fetch habit" }, { status: 500 })
  }
}
