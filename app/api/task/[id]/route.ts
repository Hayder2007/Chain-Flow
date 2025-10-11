import { type NextRequest, NextResponse } from "next/server"
import { createPublicClient } from "viem"
import { defineChain } from "viem"
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
  nativeCurrency: {
    decimals: 18,
    name: "Somnia",
    symbol: "SOMI",
  },
  rpcUrls: {
    default: {
      http: ["https://api.infra.mainnet.somnia.network"],
    },
  },
  blockExplorers: {
    default: { name: "Somnia Explorer", url: "https://explorer.somnia.network" },
  },
})

const WORK_CONTRACT_ADDRESSES = {
  8453: "0x86D160b97534069E33362a713f47CFc8BD503346", // Base Mainnet
  5031: "0xC28825AA274098Ff80e910BB8eC932456d4fdfD5", // Somnia Mainnet
} as const

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

const baseClient = createPublicClient({
  chain: baseMainnet,
  transport: createBaseTransport(),
})

const somniaClient = createPublicClient({
  chain: somniaMainnet,
  transport: createSomniaTransport(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = Number.parseInt(params.id)

    const { searchParams } = new URL(request.url)
    const chainId = Number(searchParams.get("chainId")) || 8453

    const client = chainId === 5031 ? somniaClient : baseClient
    const contractAddress =
      WORK_CONTRACT_ADDRESSES[chainId as keyof typeof WORK_CONTRACT_ADDRESSES] || WORK_CONTRACT_ADDRESSES[8453]

    const result = await client.readContract({
      address: contractAddress as `0x${string}`,
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
      status,
    })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}
