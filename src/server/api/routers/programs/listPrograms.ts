import { publicProcedure } from "../../trpc";

export const listPrograms = publicProcedure.query(async ({ ctx }) => {
    const programs = await ctx.db.program.findMany();
    return programs;
});