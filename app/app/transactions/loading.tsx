import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8">
        <CardContent className="flex items-center space-x-4">
          <Loader2 className="w-6 h-6 animate-spin text-[#00FFE5]" />
          <span className="text-lg">Loading transactions...</span>
        </CardContent>
      </Card>
    </div>
  )
}
