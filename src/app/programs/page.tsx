"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import EditProgramForm from "../_components/programs/EditProgram";
import NewProgramForm from "../_components/programs/NewProgramForm";
import { ProgramCard } from "../_components/programs/ProgramCard";
import { Plus, X, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

const ProgramPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [editProgramId, setEditProgramId] = useState<string | null>(null);

    const {
        data: programsList,
        isLoading,
        refetch,
    } = api.programs.listPrograms.useQuery();

    const deleteMutation = api.programs.deleteProgram.useMutation({
        onSuccess: () => {
            void refetch();
            toast.success("Program deleted successfully", {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete program", {
                position: "top-right",
            });
        },
    });

    const handleDelete = (programId: string) => {
        if (confirm("Are you sure you want to delete this program?")) {
            deleteMutation.mutate({ programId });
        }
    };

    const handleEdit = (programId: string) => {
        setEditProgramId(programId);
        setShowForm(true);
    };

    const ProgramCardSkeleton = () => (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-10 w-1/2 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="mb-4 h-4 w-3/4 rounded-md" />
            <Skeleton className="mb-4 h-24 w-full rounded-md" />
            <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-8 w-16 rounded-md" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4 py-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 rounded-2xl bg-white p-8 shadow-xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-4xl font-extrabold text-transparent">
                                Program Manager
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">Create and manage your programs in one place</p>
                        </div>
                        <Button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditProgramId(null);
                            }}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                            size="lg"
                            disabled={isLoading}
                        >
                            {showForm ? (
                                <>
                                    <X className="h-5 w-5" /> Close Form
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" /> Create Program
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2">
                                <Sparkles className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-700">
                                Create and customize programs that meet your needs. Add detailed descriptions and logos to make them stand out.
                            </p>
                        </div>
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-all duration-300">
                        <div className="relative w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl">
                            <div className="absolute -right-3 -top-3">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-full bg-gray-100 p-2 shadow-md hover:bg-gray-200"
                                >
                                    <X className="h-5 w-5 text-gray-700" />
                                </Button>
                            </div>
                            <h3 className="mb-8 text-center text-3xl font-bold text-gray-800">
                                {editProgramId ? "Edit Program" : "Create New Program"}
                            </h3>
                            {editProgramId ? (
                                <EditProgramForm programId={editProgramId} onClose={() => {
                                    setShowForm(false);
                                    setEditProgramId(null);
                                    void refetch();
                                }} />
                            ) : (
                                <NewProgramForm />
                            )}
                        </div>
                    </div>
                )}

                <div className="mx-auto">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((index) => (
                                <ProgramCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {programsList && programsList.length > 0 ? (
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {programsList.map((program) => (
                                        <ProgramCard
                                            key={program.id}
                                            program={program}
                                            onEdit={() => handleEdit(program.id)}
                                            onDelete={() => handleDelete(program.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-2xl bg-white p-16 text-center shadow-xl">
                                    <div className="mb-6 rounded-full bg-blue-100 p-6">
                                        <Plus className="h-10 w-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        Start Your First Program
                                    </h3>
                                    <p className="mt-3 text-lg text-gray-600">
                                        You haven&apos;t created any programs yet. Get started by creating your first one!
                                    </p>
                                    <Button
                                        onClick={() => setShowForm(true)}
                                        className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                                        size="lg"
                                    >
                                        <Plus className="mr-2 h-5 w-5" /> Create Your First Program
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgramPage;