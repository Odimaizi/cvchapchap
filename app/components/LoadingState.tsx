import { Card, CardContent } from "@/components/ui/card"

export function LoadingState() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </CardContent>
    </Card>
  )
}
