import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const listClients = publicProcedure
    .input(
        z.object({
            programId: z.string().optional(),
            fullName: z.string().optional(),
            email: z.string().optional(),
            phone: z.string().optional(),
        }),
    )
    .query(async ({ input, ctx }) => {
        const clients = await ctx.db.client.findMany({
            where: {
                AND: [
                    input.programId
                        ? {
                            programId: input.programId,
                        }
                        : {},
                    input.fullName
                        ? {
                            fullName: {
                                contains: input.fullName,
                                mode: "insensitive",
                            },
                        }
                        : {},
                    input.email
                        ? {
                            email: {
                                contains: input.email,
                                mode: "insensitive",
                            },
                        }
                        : {},
                    input.phone
                        ? {
                            phone: {
                                contains: input.phone,
                                mode: "insensitive",
                            },
                        }
                        : {},
                ],
            },
        });
        return clients;
    });
