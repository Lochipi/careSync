import { createTRPCRouter } from "../../trpc";
import { getDoctorReviewsRouter } from "./getDoctorReviewsRouter";
import { newDoctorReviewRouter } from "./newDoctorReviewRouter";

export const reviewsRouter = createTRPCRouter({
    newDoctorReviewRouter,
    getDoctorReviewsRouter,
})