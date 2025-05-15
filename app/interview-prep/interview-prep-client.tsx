"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Mic, MicOff, Send, Clock } from "lucide-react"

const INTERVIEW_CATEGORIES = [
  { id: "technical", name: "Technical Interview" },
  { id: "behavioral", name: "Behavioral Interview" },
  { id: "case", name: "Case Interview" },
  { id: "general", name: "General Questions" },
]

const SAMPLE_QUESTIONS = {
  technical: [
    "Explain the difference between var, let, and const in JavaScript.",
    "What is the box model in CSS?",
    "How would you implement a linked list in Python?",
    "Explain RESTful API principles.",
  ],
  behavioral: [
    "Tell me about a time you faced a difficult challenge at work.",
    "How do you handle conflicts with team members?",
    "Describe a situation where you had to meet a tight deadline.",
    "What's your greatest professional achievement?",
  ],
  case: [
    "How would you estimate the market size for electric vehicles in Kenya?",
    "Your client is a restaurant chain looking to expand. What factors should they consider?",
    "How would you improve profitability for a struggling retail store?",
    "Design a strategy to enter the online education market.",
  ],
  general: [
    "Why are you interested in this position?",
    "Where do you see yourself in 5 years?",
    "What are your salary expectations?",
    "Why should we hire you?",
  ],
}

export function InterviewPrepClient() {
  const [activeTab, setActiveTab] = useState("practice")
  const [selectedCategory, setSelectedCategory] = useState("technical")
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [customQuestions, setCustomQuestions] = useState<string[]>([])
  const [interviewMode, setInterviewMode] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  const startInterview = () => {
    // Get random question from selected category
    const questions = SAMPLE_QUESTIONS[selectedCategory as keyof typeof SAMPLE_QUESTIONS]
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
    setCurrentQuestion(randomQuestion)
    setInterviewMode(true)
    setAnswer("")
    setFeedback("")

    // Start timer
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    setTimerInterval(interval)
  }

  const stopInterview = () => {
    setInterviewMode(false)
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    setTimer(0)

    // Generate feedback (in a real app, this would call an AI service)
    setFeedback(
      "Your answer was clear and concise. You provided good examples to support your points. Consider structuring your response using the STAR method (Situation, Task, Action, Result) for behavioral questions. Also, try to be more specific about the technologies you've used in your technical answers.",
    )
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop speech recognition
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const generateCustomQuestions = () => {
    // In a real app, this would call an AI service to generate questions based on job description
    setCustomQuestions([
      "What experience do you have with the technologies mentioned in the job description?",
      "How would you handle the specific challenges mentioned for this role?",
      "Describe a project where you demonstrated the skills required for this position.",
      "How do you stay updated with the latest trends in this field?",
    ])
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Interview Preparation</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="practice">Practice Interview</TabsTrigger>
          <TabsTrigger value="custom">Custom Interview</TabsTrigger>
        </TabsList>

        <TabsContent value="practice">
          {!interviewMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Practice Your Interview Skills</CardTitle>
                <CardDescription>
                  Select a category and start a mock interview to practice your responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Interview Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {INTERVIEW_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={startInterview} className="w-full">
                  <Play className="mr-2 h-4 w-4" /> Start Mock Interview
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Interview Question</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatTime(timer)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">{currentQuestion}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your answer here..."
                      className="min-h-[150px]"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                    <div className="flex justify-between">
                      <Button variant={isRecording ? "destructive" : "outline"} onClick={toggleRecording}>
                        {isRecording ? (
                          <>
                            <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" /> Start Recording
                          </>
                        )}
                      </Button>
                      <Button onClick={stopInterview}>
                        <Send className="mr-2 h-4 w-4" /> Submit Answer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {feedback && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feedback}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={startInterview} className="w-full">
                      <Play className="mr-2 h-4 w-4" /> Try Another Question
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Interview Preparation</CardTitle>
              <CardDescription>Enter job details to get tailored interview questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here..."
                    className="min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generateCustomQuestions} className="w-full" disabled={!jobTitle || !jobDescription}>
                Generate Custom Questions
              </Button>
            </CardFooter>
          </Card>

          {customQuestions.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tailored Interview Questions</CardTitle>
                <CardDescription>Practice these questions to prepare for your interview.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {customQuestions.map((question, index) => (
                    <li key={index} className="p-4 border rounded-md">
                      <p>{question}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
