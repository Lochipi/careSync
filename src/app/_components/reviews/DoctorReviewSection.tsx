import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Send, MessageSquare, Clock } from "lucide-react";

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
        if (!doctorReview.trim()) return;

        try {
            addDoctorReview.mutate({ clientId, doctorReview: doctorReview });
            setDoctorReview("");
            await refetch();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <div className="flex items-center gap-2 text-blue-700">
                    <MessageSquare className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Add Medical Review</h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Document your professional assessment for this client&apos;s medical record
                </p>
            </div>

            <div className="relative mb-4">
                <Textarea
                    value={doctorReview}
                    onChange={(e) => setDoctorReview(e.target.value)}
                    placeholder="Write your professional medical assessment here..."
                    className="min-h-32 resize-none border-blue-200 bg-blue-50 text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
            </div>

            <div className="mb-8 flex justify-end">
                <Button
                    onClick={handleSubmit}
                    disabled={!doctorReview.trim()}
                    className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700 disabled:bg-gray-300"
                >
                    <Send className="h-4 w-4" />
                    Submit Review
                </Button>
            </div>

            <div className="mt-8">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-700">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Previous Medical Reviews
                    </h3>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {doctorReviews?.length ?? 0} entries
                    </span>
                </div>

                <div className="space-y-4">
                    {doctorReviews?.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center">
                            <div className="mb-3 rounded-full bg-gray-100 p-3">
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No medical reviews have been added yet</p>
                        </div>
                    )}

                    {doctorReviews?.map((review) => (
                        <div key={review.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow">
                            <p className="text-gray-700">{review.comment}</p>
                            <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(review.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorReviewSection;