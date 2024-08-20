import { User } from "next-auth"
import dbConnect from "@/lib/dbConnect"
import userModel, { Message } from "@/model/User"

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()
    try {
        const user = await userModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }

        // is user accepting the messages
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 400 })
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)// hn hn iska type Message e ha no worry
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent Successfully"
        }, { status: 401 })

    } catch (error) {
        console.log("Error adding messages: ", error);

        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}