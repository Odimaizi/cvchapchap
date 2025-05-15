"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export function CareerGoals() {
  const [goals, setGoals] = useState([
    { id: 1, text: "Learn a new programming language", completed: false },
    { id: 2, text: "Attend a tech conference", completed: false },
    { id: 3, text: "Get a promotion", completed: false },
  ])
  const [newGoal, setNewGoal] = useState("")

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { id: Date.now(), text: newGoal, completed: false }])
      setNewGoal("")
    }
  }

  const toggleGoal = (id: number) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center">
              <input type="checkbox" checked={goal.completed} onChange={() => toggleGoal(goal.id)} className="mr-2" />
              <span className={goal.completed ? "line-through text-muted-foreground" : ""}>{goal.text}</span>
            </div>
          ))}
          <div className="flex space-x-2">
            <Input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Add a new goal" />
            <Button onClick={addGoal} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
