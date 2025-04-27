"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "sonner";

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

    const [programData, setProgramData] = useState<ProgramData | null>(null);
    const [bannerURL, setBannerURL] = useState<string | null>(null);

    const { data, isLoading, isError } = api.programs.programByIdRouter.useQuery({
        programId,
    });

    const updateProgram = api.programs.updateProgram.useMutation({
        onSuccess: async () => {
            setProgramData(null);
            setBannerURL(null); 
            await utils.programs.programByIdRouter.invalidate({ programId });
            toast.success("Program updated successfully", {
                position: "top-right",
            });
            if (onClose) onClose();
        },
        onError: (error) => {
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

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching program data.</p>;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        updateProgram.mutate({
            programId,
            name: programData?.name,
            description: programData?.description,
            logo: bannerURL ?? undefined,
        });
    };

    return (
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-4 shadow-md sm:p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Edit Program</h2>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Program Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={programData?.name ?? ""}
                        onChange={(e) =>
                            setProgramData({
                                ...programData,
                                name: e.target.value,
                                description: programData?.description ?? "",
                                banner: programData?.banner ?? null,
                            })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={programData?.description ?? ""}
                        onChange={(e) =>
                            setProgramData({
                                ...programData,
                                description: e.target.value,
                                name: programData?.name ?? "",
                                banner: programData?.banner ?? null,
                            })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Program Banner
                    </label>
                    <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                            setBannerURL(res[0]?.url ?? "");
                            toast.success("Banner uploaded successfully", {
                                position: "top-right",
                            });
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(error.message || "Banner upload failed", {
                                position: "top-right",
                            });
                        }}
                    />
                    {bannerURL && (
                        <div className="mt-2">
                            <Image
                                width={128}
                                height={128}
                                src={bannerURL}
                                alt="Program banner"
                                className="h-32 w-32 rounded-md object-cover"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProgramForm;