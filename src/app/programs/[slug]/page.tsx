"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "~/components/ui/dialog";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Pencil, Trash2, RotateCcw, Search, Users, UserPlus, ChevronUp, ArrowLeft } from "lucide-react";
import NewClientForm from "~/app/_components/clients/NewClientForm";
import EditClientForm from "~/app/_components/clients/EditClientForm";
import Image from "next/image";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

const itemsPerPage = 3;

const ProgramPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const utils = api.useUtils();

  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const { data: programData, isLoading: programLoading, error: programError } = api.programs.programByIdRouter.useQuery(
    { programId: id ?? "" },
    { enabled: !!id }
  );

  const { data: clients, isLoading: clientsLoading, refetch: refetchClients } = api.clients.listClients.useQuery(
    { programId: id ?? "" },
    { enabled: !!id }
  );

  const deleteClientMutation = api.clients.deleteClient.useMutation({
    onSuccess: async () => {
      void refetchClients();
      toast.success("Client deleted successfully!");
      await utils.clients.listClients.invalidate({ programId: id ?? "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete client");
    },
  });

  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filteredClients, setFilteredClients] = useState(clients ?? []);

  const { register, reset, watch } = useForm({
    defaultValues: {
      clientName: "",
    },
  });

  const clientName = watch("clientName");

  useEffect(() => {
    if (clients) {
      const filtered = clients.filter((client) =>
        client.fullName.toLowerCase().includes(clientName.toLowerCase())
      );
      setFilteredClients(filtered);
      setCurrentPage(1);
    }
  }, [clientName, clients]);

  const totalPages = Math.ceil((filteredClients?.length ?? 0) / itemsPerPage);
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const paginatedClients = filteredClients?.slice(indexOfFirstClient, indexOfLastClient) ?? [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      deleteClientMutation.mutate({ clientId });
    }
  };

  const handleGoBack = () => {
    router.back();
  };
 
  if (programError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-2">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-center">
            <Trash2 className="mx-auto h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-center text-2xl font-bold text-gray-900">Error Loading Program</h1>
          <p className="mt-4 text-center text-red-600">
            Failed to load program details. Please try again.
          </p>
          <div className="mt-6 text-center">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!programLoading && !programData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
          <div className="mb-4 rounded-full bg-yellow-100 p-3 text-center">
            <Search className="mx-auto h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-center text-2xl font-bold text-gray-900">Program Not Found</h1>
          <p className="mt-4 text-center text-gray-600">
            No program details found. Please check the ID.
          </p>
          <div className="mt-6 text-center">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      return [1, 2, -1, totalPages - 1, totalPages];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 pb-16">

      <div className="container mx-auto px-6 pt-6">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="relative mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 pb-32 pt-16 text-white shadow-xl">
        <div className="absolute inset-0 bg-blue-600 opacity-10 mix-blend-overlay">
          <div className="h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
        </div>
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            {programLoading ? (
              <>
                <div className="relative mb-6 rounded-full bg-white/10 p-2 backdrop-blur-sm">
                  <div className="h-40 w-40 animate-pulse rounded-full bg-blue-300/50"></div>
                </div>
                <div className="mb-3 h-8 w-64 animate-pulse rounded-lg bg-white/20"></div>
                <div className="h-4 w-full max-w-md animate-pulse rounded-lg bg-white/20"></div>
                <div className="mt-2 h-4 w-3/4 max-w-md animate-pulse rounded-lg bg-white/20"></div>
              </>
            ) : (
              <>
                <div className="relative mb-6 rounded-full bg-white/10 p-2 backdrop-blur-sm">
                  <Image
                    src={programData?.logo ?? "/program.jpg"}
                    alt={programData?.name ?? "Program Image"}
                    width={160}
                    height={160}
                    className="rounded-full object-cover shadow-lg"
                  />
                </div>
                <h1 className="mb-3 text-4xl font-bold">{programData?.name}</h1>
                <p className="max-w-2xl text-lg text-white/90">{programData?.description}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container relative mx-auto -mt-24 max-w-5xl px-6">
        <div className="mb-10 overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="flex flex-col justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6 md:flex-row md:items-center">
            <div className="mb-4 flex items-center md:mb-0">
              <div className="mr-4 rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
                <p className="text-sm text-gray-500">Manage clients in this program</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-all hover:shadow-lg"
            >
              {showCreateForm ? <ChevronUp className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {showCreateForm ? "Hide Form" : "Add New Client"}
            </Button>
          </div>

          {showCreateForm && (
            <div className="border-b border-gray-100 bg-blue-50/50 px-6 sm:px-1 py-8">
              <div className="mx-auto rounded-xl bg-white p-3 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Create New Client</h3>
                <NewClientForm programId={id ?? ""} />
              </div>
            </div>
          )}

          <div className="border-b border-gray-100 sm:px-1 px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register("clientName")}
                  placeholder="Search clients by name..."
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => reset()}
                className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Search
              </Button>
            </div>
          </div>

          <div className="px-6 py-6">
            {clientsLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <div className="h-12 w-full animate-pulse bg-blue-200"></div>
                    <div className="p-6">
                      <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-blue-100"></div>
                      <div className="mx-auto h-6 w-32 animate-pulse rounded-lg bg-gray-200"></div>
                      <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded-lg bg-gray-100"></div>
                      <div className="mt-4 flex justify-center gap-3 border-t border-gray-100 pt-4">
                        <div className="h-8 w-16 animate-pulse rounded-md bg-gray-200"></div>
                        <div className="h-8 w-16 animate-pulse rounded-md bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedClients.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {paginatedClients.map((client) => (
                  <div
                    key={client.id}
                    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg hover:transform"
                  >
                    <div className="absolute right-0 left-0 top-0 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"></div>
                    <div className="flex flex-col items-center px-6 pb-6 pt-16">
                      <div className="absolute top-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white shadow-md">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                          {client.fullName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-gray-800">{client.fullName}</h3>
                      <p className="text-sm text-gray-500">{client.email}</p>

                      <div className="mt-4 flex w-full justify-center gap-3 border-t border-gray-100 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditClientId(client.id);
                            setOpenModal(true);
                          }}
                          className="flex items-center gap-1 border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                          className="flex items-center gap-1 border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-12 text-center">
                <div className="mb-4 rounded-full bg-blue-100 p-4">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">No Clients Found</h3>
                <p className="mt-2 text-gray-500">
                  {clientName ? "No clients match your search criteria" : "This program doesn't have any clients yet"}
                </p>
                <Button
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    reset();
                    setShowCreateForm(true);
                  }}
                >
                  Add Your First Client
                </Button>
              </div>
            )}
          </div>

          {totalPages > 1 && !clientsLoading && (
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {renderPageNumbers().map((pageNum, idx) =>
                    pageNum === -1 ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          isActive={pageNum === currentPage}
                          className={pageNum === currentPage ? "bg-blue-600" : ""}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Client</DialogTitle>
          </DialogHeader>
          {editClientId && <EditClientForm clientId={editClientId} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramPage;