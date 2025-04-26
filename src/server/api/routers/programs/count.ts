import { publicProcedure } from "../../trpc";

export const getDashboardMetrics = publicProcedure.query(async ({ ctx }) => {
    const [
        totalPrograms,
        totalClients,
        totalReviews,
        topPrograms,
    ] = await Promise.all([
        ctx.db.program.count(),
        ctx.db.client.count(),
        ctx.db.review.count(),
        ctx.db.program.findMany({
            take: 5,
            orderBy: {
                clients: {
                    _count: "desc",
                },
            },
            include: {
                clients: {
                    select: { id: true },
                },
            },
        }),
    ]);

    const topProgramsByEnrollment = topPrograms.map((program) => ({
        name: program.name,
        totalClients: (program.clients ?? []).length,
    }));

    return {
        totalPrograms,
        totalClients,
        totalReviews,
        topProgramsByEnrollment,
    };
});
