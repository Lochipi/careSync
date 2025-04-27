"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { api } from "~/trpc/react";

interface ClientFormValues {
  fullName: string;
  email?: string;
  phone?: string;
  programId: string;
}

interface ClientFormProps {
  programId: string;
}

const NewClientForm: React.FC<ClientFormProps> = ({ programId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ClientFormValues>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      programId,
    },
  });

  const utils = api.useUtils();

  const createClientMutation = api.clients.createClient.useMutation({
    onSuccess: async () => {
      toast.success("Client created successfully", { position: "top-right" });
      await utils.clients.clientsByIdRouter.invalidate({ clientId: programId });
      reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create client", { position: "top-right" });
    },
  });

  function onSubmit(data: ClientFormValues) {
    createClientMutation.mutate({
      ...data,
      programId,
    });
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Client full name"
              {...register("fullName", { required: "Full name is required", minLength: { value: 2, message: "At least 2 chars" } })}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@example.com"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              {...register("phone", {
                pattern: {
                  value: /^\+?[0-9\s\-]{7,15}$/,
                  message: "Invalid phone number",
                },
              })}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          <Button type="submit" disabled={!isValid} className="w-full">
            Create Client
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewClientForm;
