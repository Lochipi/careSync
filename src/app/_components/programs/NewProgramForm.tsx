"use client";

import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { toast } from "sonner"
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().min(5, { message: "Description must be at least 5 characters." }),
})

type FormValues = z.infer<typeof formSchema>;

const NewProgramForm = () => {
    const [bannerURL, setBannerURL] = useState<string>("");

    const queryClient = api.useUtils();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const programCreation = api.programs.createNewProgram.useMutation({
        onSuccess: async () => {
            toast.success("Program created successfully");
            await queryClient.programs.listPrograms.invalidate(); 
            form.reset();
            setBannerURL("");
        },
        onError: (error) => {
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

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardContent className="p-6 space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Program Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter program title" {...field} />
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter program description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Banner Image</FormLabel>
                            <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    setBannerURL(res[0]?.ufsUrl ?? "");
                                    toast.success("Banner uploaded successfully");
                                }}
                                onUploadError={(error: Error) => {
                                    toast.error(error.message || "Failed to upload banner");
                                }}
                            />
                            {!bannerURL && (
                                <p className="text-xs text-muted-foreground">
                                    Upload a banner for your program.
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Create Program
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default NewProgramForm;
