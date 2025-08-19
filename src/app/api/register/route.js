import { NextResponse } from "next/server"
import { connectDb } from "../../../../lib/mongo"
import User from "../../../../models/users"
import bcrypt from "bcryptjs"

export const POST = async(req) => {
    const {name,email,password} = await req.json()
    const hashedPassword = await bcrypt.hash(password,10)
    try {
        await connectDb()
        const user = await User.create({
            name,
            email,
            password:hashedPassword
        })

        return NextResponse.json({message:"user created successfully"},{status:201})
    } catch (error) {
        return NextResponse.json({message:"user not created "},{status:500})
    }
}
    
export const GET = async(req) => {
   
    
    try {
        await connectDb()
        const users = await User.find()
        return NextResponse.json(users,{status:500})
    } catch (error) {
        return NextResponse.json({message:"users not found "},{status:500})
    }
}