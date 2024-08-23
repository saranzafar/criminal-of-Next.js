import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import userModel from "@/model/User"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    await dbConnect()

    const messageId = params.messageid
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const updateResult = await userModel.updateOne(
            { _id: userId },
            { $pull: { messages: { _id: messageId } } }//delete a single value from array
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Message Deleted"
        }, { status: 200 })

    } catch (error) {
        console.log("Error occured while deleting message: ", error);

        return Response.json({
            success: false,
            message: "Error while deliting message"
        }, { status: 500 })
    }
}