import { z } from 'zod'

export const projectSchema = z.object({
    content: z
        .string()
        .min(10, { message: 'Project details must be at least 20 characters.' })
});
