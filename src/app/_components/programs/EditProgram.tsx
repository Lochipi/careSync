"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import Image from "next/image";
import { X, Save, Image as ImageIcon, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

interface NewProgramFormProps {
    programId: string;
    onClose?: () => void;
}

const EditProgramForm = ({ programId, onClose }: NewProgramFormProps) => {
    interface ProgramData {
        name: string;
        description: string;
        banner: string | null;
    }

    const utils = api.useUtils();
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [programData, setProgramData] = useState<ProgramData | null>(null);
    const [bannerURL, setBannerURL] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { data, isLoading, isError } = api.programs.programByIdRouter.useQuery({
        programId,
    });

    const updateProgram = api.programs.updateProgram.useMutation({
        onMutate: () => {
            setFormStatus("submitting");
        },
        onSuccess: async () => {
            await utils.programs.programByIdRouter.invalidate({ programId });
            setFormStatus("success");
            toast.success("Program updated successfully", {
                position: "top-right",
            });
 
            setTimeout(() => {
                if (onClose) onClose();
                setFormStatus("idle");
            }, 1500);
        },
        onError: (error) => {
            setFormStatus("idle");
            toast.error(error.message || "Program update failed", {
                position: "top-right",
            });
        },
    });

    useEffect(() => {
        if (data) {
            setProgramData({
                name: data.name,
                description: data.description ?? "",
                banner: data.logo ?? null,
            });
            setBannerURL(data?.logo ?? null);
        }
    }, [data]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!programData?.name.trim()) {
            toast.error("Program name is required");
            return;
        }

        updateProgram.mutate({
            programId,
            name: programData?.name,
            description: programData?.description,
            logo: bannerURL ?? undefined,
        });
    };

    const handleInputChange = (field: keyof ProgramData, value: string) => {
        if (programData) {
            setProgramData({
                ...programData,
                [field]: value,
            });
        }
    };

    if (isLoading) {
        return (
            <Card className="mx-auto max-w-2xl">
                <CardHeader className="pb-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-32 rounded-md" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="mx-auto max-w-2xl border-red-200 bg-red-50">
                <CardHeader>
                    <CardTitle className="text-red-700">Error</CardTitle>
                    <CardDescription className="text-red-600">
                        Unable to load program data. Please try again later.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="mx-auto max-w-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Edit Program</CardTitle>
                    <CardDescription className="text-gray-600">
                        Update your program details and banner
                    </CardDescription>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700">
                            Program Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={programData?.name ?? ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="focus-visible:ring-blue-500"
                            placeholder="Enter program name"
                            disabled={formStatus !== "idle"}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-700">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={programData?.description ?? ""}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="min-h-32 focus-visible:ring-blue-500"
                            placeholder="Describe your program..."
                            disabled={formStatus !== "idle"}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-gray-700">Program Banner</Label>

                        <div className="flex flex-wrap items-center gap-4">
                            {bannerURL && (
                                <div className="relative rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                                    <Image
                                        width={128}
                                        height={128}
                                        src={bannerURL}
                                        alt="Program banner"
                                        className="h-32 w-32 rounded-md object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                        onClick={() => setBannerURL(null)}
                                        disabled={formStatus !== "idle"}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}

                            {!bannerURL && !isUploading && (
                                <div className="flex h-32 w-32 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                </div>
                            )}

                            {isUploading && (
                                <div className="flex h-32 w-32 items-center justify-center rounded-md border border-dashed border-blue-300 bg-blue-50">
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                        <span className="mt-2 text-xs font-medium text-blue-600">Uploading...</span>
                                    </div>
                                </div>
                            )}

                            <div className={bannerURL ? "" : "ml-0"}>
                                <UploadButton
                                    endpoint="imageUploader"
                                    onUploadBegin={() => setIsUploading(true)}
                                    onClientUploadComplete={(res) => {
                                        setBannerURL(res[0]?.url ?? "");
                                        setIsUploading(false);
                                        toast.success("Banner uploaded successfully", {
                                            position: "top-right",
                                        });
                                    }}
                                    onUploadError={(error: Error) => {
                                        setIsUploading(false);
                                        toast.error(error.message || "Banner upload failed", {
                                            position: "top-right",
                                        });
                                    }}
                                    appearance={{
                                        button: "bg-blue-600 hover:bg-blue-700",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={formStatus !== "idle" || !programData?.name}
                    >
                        {formStatus === "idle" && (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </>
                        )}
                        {formStatus === "submitting" && (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        )}
                        {formStatus === "success" && (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" /> Saved Successfully
                            </>
                        )}
                    </Button>

                    {formStatus === "submitting" && (
                        <div className="mt-2">
                            <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                                <div className="h-full animate-pulse bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                            </div>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default EditProgramForm;