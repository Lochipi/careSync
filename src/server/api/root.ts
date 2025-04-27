import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { programsRouter } from "./routers/programs";
import { clientsRouter } from "./routers/clients";
import { reviewsRouter } from "./routers/reviews";

export const appRouter = createTRPCRouter({
  programs: programsRouter,
  clients: clientsRouter,
  reviews: reviewsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
