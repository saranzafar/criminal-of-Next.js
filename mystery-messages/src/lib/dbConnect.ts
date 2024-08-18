import mongoose from "mongoose";

type ConnectionObject = {
    isconnected?: number
}

const connection: ConnectionObject = {}

// here void means that i don't care which type of data will be return
async function dbConnect(): Promise<void> {
    if (connection.isconnected) {
        console.log("Already connected to database");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isconnected = db.connections[0].readyState
        console.log("DB Connected Successfully")
    } catch (error) {
        console.log("DB connection failed", error)
        process.exit(1)//gracefully exit 
    }
}

export default dbConnect