import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function POST() {
    await dbConnect();
    console.log("Toggle Account Type API Called",);

    const session = await getServerSession(authOptions);
    const _user = session?.user;
    if (!session || !_user) {
        return new Response(
            JSON.stringify({ success: false, message: "Not authenticated" }),
            { status: 401 }
        );
    }
    console.log("THIS IS USER: ", _user);

    try {
        const user = await UserModel.findById(_user._id);
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        console.log("user.accountType: ", user.accountType);
        const newAccountType = user.accountType == "client" ? "client" : "freelancer";
        console.log("NEW ACCOUNT: ", newAccountType);

        user.accountType = newAccountType;
        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Account type updated successfully",
                accountType: newAccountType,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error toggling account type:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error updating account type" }),
            { status: 500 }
        );
    }
}
