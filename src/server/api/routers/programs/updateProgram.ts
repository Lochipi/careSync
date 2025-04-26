import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const updateProgram = publicProcedure
    .input(
        z.object({
            programId: z.string(),
            name: z.string().optional(),
            description: z.string().optional(),
            logo: z.string().url("Logo must be a valid URL").optional(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        const updatedProgram = await ctx.db.program.update({
            where: { id: input.programId },
            data: {
                ...(input.name && { name: input.name }),
                ...(input.description && { description: input.description }),
                ...(input.logo && { logo: input.logo }),
            },
        });
        return updatedProgram;
    });
