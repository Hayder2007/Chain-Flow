import { LoadingSpinner } from "./loading-spinner"
import { Card, CardContent } from "@/components/ui/card"

interface BlockchainLoadingProps {
  message?: string
  isDarkMode?: boolean
}

export function BlockchainLoading({
  message = "Fetching your data from the blockchain...",
  isDarkMode = false,
}: BlockchainLoadingProps) {
  return (
    <Card
      className="border-2 border-[#00FFE5]/20 p-8 text-center"
      style={{ backgroundColor: isDarkMode ? "rgba(245, 247, 250, 0.05)" : "white" }}
    >
      <CardContent className="p-0">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <LoadingSpinner size="lg" className="text-[#00FFE5]" />
            <div className="absolute inset-0 animate-ping">
              <LoadingSpinner size="lg" className="text-[#00FFE5] opacity-20" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold" style={{ color: isDarkMode ? "#F5F7FA" : "#1A1A1A" }}>
              Loading...
            </h3>
            <p
              className="text-sm animate-pulse"
              style={{ color: isDarkMode ? "rgba(245, 247, 250, 0.8)" : "rgba(107, 114, 128, 1)" }}
            >
              {message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
