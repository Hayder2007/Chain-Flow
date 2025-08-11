"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from "wagmi"
import { toast } from "sonner"

export interface Task {
  id: number
  title: string
  description: string
  assignee: string
  creator: string
  reward: string
  completed: boolean
}

const WORK_CONTRACT_ADDRESS = "0xbffddeb4ae3ad53df99a556324245de7c0001ca4" as const
const SOMNIA_TESTNET_CHAIN_ID = 50312

const WORK_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_taskId",
        type: "uint256",
      },
    ],
    name: "completeTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "address",
        name: "_assignee",
        type: "address",
      },
      {
        internalType: "string",
        name: "_reward",
        type: "string",
      },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_taskId",
        type: "uint256",
      },
    ],
    name: "getTask",
    outputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "reward",
        type: "string",
      },
      {
        internalType: "address",
        name: "assignee",
        type: "address",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTasksCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export function useTaskBoard() {
  const { address, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const { data: tasksCount, refetch: refetchTasksCount } = useReadContract({
    address: WORK_CONTRACT_ADDRESS,
    abi: WORK_CONTRACT_ABI,
    functionName: "getTasksCount",
    chainId: SOMNIA_TESTNET_CHAIN_ID,
  })

  const refreshTasksData = async () => {
    await refetchTasksCount()
    await loadTasksFromBlockchain()
  }

  const loadTasksFromBlockchain = async () => {
    const { data: latestTasksCount } = await refetchTasksCount()
    const currentCount = latestTasksCount || tasksCount

    if (!currentCount || currentCount === 0n) {
      setTasks([])
      return
    }

    setIsLoading(true)
    try {
      const taskPromises = []
      const count = Number(currentCount)

      for (let i = 0; i < count; i++) {
        taskPromises.push(
          fetch(`/api/task/${i}`)
            .then((res) => res.json())
            .then((data) => ({ id: i, ...data })),
        )
      }

      const taskResults = await Promise.all(taskPromises)
      const validTasks = taskResults.filter((task) => task.title) // Filter out invalid tasks
      setTasks(validTasks)
    } catch (error) {
      console.error("Error loading tasks from blockchain:", error)
      toast.error("Failed to load tasks from blockchain")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (address && tasksCount !== undefined) {
      loadTasksFromBlockchain()
    }
  }, [tasksCount, address])

  useEffect(() => {
    if (isConfirmed && hash) {
      toast.success("Transaction confirmed! Task updated successfully.")
      setTimeout(() => {
        refreshTasksData()
      }, 1000) // Small delay to ensure blockchain state is updated
    }
  }, [isConfirmed, hash])

  useEffect(() => {
    if (error) {
      toast.error(`Transaction failed: ${error.message}`)
    }
  }, [error])

  const ensureCorrectNetwork = async () => {
    if (chainId !== SOMNIA_TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: SOMNIA_TESTNET_CHAIN_ID })
        return true
      } catch (error) {
        toast.error("Please switch to Somnia Testnet to create tasks")
        return false
      }
    }
    return true
  }

  const createTask = async (taskData: { title: string; description: string; assignee: string; reward: string }) => {
    if (!address) {
      toast.error("Please connect your wallet")
      return
    }

    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    try {
      writeContract({
        address: WORK_CONTRACT_ADDRESS,
        abi: WORK_CONTRACT_ABI,
        functionName: "createTask",
        args: [taskData.title, taskData.description, taskData.assignee as `0x${string}`, taskData.reward],
        chainId: SOMNIA_TESTNET_CHAIN_ID,
      })

      toast.info("Transaction sent. Please wait for confirmation...")
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task")
    }
  }

  const completeTask = async (taskId: number) => {
    if (!address) {
      toast.error("Please connect your wallet")
      return
    }

    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    try {
      writeContract({
        address: WORK_CONTRACT_ADDRESS,
        abi: WORK_CONTRACT_ABI,
        functionName: "completeTask",
        args: [BigInt(taskId)],
        chainId: SOMNIA_TESTNET_CHAIN_ID,
      })

      toast.info("Transaction sent. Please wait for confirmation...")
    } catch (error) {
      console.error("Error completing task:", error)
      toast.error("Failed to complete task")
    }
  }

  const getStats = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.completed).length
    const pendingTasks = tasks.filter((t) => !t.completed).length
    const totalRewards = tasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + Number.parseFloat(t.reward || "0"), 0)

    return { totalTasks, completedTasks, pendingTasks, totalRewards }
  }

  return {
    tasks,
    createTask,
    completeTask,
    getStats,
    isLoading: isLoading || isPending || isConfirming,
    error: error?.message,
    refreshTasks: refreshTasksData,
  }
}
