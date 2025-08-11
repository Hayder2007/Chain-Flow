"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"

export interface Transaction {
  id: string
  hash: string
  type: "habit" | "task" | "payment"
  description: string
  timestamp: number
  status: "pending" | "confirmed" | "failed"
  zone: "personal" | "work"
  amount?: string
}

export function useTransactionHistory() {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`transactions_${address}`)
      if (stored) {
        setTransactions(JSON.parse(stored))
      }
    }
  }, [address])

  const addTransaction = (tx: Omit<Transaction, "id" | "timestamp">) => {
    if (!address) return

    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }

    const updated = [newTx, ...transactions]
    setTransactions(updated)
    localStorage.setItem(`transactions_${address}`, JSON.stringify(updated))
  }

  const updateTransactionStatus = (id: string, status: Transaction["status"]) => {
    const updated = transactions.map((tx) => (tx.id === id ? { ...tx, status } : tx))
    setTransactions(updated)
    if (address) {
      localStorage.setItem(`transactions_${address}`, JSON.stringify(updated))
    }
  }

  const getStats = () => {
    const total = transactions.length
    const confirmed = transactions.filter((tx) => tx.status === "confirmed").length
    const personalTxs = transactions.filter((tx) => tx.zone === "personal").length
    const workTxs = transactions.filter((tx) => tx.zone === "work").length

    return { total, confirmed, personalTxs, workTxs }
  }

  return {
    transactions,
    addTransaction,
    updateTransactionStatus,
    getStats,
  }
}
