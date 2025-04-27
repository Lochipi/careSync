"use client";

import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DoctorReviewSection from "~/app/_components/reviews/DoctorReviewSection";

const ClientDetailPage = () => {
    const pathname = usePathname();
    const clientId = pathname.split("/").pop();

    const { data: client, isLoading, error } = api.clients.clientsByIdRouter.useQuery(
        { clientId: clientId ?? "" },
        { enabled: !!clientId }
    );

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl p-8">
                <Skeleton className="h-8 w-1/3 mb-6" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="mx-auto max-w-4xl p-8 text-center text-red-600">
                Failed to load client info.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-8">
            <Link href="/clients">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Clients
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{client.fullName}</CardTitle>
                    <CardDescription>{client.email ?? "No email provided"}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <p className="font-semibold">Enrolled Program:</p>
                        <p>{client.program?.name ?? "No program linked"}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Program Description:</p>
                        <p>{client.program?.description ?? "No description available"}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Created At:</p>
                        <p>{client.createdAt ? format(new Date(client.createdAt), "PPP p") : "Unknown"}</p>
                    </div>

                    {client.phone && (
                        <div>
                            <p className="font-semibold">Phone:</p>
                            <p>{client.phone}</p>
                        </div>
                    )}
                    <h1 className="my-4 text-2xl font-bold md:mx-8">Doctor&apos;s Professional Review</h1>
                    <DoctorReviewSection clientId={clientId!} />


                </CardContent>
            </Card>
        </div>
    );
};

export default ClientDetailPage;
