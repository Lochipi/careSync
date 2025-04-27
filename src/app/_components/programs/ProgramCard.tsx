"use client";

import { Card, CardFooter, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import { Trash2, Pencil, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Program {
    id: string;
    name: string;
    description: string | null;
    logo?: string | null;
}

interface ProgramCardProps {
    program: Program;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ProgramCard({ program, onEdit, onDelete }: ProgramCardProps) {
    return (
        <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <Link href={`/programs/${program.id}`} className="block overflow-hidden">
                <AspectRatio ratio={16 / 9} className="bg-gradient-to-br from-blue-100 to-indigo-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity group-hover:opacity-20" />
                    <Image
                        src={program.logo ?? "/default-banner.jpg"}
                        alt={`${program.name} Banner`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-white/80 p-2 opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                </AspectRatio>
            </Link>

            <CardHeader className="pb-0 pt-6">
                <CardTitle className="line-clamp-1 text-2xl font-bold text-gray-900">
                    {program.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2 text-base text-gray-600">
                    {program.description ?? "No description provided"}
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-3 pt-4">
                <Link
                    href={`/programs/${program.id}`}
                    className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 hover:text-blue-800"
                >
                    View details <ExternalLink className="ml-2 h-3 w-3" />
                </Link>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit(program.id);
                    }}
                    className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                >
                    <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(program.id);
                    }}
                    className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                >
                    <Trash2 className="h-4 w-4" /> Delete
                </Button>
            </CardFooter>
        </Card>
    );
}