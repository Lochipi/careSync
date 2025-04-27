import z from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const newDoctorReviewRouter = createTRPCRouter({
    createDoctorReview: publicProcedure
        .input(
            z.object({
                clientId: z.string(),
                doctorReview: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const doctorReview = await ctx.db.review.create({
                data: {
                    clientId: input.clientId,
                    comment: input.doctorReview,
                },
            });
            return doctorReview;
        }),
});
