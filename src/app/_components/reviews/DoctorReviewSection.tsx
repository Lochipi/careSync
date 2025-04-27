import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { api } from "~/trpc/react";

interface DoctorReviewSectionProps {
    clientId: string;
}

const DoctorReviewSection: React.FC<DoctorReviewSectionProps> = ({ clientId }) => {
    const [doctorReview, setDoctorReview] = useState<string>("");
    const queryClient = api.useUtils();

    const addDoctorReview = api.reviews.newDoctorReviewRouter.createDoctorReview.useMutation({
        onSuccess: async () => {
            await queryClient.reviews.getDoctorReviewsRouter.getDoctorReviews.invalidate({ clientId });
        },
    });

    const { data: doctorReviews, refetch } = api.reviews.getDoctorReviewsRouter.getDoctorReviews.useQuery(
        { clientId },
        { enabled: !!clientId },
    );

    const handleSubmit = async () => {
        try {
            addDoctorReview.mutate({ clientId, doctorReview: doctorReview });
            setDoctorReview("");
            await refetch();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="w-full rounded-2xl border border-blue-500 p-6 shadow-md md:mx-8">
            <h3 className="mb-4 text-xl font-semibold text-gray-100">Doctor&apos;s Review</h3>

            <Textarea
                value={doctorReview}
                onChange={(e) => setDoctorReview(e.target.value)}
                placeholder="Write your professional review..."
                className="mb-4 min-h-[100px]"
            />

            <Button onClick={handleSubmit} className="mb-6">
                Submit Review
            </Button>

            <div>
                <h3 className="mb-2 text-lg font-bold text-gray-200">Existing Doctor Reviews</h3>
                <div className="space-y-4">
                    {doctorReviews?.map((review) => (
                        <div key={review.id} className="rounded-md bg-gray-900 p-4">
                            <p className="text-gray-300">{review.comment}</p>
                            <p className="mt-2 text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}

                    {doctorReviews?.length === 0 && (
                        <p className="text-gray-400">No doctor reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorReviewSection;
