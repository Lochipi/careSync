import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const programByIdRouter = publicProcedure
    .input(z.object({ programId: z.string() }))
    .query(async ({ input, ctx }) => {
        const program = await ctx.db.program.findUnique({
            where: { id: input.programId },
        });
        return program;
    });
