"use client";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, User, Phone, Calendar, BookOpen, FileText } from "lucide-react";
import DoctorReviewSection from "~/app/_components/reviews/DoctorReviewSection";

const ClientDetailPage = () => {
    const pathname = usePathname();
    const clientId = pathname.split("/").pop();
    const { data: client, isLoading, error } = api.clients.clientsByIdRouter.useQuery(
        { clientId: clientId ?? "" },
        { enabled: !!clientId }
    );

    return (
        <div className="mx-auto max-w-4xl p-8">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/clients">
                    <Button variant="outline" className="flex items-center gap-2 border-blue-200 text-blue-600 transition-all hover:bg-blue-50">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Clients
                    </Button>
                </Link>
                <div className="text-sm text-gray-500">
                    Client ID: <span className="font-mono text-xs">{clientId}</span>
                </div>
            </div>

            {error ? (
                <Card className="border-red-300 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="mb-4 rounded-full bg-red-100 p-3">
                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-red-700">Failed to load client information</h3>
                            <p className="text-red-600">Please try again later or contact support if the issue persists.</p>
                            <Link href="/clients" className="mt-6">
                                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                                    Return to Clients List
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="overflow-hidden border-blue-100 shadow-md">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white">
                                <User className="h-8 w-8" />
                            </div>
                            {isLoading ? (
                                <div className="w-full">
                                    <Skeleton className="mb-2 h-8 w-3/4 bg-white/20" />
                                    <Skeleton className="h-4 w-1/2 bg-white/20" />
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-3xl font-bold">{client?.fullName}</h1>
                                    <p className="text-blue-100">{client?.email ?? "No email provided"}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <CardContent className="p-6">
                        <div className="mb-8 grid gap-6 md:grid-cols-2">
                            <div className="rounded-lg bg-blue-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-blue-700">
                                    <BookOpen className="h-5 w-5" />
                                    <h3 className="font-semibold">Enrolled Program</h3>
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-6 w-2/3" />
                                ) : (
                                    <p className="text-gray-700">{client?.program?.name ?? "No program linked"}</p>
                                )}
                            </div>

                            <div className="rounded-lg bg-blue-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-blue-700">
                                    <Calendar className="h-5 w-5" />
                                    <h3 className="font-semibold">Enrolled Since</h3>
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-6 w-1/2" />
                                ) : (
                                    <p className="text-gray-700">
                                        {client?.createdAt ? format(new Date(client.createdAt), "PPP p") : "Unknown"}
                                    </p>
                                )}
                            </div>
                            {(isLoading || client?.phone) && (
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <div className="mb-2 flex items-center gap-2 text-blue-700">
                                        <Phone className="h-5 w-5" />
                                        <h3 className="font-semibold">Phone Contact</h3>
                                    </div>
                                    {isLoading ? (
                                        <Skeleton className="h-6 w-1/3" />
                                    ) : (
                                        <p className="text-gray-700">{client?.phone}</p>
                                    )}
                                </div>
                            )}

                            <div className="rounded-lg bg-blue-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-blue-700">
                                    <FileText className="h-5 w-5" />
                                    <h3 className="font-semibold">Program Description</h3>
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-16 w-full" />
                                ) : (
                                    <p className="text-gray-700">{client?.program?.description ?? "No description available"}</p>
                                )}
                            </div>
                        </div>


                        <div className="mt-8">
                            <h2 className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-800">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Doctor&apos;s Professional Review
                            </h2>
                            {clientId && <DoctorReviewSection clientId={clientId} />}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ClientDetailPage;