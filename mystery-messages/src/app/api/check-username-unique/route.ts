import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";


const UserNameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        console.log("Username:: ",searchParams);
        
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UserNameQuerySchema.safeParse(queryParam)
        // console.log("RESULT:: ", result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query paramaters"
                }, { status: 400 }
            )
        }

        const { username } = result.data
        const existingVerifiedUser = await userModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken"
                }, { status: 409 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique"
            }, { status: 200 }
        )

    } catch (error) {
        console.error("Error checking username: ", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },
            { status: 500 }
        )
    }
}