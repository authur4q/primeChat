"use client"
import { signOut, useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import styles from "./id.module.css"

export default function ChatComponent() {
  const { data: session } = useSession()
  const params = useParams()
  const receiver_id = params.receiver_id
  const sender_id = session?.user?.id
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [content, setContent] = useState("")

  // 📨 Get messages
  const getMes = async () => {
    const resMes = await fetch(
      `/api/messages?sender_id=${sender_id}&receiver_id=${receiver_id}`
    )
    if (resMes.ok) {
      const data = await resMes.json()
      setMessages(data)
    }
  }

  useEffect(() => {
    if (receiver_id && sender_id) {
      getMes()
      const interval = setInterval(getMes, 4000)
      return () => clearInterval(interval)
    }
  }, [receiver_id, sender_id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()

    const res = await fetch(`/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, sender_id, receiver_id }),
    })

    if (res.ok) {
      setContent("")
      getMes()
    } else {
      console.log("❌ Failed to send message")
    }
  }

  return (
    <div className={styles.chat}>
      {/* Header */}
      <div className={styles.header}>
        <p>Logged in as: {session?.user?.name}</p>
        <button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
      </div>

      {/* Chat messages */}
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`${styles.messageRow} ${
              msg.sender_id === sender_id ? styles.sent : styles.received
            }`}
          >
            <div className={styles.messageBubble}>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form className={styles.input} onSubmit={sendMessage}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!content.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
