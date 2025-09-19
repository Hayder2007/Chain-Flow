"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useAccount, useWaitForTransactionReceipt, useSwitchChain, usePublicClient, useWalletClient } from "wagmi"
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

const CONTRACT_ADDRESS = "0x9Dd20671aF9F1E94a86FB904018fc84a82caD57F"
const BASE_MAINNET_CHAIN_ID = 8453

const CACHE_KEY_PREFIX = "chainflow_habits_"
const CACHE_EXPIRATION_MS = 5 * 60 * 1000 // 5 minutes

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_habitId", type: "uint256" }],
    name: "checkIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "string", name: "_category", type: "string" },
    ],
    name: "createHabit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_habitId", type: "uint256" }],
    name: "deactivateHabit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "habitId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "newStreak", type: "uint256" },
    ],
    name: "HabitCheckedIn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "habitId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
      { indexed: false, internalType: "string", name: "category", type: "string" },
    ],
    name: "HabitCreated",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getHabits",
    outputs: [
      { internalType: "string[]", name: "titles", type: "string[]" },
      { internalType: "string[]", name: "descriptions", type: "string[]" },
      { internalType: "string[]", name: "categories", type: "string[]" },
      { internalType: "uint256[]", name: "streaks", type: "uint256[]" },
      { internalType: "uint256[]", name: "lastCheckins", type: "uint256[]" },
      { internalType: "bool[]", name: "actives", type: "bool[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userHabits",
    outputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "category", type: "string" },
      { internalType: "uint256", name: "streak", type: "uint256" },
      { internalType: "uint256", name: "lastCheckin", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
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
    if (chain?.id !== BASE_MAINNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: BASE_MAINNET_CHAIN_ID })
        return true
      } catch (error) {
        toast({
          title: "Network Switch Required",
          description: "Please switch to Base Mainnet to use this feature.",
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

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
      const nonce = await publicClient.getTransactionCount({
        address: address,
        blockTag: "pending",
      })

      const gasEstimate = await publicClient.estimateContractGas({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: functionName as any,
        args: args,
        account: address,
      })

      const gasLimit = (gasEstimate * 15n) / 10n
      const gasPrice = await publicClient.getGasPrice()

      console.log(`[v0] Transaction params - Function: ${functionName}, Gas: ${gasLimit}, Nonce: ${nonce}`)

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
      console.error(`[v0] Transaction failed for ${functionName}:`, err)

      let errorMessage = "Transaction failed"

      if (
        functionName === "checkIn" &&
        (err.message?.includes("Already checked in today") ||
          err.shortMessage?.includes("Already checked in today") ||
          err.details?.includes("Already checked in today"))
      ) {
        errorMessage = "You've already checked in today! Come back in 24 hours to maintain your streak."
        toast({
          title: "Already Checked In Today",
          description: "You can only check in once per day. Come back tomorrow to continue your streak! 🔥",
          variant: "default", // Using default instead of destructive for a friendlier tone
        })
      } else if (err.message?.includes("insufficient funds")) {
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

      if (
        !(
          functionName === "checkIn" &&
          (err.message?.includes("Already checked in today") ||
            err.shortMessage?.includes("Already checked in today") ||
            err.details?.includes("Already checked in today"))
        )
      ) {
        toast({
          title: "Transaction Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }

      setLoadingState(false)
      return false
    }
  }

  const loadHabitsFromBlockchain = useCallback(
    async (forceRefresh = false, retryCount = 0) => {
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
        console.log(`[v0] Fetching habits for user: ${address} (attempt ${retryCount + 1})`)

        const currentBlock = await publicClient.getBlockNumber()
        console.log(`[v0] Current block number: ${currentBlock}`)

        const habitsData = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "getHabits",
          args: [address],
          chainId: BASE_MAINNET_CHAIN_ID,
          blockTag: "latest",
        })

        console.log(`[v0] Raw habits data:`, habitsData)

        if (!habitsData) {
          console.log(`[v0] No habits data returned`)
          setHabits([])
          setCachedHabits(address, [])
          setIsLoadingHabits(false)
          return
        }

        const [titles, descriptions, categories, streaks, lastCheckins, actives] = habitsData

        console.log(`[v0] Habits data breakdown:`, {
          titlesLength: titles?.length || 0,
          descriptionsLength: descriptions?.length || 0,
          categoriesLength: categories?.length || 0,
          streaksLength: streaks?.length || 0,
          lastCheckinsLength: lastCheckins?.length || 0,
          activesLength: actives?.length || 0,
        })

        if (!titles || titles.length === 0) {
          console.log(`[v0] No habits found for user`)

          if (retryCount < 3 && forceRefresh) {
            console.log(`[v0] Retrying habit fetch in 3 seconds... (attempt ${retryCount + 1}/3)`)
            setIsLoadingHabits(false)
            setTimeout(() => {
              loadHabitsFromBlockchain(true, retryCount + 1)
            }, 3000)
            return
          }

          setHabits([])
          setCachedHabits(address, [])
          setIsLoadingHabits(false)
          return
        }

        const loadedHabits: Habit[] = []

        for (let i = 0; i < titles.length; i++) {
          if (actives[i]) {
            // Only include active habits
            const lastCheckedIn = lastCheckins[i] ? Number(lastCheckins[i]) * 24 * 60 * 60 * 1000 : null

            loadedHabits.push({
              id: i,
              name: titles[i],
              description: descriptions[i],
              category: categories[i],
              creator: address,
              streak: Number(streaks[i]),
              lastCheckedIn,
              totalCheckins: Number(streaks[i]), // Using streak as total checkins for now
            })

            console.log(`[v0] Added habit ${i}:`, {
              name: titles[i],
              category: categories[i],
              streak: Number(streaks[i]),
            })
          }
        }

        console.log(`[v0] Total loaded habits for user:`, loadedHabits.length)
        setHabits(loadedHabits)
        setCachedHabits(address, loadedHabits)
      } catch (error) {
        console.error("[v0] Error loading habits from blockchain:", error)

        if (retryCount < 2) {
          console.log(`[v0] Retrying after error in 2 seconds... (attempt ${retryCount + 1}/2)`)
          setTimeout(() => {
            loadHabitsFromBlockchain(forceRefresh, retryCount + 1)
          }, 2000)
          return
        }

        toast({
          title: "Error Loading Habits",
          description: "Failed to load habits from blockchain. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingHabits(false)
      }
    },
    [address, publicClient, toast],
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
      console.log("[v0] Transaction confirmed, refreshing habits data")
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
        console.log("[v0] Starting habit data refresh after transaction confirmation")
        loadHabitsFromBlockchain(true, 0)
      }, 5000) // Increased delay to 5 seconds
    }
  }, [isConfirmed, loadHabitsFromBlockchain, address, toast])

  const addHabit = async (habitData: { name: string; description: string; category: string }) => {
    const success = await executeTransaction(
      "createHabit",
      [habitData.name, habitData.description, habitData.category],
      setIsCreatingHabit,
    )

    if (success) {
      toast({
        title: "Creating Habit...",
        description: "Habit creation transaction submitted successfully.",
      })
    }
  }

  const checkInHabit = async (habitId: number) => {
    const habit = habits.find((h) => h.id === habitId)
    if (habit && habit.lastCheckedIn) {
      const today = new Date()
      const lastCheckinDate = new Date(habit.lastCheckedIn)

      // Check if the last check-in was today
      if (
        today.getFullYear() === lastCheckinDate.getFullYear() &&
        today.getMonth() === lastCheckinDate.getMonth() &&
        today.getDate() === lastCheckinDate.getDate()
      ) {
        toast({
          title: "Already Checked In Today",
          description: "You can only check in once per day. Come back tomorrow to continue your streak! 🔥",
          variant: "default",
        })
        return
      }
    }

    const success = await executeTransaction("checkIn", [BigInt(habitId)], setIsCheckingIn)

    if (success) {
      toast({
        title: "Recording Check-in...",
        description: "Check-in transaction submitted successfully.",
      })
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
