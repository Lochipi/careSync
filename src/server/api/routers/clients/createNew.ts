import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const createClient = publicProcedure
    .input(
        z.object({
            programId: z.string(),
            fullName: z.string().min(1, "Client name is required"),
            email: z.string().email("Must be a valid email").optional(),
            phone: z.string().optional(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        const client = await ctx.db.client.create({
            data: {
                programId: input.programId,
                fullName: input.fullName,
                email: input.email ?? null,
                phone: input.phone ?? null,
            },
        });
        return client;
    });
