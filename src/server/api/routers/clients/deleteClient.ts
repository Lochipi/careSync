import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const deleteClient = publicProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ input, ctx }) => {
        await ctx.db.client.delete({ where: { id: input.clientId } });
        return { success: true, message: "Client deleted successfully" };
    });
