"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Notification {
  id: string
  message: string
  read: boolean
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // This is a placeholder for fetching notifications from an API
    const dummyNotifications: Notification[] = [
      { id: "1", message: "New job match found!", read: false },
      { id: "2", message: "Your CV score has improved!", read: false },
      { id: "3", message: "Don't forget to complete your profile", read: true },
    ]
    setNotifications(dummyNotifications)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>
      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-64 z-10">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li key={notification.id} className={`${notification.read ? "text-muted-foreground" : "font-bold"}`}>
                    {notification.message}
                    {!notification.read && (
                      <Button variant="link" size="sm" onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
