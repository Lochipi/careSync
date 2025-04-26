import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const clientsByIdRouter = publicProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ input, ctx }) => {
        const client = await ctx.db.client.findUnique({
            where: { id: input.clientId },
        });
        return client;
    });
