import dbConnect from "@/lib/dbConnect";
import { ProjectModel } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();
    console.log("Project API CALLED");

    const session = await getServerSession(authOptions);
    const _user = session?.user;
    if (!session || !_user) {
        return new Response(
            JSON.stringify({ success: false, message: "Not authenticated" }),
            { status: 401 }
        );
    }

    try {
        const { title, details, amount } = await request.json();
        console.log("Project details: ", title, details, amount);

        const createdProject = new ProjectModel({
            title,
            details,
            amount,
            userId: _user.id,
        });

        await createdProject.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Project uploaded successfully",
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading project:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error uploading project",
            }),
            { status: 500 }
        );
    }
}
