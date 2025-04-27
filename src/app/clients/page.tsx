"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "~/components/ui/pagination";
import { RotateCcw, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const itemsPerPage = 6;

const ClientsPage = () => {
  const { data: clients, isLoading, error } = api.clients.listClients.useQuery({});
  const [filteredClients, setFilteredClients] = useState<typeof clients>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { register, watch, reset } = useForm({
    defaultValues: { search: "" },
  });

  const search = watch("search");

  useEffect(() => {
    if (clients) {
      const filtered = clients.filter((client) =>
        client.fullName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredClients(filtered);
      setCurrentPage(1);
    }
  }, [search, clients]);

  const totalPages = Math.ceil((filteredClients?.length ?? 0) / itemsPerPage);
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const paginatedClients = filteredClients?.slice(indexOfFirstClient, indexOfLastClient) ?? [];

  if (isLoading) {
    return <p className="mt-10 text-center text-gray-600">Loading clients...</p>;
  }

  if (error) {
    toast.error("Failed to fetch clients.");
    return <p className="mt-10 text-center text-red-600">Something went wrong.</p>;
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link href="/programs">
          <Button>Add new client to the program</Button>
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <Input {...register("search")} placeholder="Search clients by name..." />
        <Button variant="outline" onClick={() => reset()}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedClients.length > 0 ? (
          paginatedClients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle className="text-lg">{client.fullName}</CardTitle>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Link href={`/clients/${client.id}`}>
                  <Button size="sm" variant="secondary" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No clients found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination>
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === idx + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(idx + 1);
                    }}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
