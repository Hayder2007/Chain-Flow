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
    inputs: [
      { name: "habitId", type: "uint256" },
      { name: "dayIndex", type: "uint256" },
    ],
    name: "isCheckedIn",
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

    const client = createPublicClient({
      chain: somniaTestnet,
      transport: http(),
    })

    const result = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "isCheckedIn",
      args: [BigInt(habitId), BigInt(dayIndex)],
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error checking habit checkin:", error)
    return NextResponse.json(false)
  }
}
