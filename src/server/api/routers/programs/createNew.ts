import { z } from 'zod';
import { publicProcedure } from '../../trpc';

export const createNewProgram = publicProcedure
    .input(
        z.object({
            name: z.string().min(1, "Shop name is required"),
            description: z.string().optional(),
            logo: z.string().url("Logo must be a valid URL").optional(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        const program = await ctx.db.program.create({
            data: {
                name: input.name,
                description: input.description ?? "",
                logo: input.logo ?? "",
            },
        });
        return program;
    });