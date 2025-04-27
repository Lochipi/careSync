"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Pencil, Trash2, RotateCcw } from "lucide-react";
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

  const utils = api.useUtils();

  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const { data, isLoading, error } = api.programs.programByIdRouter.useQuery(
    { programId: id ?? "" },
    { enabled: !!id }
  );

  const { data: clients, refetch: refetchClients } = api.clients.listClients.useQuery(
    { programId: id ?? "" }
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

  // Filter clients by search term
  useEffect(() => {
    if (clients) {
      const filtered = clients.filter((client) =>
        client.fullName.toLowerCase().includes(clientName.toLowerCase())
      );
      setFilteredClients(filtered);
      setCurrentPage(1); // reset to first page on search/filter change
    }
  }, [clientName, clients]);

  // Pagination calculation
  const totalPages = Math.ceil((filteredClients?.length ?? 0) / itemsPerPage);
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const paginatedClients = filteredClients?.slice(indexOfFirstClient, indexOfLastClient) ?? [];

  // Handle page change from pagination UI
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

  if (isLoading) {
    return <p className="mt-10 text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return (
      <p className="mt-10 text-center text-red-600">
        Failed to load program details. Please try again.
      </p>
    );
  }

  if (!data) {
    return (
      <p className="mt-10 text-center text-gray-600">
        No program details found. Please check the ID.
      </p>
    );
  }

  // Generate simple page numbers for pagination UI
  const renderPageNumbers = () => {
    // Show first 2, last 2 pages and ellipsis if more than 5 pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      return [1, 2, -1, totalPages - 1, totalPages];
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col items-center text-center">
        <Image
          src={data.logo ?? "/program.jpg"}
          alt={data.name || "Program Image"}
          width={200}
          height={200}
          className="mb-6 rounded-full object-cover shadow-md"
        />
        <h1 className="mb-2 text-3xl font-bold text-gradient">{data.name}</h1>
        <p className="mb-4 text-lg text-gray-600">{data.description}</p>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => setShowCreateForm((prev) => !prev)} variant="default">
          {showCreateForm ? "Hide Create Form" : "Create New Client"}
        </Button>
        {showCreateForm && (
          <div className="mt-6">
            <NewClientForm programId={id ?? ""} />
          </div>
        )}
      </div>

      {/* Search and Reset */}
      <div className="mt-16">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Clients in Program</h2>
        <div className="flex items-center gap-4">
          <Input {...register("clientName")} placeholder="Search by name" className="flex-1" />
          <Button
            variant="outline"
            onClick={() => {
              reset();
            }}
            className="flex items-center gap-2"
          >
            <RotateCcw />
            Reset
          </Button>
        </div>
      </div>

      {/* Client List */}
      <div className="mt-8 space-y-4">
        {paginatedClients.map((client) => (
          <div
            key={client.id}
            className="flex items-center rounded-lg border bg-white p-4 shadow-lg"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{client.fullName}</h3>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setEditClientId(client.id);
                  setOpenModal(true);
                }}
              >
                <Pencil />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClient(client.id)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage === 1 ? (
                <button
                  className="pagination-previous disabled"
                  disabled
                >
                  Previous
                </button>
              ) : (
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
              )}
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
                    aria-current={pageNum === currentPage ? "page" : undefined}
                    className={pageNum === currentPage ? "font-bold" : ""}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              {currentPage === totalPages ? (
                <button
                  className="pagination-next disabled"
                  disabled
                >
                  Next
                </button>
              ) : (
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Edit Client Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogTitle>Edit Client</DialogTitle>
          {editClientId && <EditClientForm clientId={editClientId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramPage;
