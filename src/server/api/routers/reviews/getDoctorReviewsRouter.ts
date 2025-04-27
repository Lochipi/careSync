import z from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const getDoctorReviewsRouter = createTRPCRouter({
    getDoctorReviews: publicProcedure
        .input(z.object({ clientId: z.string() }))
        .query(async ({ input, ctx }) => {
            const doctorReviews = await ctx.db.review.findMany({
                where: { clientId: input.clientId },
            });
            return doctorReviews;
        }),
});
