import { createTRPCRouter } from "../../trpc";
import { getDashboardMetrics } from "./count";
import { createNewProgram } from "./createNew";
import { deleteProgram } from "./deleteProgram";
import { programByIdRouter } from "./getProgramById";
import { listPrograms } from "./listPrograms";
import { updateProgram } from "./updateProgram";

export const programsRouter = createTRPCRouter({
    createNewProgram,
    deleteProgram,
    updateProgram,
    listPrograms,
    programByIdRouter,
    getDashboardMetrics,
})