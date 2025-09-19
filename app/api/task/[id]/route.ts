import { type NextRequest, NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { defineChain } from "viem"

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

const WORK_CONTRACT_ADDRESS = "0x86D160b97534069E33362a713f47CFc8BD503346"

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
  chain: baseMainnet,
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
