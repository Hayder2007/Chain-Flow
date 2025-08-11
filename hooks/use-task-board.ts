"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from "wagmi"
import { toast } from "@/hooks/use-toast" // Using same toast as habit tracker

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
  const [isCreatingTask, setIsCreatingTask] = useState(false) // Added specific loading states
  const [isCompletingTask, setIsCompletingTask] = useState(false)
  const [transactionError, setTransactionError] = useState<string | null>(null)

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
    if (!address) return

    setIsLoading(true)

    try {
      // Force refetch the tasks count first
      const { data: freshTasksCount } = await refetchTasksCount()
      const count = Number(freshTasksCount || 0)

      if (count === 0) {
        setTasks([])
        setIsLoading(false)
        return
      }

      const loadedTasks: Task[] = []

      // Load each task from blockchain
      for (let i = 0; i < count; i++) {
        try {
          const taskData = await fetch(`/api/task/${i}`, {
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
              completed: taskData.completed,
            })
          }
        } catch (error) {
          console.error(`Error loading task ${i}:`, error)
        }
      }

      setTasks(loadedTasks)
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

  const loadTasksFromBlockchain = async () => {
    if (!address) {
      setTasks([])
      return
    }

    setIsLoading(true)

    try {
      const count = Number(tasksCount || 0)

      if (count === 0) {
        setTasks([])
        setIsLoading(false)
        return
      }

      const loadedTasks: Task[] = []

      for (let i = 0; i < count; i++) {
        try {
          const taskData = await fetch(`/api/task/${i}`, {
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
              completed: taskData.completed,
            })
          }
        } catch (error) {
          console.error(`Error loading task ${i}:`, error)
        }
      }

      setTasks(loadedTasks)
    } catch (error) {
      console.error("Error loading tasks from blockchain:", error)
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
    if (address && tasksCount !== undefined) {
      loadTasksFromBlockchain()
    }
  }, [tasksCount, address])

  useEffect(() => {
    if (isConfirmed && hash) {
      setIsCreatingTask(false)
      setIsCompletingTask(false)

      toast({
        title: "Transaction Confirmed",
        description: "Your transaction has been confirmed on the blockchain!",
      })

      // Immediately refresh data from blockchain
      setTimeout(() => {
        refreshTasksData()
      }, 1000) // Small delay to ensure blockchain state is updated
    }
  }, [isConfirmed, hash])

  const ensureCorrectNetwork = async () => {
    if (chainId !== SOMNIA_TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: SOMNIA_TESTNET_CHAIN_ID })
        return true
      } catch (error) {
        toast({
          title: "Network Switch Required",
          description: "Please switch to Somnia Testnet to use this feature.",
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  const createTask = async (taskData: { title: string; description: string; assignee: string; reward: string }) => {
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create tasks.",
        variant: "destructive",
      })
      return
    }

    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    setIsCreatingTask(true)
    setTransactionError(null)

    try {
      writeContract({
        address: WORK_CONTRACT_ADDRESS,
        abi: WORK_CONTRACT_ABI,
        functionName: "createTask",
        args: [taskData.title, taskData.description, taskData.assignee as `0x${string}`, taskData.reward],
        chainId: SOMNIA_TESTNET_CHAIN_ID,
      })

      toast({
        title: "Transaction Pending",
        description: "Please sign the transaction to create your task...",
      })
    } catch (err: any) {
      setTransactionError(err.message || "Failed to create task")
      toast({
        title: "Transaction Failed",
        description: err.message || "Failed to create task on blockchain",
        variant: "destructive",
      })
      setIsCreatingTask(false)
    }
  }

  const completeTask = async (taskId: number) => {
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to complete tasks.",
        variant: "destructive",
      })
      return
    }

    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    setIsCompletingTask(true)
    setTransactionError(null)

    try {
      writeContract({
        address: WORK_CONTRACT_ADDRESS,
        abi: WORK_CONTRACT_ABI,
        functionName: "completeTask",
        args: [BigInt(taskId)],
        chainId: SOMNIA_TESTNET_CHAIN_ID,
      })

      toast({
        title: "Transaction Pending",
        description: "Please sign the transaction to complete the task...",
      })
    } catch (err: any) {
      setTransactionError(err.message || "Failed to complete task")
      toast({
        title: "Transaction Failed",
        description: err.message || "Failed to complete task on blockchain",
        variant: "destructive",
      })
      setIsCompletingTask(false)
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
    isLoading: isLoading,
    isCreatingTask: isCreatingTask || isPending || isConfirming,
    isCompletingTask: isCompletingTask || isPending || isConfirming,
    transactionError,
    refreshTasks: refreshTasksData, // Expose manual refresh function
  }
}
