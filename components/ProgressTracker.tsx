"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressItem {
  id: string
  name: string
  completed: boolean
}

export function ProgressTracker() {
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([
    { id: "1", name: "Create Resume", completed: false },
    { id: "2", name: "Write Cover Letter", completed: false },
    { id: "3", name: "Optimize for ATS", completed: false },
    { id: "4", name: "Apply for Jobs", completed: false },
  ])

  const completedCount = progressItems.filter((item) => item.completed).length
  const progressPercentage = (completedCount / progressItems.length) * 100

  const toggleCompletion = (id: string) => {
    setProgressItems((items) => items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progressPercentage} className="mb-4" />
        <ul className="space-y-2">
          {progressItems.map((item) => (
            <li key={item.id} className="flex items-center">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleCompletion(item.id)}
                className="mr-2"
              />
              <span className={item.completed ? "line-through text-muted-foreground" : ""}>{item.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
