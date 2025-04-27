"use client";

import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, Upload, ImageIcon, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().min(5, { message: "Description must be at least 5 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const NewProgramForm = () => {
    const [bannerURL, setBannerURL] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

    const queryClient = api.useUtils();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const programCreation = api.programs.createNewProgram.useMutation({
        onMutate: () => {
            setFormStatus("submitting");
        },
        onSuccess: async () => {
            await queryClient.programs.listPrograms.invalidate();
            setFormStatus("success");
            toast.success("Program created successfully");

            setTimeout(() => {
                form.reset();
                setBannerURL("");
                setFormStatus("idle");
            }, 1500);
        },
        onError: (error) => {
            setFormStatus("idle");
            toast.error(error.message || "Failed to create program");
        },
    });

    const onSubmit = (data: FormValues) => {
        if (!bannerURL) {
            toast.error("Please upload a banner image");
            return;
        }

        programCreation.mutate({
            name: data.title,
            description: data.description,
            logo: bannerURL,
        });
    };

    const isFormDisabled = formStatus !== "idle";

    return (
        <Card className="mx-auto w-full max-w-lg overflow-hidden shadow-lg">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">Create New Program</CardTitle>
                <CardDescription className="text-gray-600">
                    Fill in the details to create a new program for your clients
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Program Title <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter program title"
                                            {...field}
                                            disabled={isFormDisabled}
                                            className="focus-visible:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">
                                        Description <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter program description"
                                            {...field}
                                            disabled={isFormDisabled}
                                            className="min-h-32 focus-visible:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-3">
                            <FormLabel className="text-gray-700">
                                Banner Image <span className="text-red-500">*</span>
                            </FormLabel>

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
                                            onClick={() => setBannerURL("")}
                                            disabled={isFormDisabled}
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
                                            setIsUploading(false);
                                            setBannerURL(res[0]?.url ?? res[0]?.ufsUrl ?? "");
                                            toast.success("Banner uploaded successfully");
                                        }}
                                        onUploadError={(error: Error) => {
                                            setIsUploading(false);
                                            toast.error(error.message || "Failed to upload banner");
                                        }}
                                        appearance={{
                                            button: "bg-blue-600 hover:bg-blue-700",
                                        }}
                                        disabled={isFormDisabled}
                                    />
                                </div>
                            </div>

                            {!bannerURL && !isUploading && (
                                <p className="text-xs text-gray-500">
                                    Upload a banner image for your program (recommended size: 400x400px)
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            disabled={!bannerURL || isFormDisabled || !form.formState.isValid}
                        >
                            {formStatus === "idle" && (
                                <>
                                    <Upload className="mr-2 h-4 w-4" /> Create Program
                                </>
                            )}
                            {formStatus === "submitting" && (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                                </>
                            )}
                            {formStatus === "success" && (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Program Created!
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>

            {formStatus === "submitting" && (
                <CardFooter className="px-6 pb-6 pt-0">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full animate-pulse bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default NewProgramForm;