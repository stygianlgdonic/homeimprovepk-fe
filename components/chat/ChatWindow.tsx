'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { useSocket } from '@/components/providers/SocketProvider'
import { useAuthStore } from '@/stores/auth.store'
import { getChatMessages } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import type { Message } from '@/types'
import { cn } from '@/lib/utils'

interface ChatWindowProps {
  roomId: string
}

export function ChatWindow({ roomId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { socket } = useSocket()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    async function loadMessages() {
      try {
        setIsLoading(true)
        const result = await getChatMessages(roomId, { limit: 50 })
        setMessages(result.data.reverse())
      } catch (err) {
        console.error('Failed to load messages:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadMessages()
  }, [roomId])

  useEffect(() => {
    if (!socket) return

    socket.emit('join_room', roomId)

    socket.on('new_message', (msg: Message) => {
      if (msg.chatRoomId === roomId) {
        setMessages((prev) => [...prev, msg])
      }
    })

    return () => {
      socket.off('new_message')
    }
  }, [socket, roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || !socket || isSending) return

    setIsSending(true)
    const content = inputValue.trim()
    setInputValue('')

    socket.emit('send_message', { chatRoomId: roomId, content })
    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === user?.id
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  isOwn ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm',
                    isOwn
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  )}
                >
                  <p>{msg.content}</p>
                  <p
                    className={cn(
                      'text-xs mt-1',
                      isOwn ? 'text-green-200' : 'text-gray-400'
                    )}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || !socket}
            size="md"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
