"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import EditProgramForm from "../_components/programs/EditProgram";
import NewProgramForm from "../_components/programs/NewProgramForm";
import { ProgramCard } from "../_components/programs/ProgramCard";

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

    return (
        <div className="flex min-h-screen flex-col px-4 py-8">
            <div className="mx-auto mb-6 flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Manage Your Programs</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditProgramId(null);
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
                >
                    {showForm ? "Close Form" : "Create Program"}
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <h3 className="mb-4 text-center text-xl font-semibold text-gray-800">
                            {editProgramId ? "Edit Program" : "Create New Program"}
                        </h3>
                        {editProgramId ? (
                            <EditProgramForm programId={editProgramId} onClose={() => {
                                setShowForm(false);
                                setEditProgramId(null);
                                void refetch();
                            }} />
                        ) : (
                            <NewProgramForm refetchPrograms={refetch} />
                        )}
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-6xl">
                {isLoading && (
                    <p className="text-center text-gray-600">Loading programs...</p>
                )}

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {programsList?.map((program) => (
                        <ProgramCard
                            key={program.id}
                            program={program}
                            onEdit={() => handleEdit(program.id)}
                            onDelete={() => handleDelete(program.id)}
                        />
                    ))}
                </div>

                {!isLoading && programsList?.length === 0 && (
                    <p className="mt-4 text-center text-gray-600">
                        No programs found. Start by creating your first program!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProgramPage;
