"use client"

import { useState, useEffect, useMemo } from "react"
import {
  useAccount,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useReadContract,
  useWatchContractEvent,
  usePublicClient,
  useWalletClient,
} from "wagmi"
import { toast } from "@/hooks/use-toast"

export interface Task {
  id: number
  title: string
  description: string
  assignee: string
  creator: string
  reward: string
  status: "assigned" | "doneByAssignee" | "confirmedByCreator"
  submissionUrl?: string
  verificationNotes?: string
}

const WORK_CONTRACT_ADDRESSES = {
  8453: "0x86D160b97534069E33362a713f47CFc8BD503346", // Base Mainnet
  5031: "0xC28825AA274098Ff80e910BB8eC932456d4fdfD5", // Somnia Mainnet
} as const

const SUPPORTED_CHAIN_IDS = [8453, 5031] as const
type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

const CACHE_KEY_PREFIX = "chainflow_tasks_"
const CACHE_EXPIRATION_MS = 5 * 60 * 1000 // 5 minutes

const WORK_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "taskId", type: "uint256" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
    ],
    name: "TaskConfirmedByCreator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "taskId", type: "uint256" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: true, internalType: "address", name: "assignee", type: "address" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
      { indexed: false, internalType: "string", name: "reward", type: "string" },
    ],
    name: "TaskCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "taskId", type: "uint256" },
      { indexed: true, internalType: "address", name: "assignee", type: "address" },
    ],
    name: "TaskDoneByAssignee",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "_taskId", type: "uint256" }],
    name: "completeTaskByAssignee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_taskId", type: "uint256" }],
    name: "confirmTaskByCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "address", name: "_assignee", type: "address" },
      { internalType: "string", name: "_reward", type: "string" },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
  {
    inputs: [],
    name: "getTasksCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export function useTaskBoard() {
  const { address, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [isCompletingTask, setIsCompletingTask] = useState(false)
  const [isConfirmingTask, setIsConfirmingTask] = useState(false)
  const [transactionError, setTransactionError] = useState<string | null>(null)
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>()

  const currentContractAddress = useMemo(() => {
    if (!chainId || !SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)) {
      return WORK_CONTRACT_ADDRESSES[8453] // Default to Base
    }
    return WORK_CONTRACT_ADDRESSES[chainId as SupportedChainId]
  }, [chainId])

  const isChainSupported = useMemo(() => {
    return chainId ? SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId) : false
  }, [chainId])

  const { isLoading: isConfirmingReceipt, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: currentTxHash,
  })

  const { data: tasksCount, refetch: refetchTasksCount } = useReadContract({
    address: currentContractAddress as `0x${string}`,
    abi: WORK_CONTRACT_ABI,
    functionName: "getTasksCount",
    chainId: chainId,
  })

  const getCacheKey = (walletAddress: string, chain: number) =>
    `${CACHE_KEY_PREFIX}${walletAddress.toLowerCase()}_${chain}`

  const getCachedTasks = (walletAddress: string, chain: number): Task[] | null => {
    try {
      const cached = sessionStorage.getItem(getCacheKey(walletAddress, chain))
      if (!cached) return null

      const { data, timestamp } = JSON.parse(cached)
      const now = Date.now()

      if (now - timestamp > CACHE_EXPIRATION_MS) {
        sessionStorage.removeItem(getCacheKey(walletAddress, chain))
        return null
      }

      return data
    } catch (error) {
      console.error("Error reading cached tasks:", error)
      return null
    }
  }

  const setCachedTasks = (walletAddress: string, chain: number, tasks: Task[]) => {
    try {
      const cacheData = {
        data: tasks,
        timestamp: Date.now(),
      }
      sessionStorage.setItem(getCacheKey(walletAddress, chain), JSON.stringify(cacheData))
    } catch (error) {
      console.error("Error caching tasks:", error)
    }
  }

  const clearCache = (walletAddress?: string, chain?: number) => {
    try {
      if (walletAddress && chain) {
        sessionStorage.removeItem(getCacheKey(walletAddress, chain))
      } else {
        // Clear all chainflow task caches
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith(CACHE_KEY_PREFIX)) {
            sessionStorage.removeItem(key)
          }
        })
      }
    } catch (error) {
      console.error("Error clearing cache:", error)
    }
  }

  useWatchContractEvent({
    address: currentContractAddress as `0x${string}`,
    abi: WORK_CONTRACT_ABI,
    eventName: "TaskCreated",
    onLogs(logs) {
      console.log("[v0] TaskCreated event:", logs)
      if (address && chainId) clearCache(address, chainId)
      refreshTasksData(true)
    },
  })

  useWatchContractEvent({
    address: currentContractAddress as `0x${string}`,
    abi: WORK_CONTRACT_ABI,
    eventName: "TaskDoneByAssignee",
    onLogs(logs) {
      console.log("[v0] TaskDoneByAssignee event:", logs)
      if (address && chainId) clearCache(address, chainId)
      refreshTasksData(true)
    },
  })

  useWatchContractEvent({
    address: currentContractAddress as `0x${string}`,
    abi: WORK_CONTRACT_ABI,
    eventName: "TaskConfirmedByCreator",
    onLogs(logs) {
      console.log("[v0] TaskConfirmedByCreator event:", logs)
      if (address && chainId) clearCache(address, chainId)
      refreshTasksData(true)
    },
  })

  const mapStatusFromContract = (statusNumber: number): Task["status"] => {
    switch (statusNumber) {
      case 0:
        return "assigned"
      case 1:
        return "doneByAssignee"
      case 2:
        return "confirmedByCreator"
      default:
        return "assigned"
    }
  }

  const refreshTasksData = async (forceRefresh = false) => {
    if (!address || !chainId) return

    if (!forceRefresh) {
      const cachedTasks = getCachedTasks(address, chainId)
      if (cachedTasks) {
        setTasks(cachedTasks)
        return
      }
    }

    setIsLoading(true)

    try {
      const { data: freshTasksCount } = await refetchTasksCount()
      const count = Number(freshTasksCount || 0)

      if (count === 0) {
        const emptyTasks: Task[] = []
        setTasks(emptyTasks)
        setCachedTasks(address, chainId, emptyTasks)
        setIsLoading(false)
        return
      }

      const loadedTasks: Task[] = []

      for (let i = 0; i < count; i++) {
        try {
          const taskData = await fetch(`/api/task/${i}?chainId=${chainId}`, {
            method: "GET",
          }).then((res) => res.json())

          if (taskData && taskData.title) {
            loadedTasks.push({
              id: i,
              title: taskData.title,
              description: taskData.description,
              assignee: taskData.assignee,
              creator: taskData.creator,
              reward: taskData.reward,
              status: mapStatusFromContract(taskData.status),
            })
          }
        } catch (error) {
          console.error(`Error loading task ${i}:`, error)
        }
      }

      const userTasks = loadedTasks.filter(
        (task) =>
          task.creator.toLowerCase() === address.toLowerCase() || task.assignee.toLowerCase() === address.toLowerCase(),
      )

      setTasks(userTasks)
      setCachedTasks(address, chainId, userTasks)
    } catch (error) {
      console.error("Error refreshing tasks from blockchain:", error)
      toast({
        title: "Error Loading Tasks",
        description: "Failed to load tasks from blockchain. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (address && tasksCount !== undefined && isChainSupported) {
      refreshTasksData()
    }
  }, [tasksCount, address, chainId, isChainSupported])

  useEffect(() => {
    if (!address) {
      clearCache()
    }
  }, [address])

  useEffect(() => {
    if (isConfirmed && currentTxHash) {
      setIsCreatingTask(false)
      setIsCompletingTask(false)
      setIsConfirmingTask(false)

      if (address && chainId) {
        clearCache(address, chainId)
      }

      setTimeout(() => {
        refreshTasksData(true).then(() => {
          toast({
            title: "Success",
            description: "Transaction confirmed and data updated successfully!",
          })
        })
      }, 1000)
    }
  }, [isConfirmed, currentTxHash, address, chainId])

  const ensureCorrectNetwork = async () => {
    if (!isChainSupported) {
      toast({
        title: "Unsupported Network",
        description: "Please switch to Base Mainnet or Somnia Mainnet to use WorkZone.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const executeTransaction = async (functionName: string, args: any[], setLoadingState: (loading: boolean) => void) => {
    if (!address || !walletClient || !publicClient) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to perform this action.",
        variant: "destructive",
      })
      return false
    }

    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return false

    setLoadingState(true)
    setTransactionError(null)

    try {
      const nonce = await publicClient.getTransactionCount({
        address: address,
        blockTag: "pending",
      })

      const gasEstimate = await publicClient.estimateContractGas({
        address: currentContractAddress as `0x${string}`,
        abi: WORK_CONTRACT_ABI,
        functionName: functionName as any,
        args: args,
        account: address,
      })

      const gasLimit = (gasEstimate * 15n) / 10n
      const gasPrice = await publicClient.getGasPrice()

      console.log(
        `[v0] Transaction params - Function: ${functionName}, Gas: ${gasLimit}, Nonce: ${nonce}, Chain: ${chainId}`,
      )

      const hash = await walletClient.writeContract({
        address: currentContractAddress as `0x${string}`,
        abi: WORK_CONTRACT_ABI,
        functionName: functionName as any,
        args: args,
        gas: gasLimit,
        gasPrice: gasPrice,
        nonce: nonce,
        chain: walletClient.chain,
      })

      setCurrentTxHash(hash)

      toast({
        title: "Transaction Submitted",
        description: "Transaction submitted to blockchain. Waiting for confirmation...",
      })

      return true
    } catch (err: any) {
      console.error(`[v0] Transaction failed for ${functionName}:`, err)

      let errorMessage = "Transaction failed"
      if (err.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas fees"
      } else if (err.message?.includes("nonce")) {
        errorMessage = "Nonce error - please try again"
      } else if (err.message?.includes("gas")) {
        errorMessage = "Gas estimation failed - please try again"
      } else if (err.shortMessage) {
        errorMessage = err.shortMessage
      } else if (err.message) {
        errorMessage = err.message
      }

      setTransactionError(errorMessage)
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      })
      setLoadingState(false)
      return false
    }
  }

  const createTask = async (taskData: { title: string; description: string; assignee: string; reward: string }) => {
    const success = await executeTransaction(
      "createTask",
      [taskData.title, taskData.description, taskData.assignee as `0x${string}`, taskData.reward],
      setIsCreatingTask,
    )

    if (success) {
      toast({
        title: "Creating Task...",
        description: "Task creation transaction submitted successfully.",
      })
    }
  }

  const completeTaskByAssignee = async (taskId: number) => {
    const success = await executeTransaction("completeTaskByAssignee", [BigInt(taskId)], setIsCompletingTask)

    if (success) {
      toast({
        title: "Marking Task Complete...",
        description: "Task completion transaction submitted successfully.",
      })
    }
  }

  const confirmTaskByCreator = async (taskId: number) => {
    const success = await executeTransaction("confirmTaskByCreator", [BigInt(taskId)], setIsConfirmingTask)

    if (success) {
      toast({
        title: "Confirming Task...",
        description: "Task confirmation transaction submitted successfully.",
      })
    }
  }

  const getStats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === "confirmedByCreator").length
    const pendingTasks = tasks.filter((t) => t.status === "doneByAssignee").length
    const assignedTasks = tasks.filter((t) => t.status === "assigned").length
    const totalRewards = tasks
      .filter((t) => t.status === "confirmedByCreator")
      .reduce((sum, t) => sum + Number.parseFloat(t.reward || "0"), 0)

    return { totalTasks, completedTasks, pendingTasks, assignedTasks, totalRewards }
  }, [tasks])

  return {
    tasks,
    createTask,
    completeTaskByAssignee,
    confirmTaskByCreator,
    getStats,
    isLoading: isLoading,
    isCreatingTask: isCreatingTask || isConfirmingReceipt,
    isCompletingTask: isCompletingTask || isConfirmingReceipt,
    isConfirmingTask: isConfirmingTask || isConfirmingReceipt,
    transactionError,
    refreshTasks: () => refreshTasksData(true),
    currentChainId: chainId, // Export current chain ID
    isChainSupported, // Export chain support status
    currentContractAddress, // Export current contract address
  }
}
