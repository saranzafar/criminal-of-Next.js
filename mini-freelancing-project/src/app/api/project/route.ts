import dbConnect from "@/lib/dbConnect";
import { ProjectModel } from "@/model/User"
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
    await dbConnect();
    console.log("project API CALLED");
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
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
            userId: _user._id
        })
        await createdProject.save();

        return Response.json(
            {
                success: true,
                message: 'Project Uploaded successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding project:', error);
        return Response.json(
            {
                success: false,
                message: 'Error uploading project',
            },
            { status: 500 }
        );
    }
}
