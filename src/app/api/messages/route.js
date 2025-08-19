import { NextResponse } from "next/server"
import { connectDb } from "../../../../lib/mongo"
import Message from "../../../../models/message"

// POST /api/messages
export const POST = async (req) => {
  try {
    const { sender_id, receiver_id, content } = await req.json()

    console.log("Sender:", sender_id)
    console.log("Receiver:", receiver_id)
    console.log("Content:", content)

    if (!sender_id || !receiver_id) {
      return NextResponse.json(
        { message: "sender_id & receiver_id required" },
        { status: 400 }
      )
    }

    await connectDb()
    const message = await Message.create({
      sender_id,
      receiver_id,
      content,
    })

    return NextResponse.json(
      { message: "message created successfully", data: message },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST error:", error)
    return NextResponse.json(
      { message: "message not created successfully" },
      { status: 500 }
    )
  }
}

export const GET = async (req) => {
  try {
    await connectDb()


const { searchParams } = new URL(req.url)
const sender_id = searchParams.get("sender_id")
const receiver_id = searchParams.get("receiver_id")

const messages = await Message.find({
  $or: [
    { sender_id: sender_id, receiver_id: receiver_id },
    { sender_id: receiver_id, receiver_id: sender_id }
  ]
}).sort({ createdAt: 1 })


    return NextResponse.json(messages, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "failed to fetch messages" }, { status: 500 })
  }
}

