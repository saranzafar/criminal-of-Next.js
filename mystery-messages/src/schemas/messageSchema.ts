import { z } from "zod"

export const messagesSchema = z.object({
    conent: z.string()
        .min(10, { message: "Content must be atleast of 10 characters" })
        .max(300, { message: "Content must be no longer that 300 characters" })
})