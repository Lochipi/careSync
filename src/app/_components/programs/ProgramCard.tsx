"use client"

import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { Button } from "~/components/ui/button"
import { Trash2, Pencil } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Program {
    id: string
    name: string
    description: string | null
    logo?: string | null
}

interface ProgramCardProps {
    program: Program
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function ProgramCard({ program, onEdit, onDelete }: ProgramCardProps) {
    return (
        <Card className="rounded-2xl shadow-sm transition hover:shadow-md">
            <Link href={`/programs/${program.id}`} className="block">
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-t-2xl">
                    <Image
                        src={program.logo ?? "/default-banner.jpg"}
                        alt={`${program.name} Banner`}
                        fill
                        className="object-cover"
                    />
                </AspectRatio>
            </Link>
            <CardHeader>
                <CardTitle className="line-clamp-1 text-xl font-semibold">{program.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-muted-foreground">{program.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(program.id)}
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(program.id)}
                >
                    <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
            </CardFooter>
        </Card>
    )
}
