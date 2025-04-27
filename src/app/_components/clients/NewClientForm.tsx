"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Loader2, User, Mail, Phone, CheckCircle } from "lucide-react";
import { cn } from "~/lib/utils";

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
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
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
    onMutate: () => {
      setFormStatus("submitting");
    },
    onSuccess: async () => {
      toast.success("Client created successfully", { position: "top-right" });
      await utils.clients.clientsByIdRouter.invalidate({ clientId: programId });
      await utils.clients.listClients.invalidate({ programId });
      reset();
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create client", { position: "top-right" });
      setFormStatus("idle");
    },
  });

  function onSubmit(data: ClientFormValues) {
    createClientMutation.mutate({
      ...data,
      programId,
    });
  }

  const watchedValues = watch();
  const hasValues = Object.values(watchedValues).some(value =>
    typeof value === 'string' && value.trim() !== '' && value !== programId
  );

  return (
    <div className="w-full px-2 sm:px-0 flex justify-center">
      <Card className="w-full sm:w-[400px] overflow-hidden border-gray-200 shadow-lg">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-800">Add New Client</CardTitle>
          <CardDescription className="text-gray-600">
            Add a client to your program to start managing their information
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="fullName"
                  placeholder="Client full name"
                  className={cn(
                    "pl-10 transition-all",
                    errors.fullName
                      ? "border-red-300 ring-red-100 focus:border-red-500 focus:ring-red-200"
                      : "focus:border-blue-500 focus:ring-blue-200"
                  )}
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: { value: 2, message: "At least 2 characters required" }
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm font-medium text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email (optional)
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  className={cn(
                    "pl-10 transition-all",
                    errors.email
                      ? "border-red-300 ring-red-100 focus:border-red-500 focus:ring-red-200"
                      : "focus:border-blue-500 focus:ring-blue-200"
                  )}
                  {...register("email", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-sm font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Phone (optional)
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  className={cn(
                    "pl-10 transition-all",
                    errors.phone
                      ? "border-red-300 ring-red-100 focus:border-red-500 focus:ring-red-200"
                      : "focus:border-blue-500 focus:ring-blue-200"
                  )}
                  {...register("phone", {
                    pattern: {
                      value: /^\+?[0-9\s\-]{7,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-sm font-medium text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid || !isDirty || !hasValues || formStatus !== "idle"}
              className={cn(
                "relative mt-4 w-full transition-all",
                formStatus === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              )}
            >
              {formStatus === "submitting" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {formStatus === "success" && (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {formStatus === "idle" && "Create Client"}
              {formStatus === "submitting" && "Creating..."}
              {formStatus === "success" && "Client Created!"}
            </Button>

            {formStatus === "submitting" && (
              <div className="mt-4">
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full animate-pulse bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewClientForm;
