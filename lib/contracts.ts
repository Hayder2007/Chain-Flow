// Contract addresses on Somnia Testnet
export const CONTRACTS = {
  HABIT_TRACKER: "0x1234567890123456789012345678901234567890", // Replace with your actual contract
  TASK_BOARD: "0x0987654321098765432109876543210987654321", // Replace with your actual contract
}

// Contract ABIs (simplified for demo)
export const HABIT_TRACKER_ABI = [
  {
    inputs: [{ name: "name", type: "string" }],
    name: "createHabit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "habitId", type: "uint256" }],
    name: "checkIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserHabits",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "name", type: "string" },
          { name: "streak", type: "uint256" },
          { name: "lastCheckIn", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export const TASK_BOARD_ABI = [
  {
    inputs: [
      { name: "title", type: "string" },
      { name: "assignee", type: "address" },
      { name: "reward", type: "uint256" },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "uint256" }],
    name: "submitTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "uint256" }],
    name: "verifyTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserTasks",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "title", type: "string" },
          { name: "assignee", type: "address" },
          { name: "reward", type: "uint256" },
          { name: "status", type: "uint8" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const
