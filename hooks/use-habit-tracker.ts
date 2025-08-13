"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from "wagmi"
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
  const [habits, setHabits] = useState<Habit[]>([])
  const [isCreatingHabit, setIsCreatingHabit] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [transactionError, setTransactionError] = useState<string | null>(null)
  const [isLoadingHabits, setIsLoadingHabits] = useState(false)

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const { data: habitsCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getHabitsCount",
    chainId: SOMNIA_CHAIN_ID,
  })

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

  const loadHabitsFromBlockchain = useCallback(async () => {
    if (!address) {
      setHabits([])
      return
    }

    setIsLoadingHabits(true)

    try {
      const { data: currentCount } = await refetchCount()
      const count = Number(currentCount || 0)

      if (count === 0) {
        setHabits([])
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
  }, [address, refetchCount])

  useEffect(() => {
    loadHabitsFromBlockchain()
  }, [loadHabitsFromBlockchain])

  useEffect(() => {
    if (isConfirmed) {
      setIsCreatingHabit(false)
      setIsCheckingIn(false)

      toast({
        title: "Transaction Confirmed",
        description: "Your transaction has been confirmed on the blockchain!",
      })

      setTimeout(() => {
        loadHabitsFromBlockchain()
      }, 1000) // Small delay to ensure blockchain state is updated
    }
  }, [isConfirmed, loadHabitsFromBlockchain])

  useEffect(() => {
    if (error) {
      setTransactionError(error.message || "Transaction failed")
      toast({
        title: "Transaction Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      })
      setIsCreatingHabit(false)
      setIsCheckingIn(false)
    }
  }, [error])

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
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createHabit",
        args: [habitData.name, habitData.description, habitData.category],
        chainId: SOMNIA_CHAIN_ID,
      })

      toast({
        title: "Transaction Pending",
        description: "Please sign the transaction to create your habit...",
      })
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

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "checkIn",
        args: [BigInt(habitId), BigInt(today)],
        chainId: SOMNIA_CHAIN_ID,
      })

      toast({
        title: "Transaction Pending",
        description: "Please sign the transaction to record your check-in...",
      })
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
    refreshHabits: loadHabitsFromBlockchain,
    isLoadingHabits,
    isCreatingHabit: isCreatingHabit || isPending || isConfirming,
    isCheckingIn: isCheckingIn || isPending || isConfirming,
    transactionError,
  }
}
