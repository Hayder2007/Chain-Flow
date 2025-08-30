"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  useAccount,
  useWaitForTransactionReceipt,
  useReadContract,
  useSwitchChain,
  usePublicClient,
  useWalletClient,
} from "wagmi"
import { toast } from "@/hooks/use-toast"

export interface Habit {
  id: number
  name: string
  description: string
  category: string
  creator: string
  streak: number
  lastCheckedIn: number | null
  totalCheckins: number
}

const CONTRACT_ADDRESS = "0xb07bbd46ec078d7a990a87999acac46a9c737a47"
const SOMNIA_CHAIN_ID = 50312

const CACHE_KEY_PREFIX = "chainflow_habits_"
const CACHE_EXPIRATION_MS = 5 * 60 * 1000 // 5 minutes

const CONTRACT_ABI = [
  {
    inputs: [
      { name: "habitId", type: "uint256" },
      { name: "dayIndex", type: "uint256" },
    ],
    name: "checkIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "category", type: "string" },
    ],
    name: "createHabit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
  {
    inputs: [],
    name: "getHabitsCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
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

export function useHabitTracker() {
  const { address, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [habits, setHabits] = useState<Habit[]>([])
  const [isCreatingHabit, setIsCreatingHabit] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [transactionError, setTransactionError] = useState<string | null>(null)
  const [isLoadingHabits, setIsLoadingHabits] = useState(false)

  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: currentTxHash,
  })

  const { data: habitsCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getHabitsCount",
    chainId: SOMNIA_CHAIN_ID,
  })

  const getCacheKey = (walletAddress: string) => `${CACHE_KEY_PREFIX}${walletAddress.toLowerCase()}`

  const getCachedHabits = (walletAddress: string): Habit[] | null => {
    try {
      const cached = sessionStorage.getItem(getCacheKey(walletAddress))
      if (!cached) return null

      const { data, timestamp } = JSON.parse(cached)
      const now = Date.now()

      if (now - timestamp > CACHE_EXPIRATION_MS) {
        sessionStorage.removeItem(getCacheKey(walletAddress))
        return null
      }

      return data
    } catch (error) {
      console.error("Error reading cached habits:", error)
      return null
    }
  }

  const setCachedHabits = (walletAddress: string, habits: Habit[]) => {
    try {
      const cacheData = {
        data: habits,
        timestamp: Date.now(),
      }
      sessionStorage.setItem(getCacheKey(walletAddress), JSON.stringify(cacheData))
    } catch (error) {
      console.error("Error caching habits:", error)
    }
  }

  const clearCache = (walletAddress?: string) => {
    try {
      if (walletAddress) {
        sessionStorage.removeItem(getCacheKey(walletAddress))
      } else {
        // Clear all chainflow habit caches
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

  const ensureCorrectNetwork = async () => {
    if (chain?.id !== SOMNIA_CHAIN_ID) {
      try {
        await switchChain({ chainId: SOMNIA_CHAIN_ID })
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

  // --- NEW: executeTransaction copied/adapted from work zone logic ---
  const executeTransaction = async (functionName: string, args: any[], setLoadingState: (l: boolean) => void) => {
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
      // get nonce
      const nonce = await publicClient.getTransactionCount({
        address: address,
        blockTag: "pending",
      })

      // estimate gas
      const gasEstimate = await publicClient.estimateContractGas({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: functionName as any,
        args: args,
        account: address,
      })

      // buffer gas
      const gasLimit = (gasEstimate * 15n) / 10n

      // get gas price (legacy) — works as fallback; wallets may override
      const gasPrice = await publicClient.getGasPrice()

      console.log(`[habit] tx params - fn:${functionName} nonce:${nonce.toString()} gasEst:${gasEstimate.toString()} gasLimit:${gasLimit.toString()}`)

      // send tx via walletClient — keep chain info
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
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
      console.error(`[habit] Transaction failed for ${functionName}:`, err)

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
  // --- end executeTransaction ---

  const loadHabitsFromBlockchain = useCallback(
    async (forceRefresh = false) => {
      if (!address) {
        setHabits([])
        return
      }

      if (!forceRefresh) {
        const cachedHabits = getCachedHabits(address)
        if (cachedHabits) {
          setHabits(cachedHabits)
          return
        }
      }

      setIsLoadingHabits(true)

      try {
        const { data: currentCount } = await refetchCount()
        const count = Number(currentCount || 0)

        if (count === 0) {
          const emptyHabits: Habit[] = []
          setHabits(emptyHabits)
          setCachedHabits(address, emptyHabits)
          setIsLoadingHabits(false)
          return
        }

        const loadedHabits: Habit[] = []

        for (let i = 0; i < count; i++) {
          try {
            const habitData = await fetch(`/api/habit/${i}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contractAddress: CONTRACT_ADDRESS, chainId: SOMNIA_CHAIN_ID }),
            }).then((res) => res.json())

            if (habitData && habitData.creator.toLowerCase() === address.toLowerCase()) {
              let streak = 0
              let totalCheckins = 0
              let lastCheckedIn = null

              const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000))

              for (let day = today; day >= Math.max(0, today - 365); day--) {
                const isChecked = await fetch(`/api/checkin/${i}/${day}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ contractAddress: CONTRACT_ADDRESS, chainId: SOMNIA_CHAIN_ID }),
                }).then((res) => res.json())

                if (isChecked) {
                  totalCheckins++
                  if (day === today || (streak > 0 && day === today - streak)) {
                    streak++
                    if (!lastCheckedIn) lastCheckedIn = day * 24 * 60 * 60 * 1000
                  }
                } else if (day === today - streak) {
                  break
                }
              }

              loadedHabits.push({
                id: i,
                name: habitData.name,
                description: habitData.description,
                category: habitData.category,
                creator: habitData.creator,
                streak,
                lastCheckedIn,
                totalCheckins,
              })
            }
          } catch (error) {
            console.error(`Error loading habit ${i}:`, error)
          }
        }

        setHabits(loadedHabits)
        setCachedHabits(address, loadedHabits)
      } catch (error) {
        console.error("Error loading habits from blockchain:", error)
        toast({
          title: "Error Loading Habits",
          description: "Failed to load habits from blockchain. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingHabits(false)
      }
    },
    [address, refetchCount],
  )

  useEffect(() => {
    loadHabitsFromBlockchain()
  }, [loadHabitsFromBlockchain])

  useEffect(() => {
    if (!address) {
      clearCache()
    }
  }, [address])

  useEffect(() => {
    if (isConfirmed) {
      setIsCreatingHabit(false)
      setIsCheckingIn(false)

      toast({
        title: "Transaction Confirmed",
        description: "Your transaction has been confirmed on the blockchain!",
      })

      if (address) {
        clearCache(address)
      }

      setTimeout(() => {
        loadHabitsFromBlockchain(true)
      }, 1000)
    }
  }, [isConfirmed, loadHabitsFromBlockchain, address])

  useEffect(() => {
    if (transactionError) {
      // already handled via executeTransaction toasts, but keep this for UX
      setIsCreatingHabit(false)
      setIsCheckingIn(false)
    }
  }, [transactionError])

  const addHabit = async (habitData: { name: string; description: string; category: string }) => {
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create habits.",
        variant: "destructive",
      })
      return
    }

    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    setIsCreatingHabit(true)
    setTransactionError(null)

    try {
      const success = await executeTransaction(
        "createHabit",
        [habitData.name, habitData.description, habitData.category],
        setIsCreatingHabit,
      )

      if (success) {
        toast({
          title: "Transaction Pending",
          description: "Please sign the transaction to create your habit...",
        })
      }
    } catch (err: any) {
      setTransactionError(err.message || "Failed to create habit")
      toast({
        title: "Transaction Failed",
        description: err.message || "Failed to create habit on blockchain",
        variant: "destructive",
      })
      setIsCreatingHabit(false)
    }
  }

  const checkInHabit = async (habitId: number) => {
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to check in.",
        variant: "destructive",
      })
      return
    }

    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    setIsCheckingIn(true)
    setTransactionError(null)

    try {
      const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000))

      const success = await executeTransaction("checkIn", [BigInt(habitId), BigInt(today)], setIsCheckingIn)

      if (success) {
        toast({
          title: "Transaction Pending",
          description: "Please sign the transaction to record your check-in...",
        })
      }
    } catch (err: any) {
      setTransactionError(err.message || "Failed to check in")
      toast({
        title: "Transaction Failed",
        description: err.message || "Failed to record check-in on blockchain",
        variant: "destructive",
      })
      setIsCheckingIn(false)
    }
  }

  const getStats = useMemo(() => {
    const totalHabits = habits.length
    const activeStreaks = habits.filter((h) => h.streak > 0).length
    const totalCheckins = habits.reduce((sum, h) => sum + h.totalCheckins, 0)
    const longestStreak = Math.max(...habits.map((h) => h.streak), 0)

    return { totalHabits, activeStreaks, totalCheckins, longestStreak }
  }, [habits])

  return {
    habits,
    addHabit,
    checkInHabit,
    getStats,
    refreshHabits: () => loadHabitsFromBlockchain(true),
    isLoadingHabits,
    isCreatingHabit: isCreatingHabit || isConfirming,
    isCheckingIn: isCheckingIn || isConfirming,
    transactionError,
  }
}
