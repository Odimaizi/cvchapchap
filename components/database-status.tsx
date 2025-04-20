"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string>("")
  const [details, setDetails] = useState<Record<string, string>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkDatabaseStatus = async () => {
    setStatus("loading")
    setIsRefreshing(true)

    try {
      const response = await fetch("/api/test-supabase")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
        setDetails(data.tables || {})
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to connect to database")
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "An unexpected error occurred")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  if (status === "loading") {
    return (
      <Alert className="bg-muted">
        <Database className="h-4 w-4" />
        <AlertTitle>Checking Database Connection</AlertTitle>
        <AlertDescription>Please wait while we verify the connection to the database...</AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database Connection Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{message}. Please check your Supabase API keys and configuration.</p>
          <Button variant="outline" size="sm" onClick={checkDatabaseStatus} disabled={isRefreshing} className="mt-2">
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Database Connection Successful</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        {Object.keys(details).length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Table Status:</p>
            <ul className="mt-1 space-y-1 text-sm">
              {Object.entries(details).map(([table, status]) => (
                <li key={table} className="flex items-center">
                  {status === "OK" ? (
                    <CheckCircle className="mr-1 h-3 w-3 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="mr-1 h-3 w-3 text-amber-600 dark:text-amber-400" />
                  )}
                  <span>
                    {table}: {status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={checkDatabaseStatus} disabled={isRefreshing} className="mt-2">
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

