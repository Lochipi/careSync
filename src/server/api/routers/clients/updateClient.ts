import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const updateClient = publicProcedure
    .input(
        z.object({
            clientId: z.string(),
            fullName: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            programId: z.string().optional(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        const updatedClient = await ctx.db.client.update({
            where: { id: input.clientId },
            data: {
                ...(input.fullName && { fullName: input.fullName }),
                ...(input.email && { email: input.email }),
                ...(input.phone && { phone: input.phone }),
                ...(input.programId && { programId: input.programId }),
            },
        });
        return updatedClient;
    });
