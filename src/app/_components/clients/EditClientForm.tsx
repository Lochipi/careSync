"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface EditClientFormProps {
  clientId: string;
}

interface ClientData {
  fullName: string;
  email?: string | null;
  phone?: string | null;
  programId: string;
}

const EditClientForm = ({ clientId }: EditClientFormProps) => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const utils = api.useUtils();

  const { data, isLoading, isError } = api.clients.clientsByIdRouter.useQuery(
    { clientId },
    { enabled: !!clientId }
  );

  const updateClient = api.clients.updateClient.useMutation({
    onSuccess: async () => {
      setIsSaving(false);
      toast.success("Client updated successfully", { position: "top-right" });
      await utils.clients.clientsByIdRouter.invalidate({ clientId });
      if (data) {
        setClientData(data);
      }
    },
    onError: (error) => {
      setIsSaving(false);
      toast.error(error.message || "Client update failed", { position: "top-right" });
    },
  });

  useEffect(() => {
    if (data) {
      setClientData(data);
    }
  }, [data]);

  if (isLoading) return <p>Loading client...</p>;
  if (isError) return <p>Error loading client data.</p>;
  if (!clientData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    updateClient.mutate({
      clientId,
      fullName: clientData.fullName,
      email: clientData.email ?? undefined,
      phone: clientData.phone ?? undefined,
      programId: clientData.programId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={clientData.fullName}
          onChange={(e) => setClientData({ ...clientData, fullName: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={clientData.email ?? ""}
          onChange={(e) => setClientData({ ...clientData, email: e.target.value || null })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={clientData.phone ?? ""}
          onChange={(e) => setClientData({ ...clientData, phone: e.target.value || null })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className={`w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition ${isSaving ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700"
          }`}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditClientForm;
