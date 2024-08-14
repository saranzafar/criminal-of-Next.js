import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(reqest: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await reqest.json()
        
    } catch (error) {
        console.error("Error Registring User");
        return Response.json({
            success: false,
            message: "Error Registring User"
        },
            {
                status: 500
            })
    }
}