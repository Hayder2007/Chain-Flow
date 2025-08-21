import { type NextRequest, NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { defineChain } from "viem"

const somniaTestnet = defineChain({
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
    default: { name: "Somnia Explorer", url: "https://shannon-explorer.somnia.network/" },
  },
})

const WORK_CONTRACT_ADDRESS = "0x29b0A9093D27C7a846ab5beD9378b04607049297"

const WORK_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_taskId", type: "uint256" }],
    name: "getTask",
    outputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "reward", type: "string" },
      { internalType: "address", name: "assignee", type: "address" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint8", name: "status", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

const client = createPublicClient({
  chain: somniaTestnet,
  transport: http(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = Number.parseInt(params.id)

    const result = await client.readContract({
      address: WORK_CONTRACT_ADDRESS as `0x${string}`,
      abi: WORK_CONTRACT_ABI,
      functionName: "getTask",
      args: [BigInt(taskId)],
    })

    const [title, description, reward, assignee, creator, status] = result

    return NextResponse.json({
      title,
      description,
      reward,
      assignee,
      creator,
      status, // Now returns status enum instead of boolean completed
    })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}
