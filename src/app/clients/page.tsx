"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "~/components/ui/pagination";
import { RotateCcw, Eye, Users, Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";

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

  if (error) {
    toast.error("Failed to fetch clients.");
    return (
      <div className="mx-auto max-w-7xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Clients</h1>
          <Link href="/programs">
            <Button>Add new client to the program</Button>
          </Link>
        </div>
        <Card className="border-red-200 bg-red-50 py-8">
          <CardContent className="flex flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-red-100 p-3">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-red-700">Error Loading Clients</h3>
            <p className="text-center text-red-600 mb-4">Something went wrong while fetching client data.</p>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold">Clients</h1>
          {isLoading ? null : (
            <div className="ml-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {filteredClients?.length ?? 0} total
            </div>
          )}
        </div>
        <Link href="/programs">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add new client
          </Button>
        </Link>
      </div>

      <Card className="mb-6 p-4 border-blue-100">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              {...register("search")}
              placeholder="Search clients by name..."
              className="pl-9 border-blue-200 focus:border-blue-400"
              disabled={isLoading}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => reset()}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? ( 
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden border-gray-100">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : paginatedClients.length > 0 ? (
          paginatedClients.map((client) => (
            <Card key={client.id} className="border-blue-100 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  {client.fullName}
                </CardTitle>
                <p className="text-sm text-gray-500">{client.email ?? "No email provided"}</p>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-end">
                  <Link href={`/clients/${client.id}`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg bg-gray-50 p-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No clients found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search criteria or add new clients.</p>
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
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
                    className={currentPage === idx + 1 ? "bg-blue-600" : ""}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {isLoading && (
        <div className="mt-6 flex items-center justify-center text-blue-600">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm">Loading client data...</span>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;