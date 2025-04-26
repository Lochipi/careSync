import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const deleteProgram = publicProcedure
    .input(z.object({ programId: z.string() }))
    .mutation(async ({ input, ctx }) => {
  
        const clients = await ctx.db.client.findMany({
            where: { id: input.programId },
        });

        if (clients.length > 0) {
            throw new Error(
                "Cannot delete programs with active products. Reassign or remove all products first."
            );
        }

        await ctx.db.program.delete({ where: { id: input.programId } });
        return { success: true, message: "Program deleted successfully" };
    });
