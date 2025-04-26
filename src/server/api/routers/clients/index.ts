import { createTRPCRouter } from "../../trpc";
import { deleteClient } from "./deleteClient";
import { updateClient } from "./updateClient";
import { listClients } from "./listClients";
import { createClient } from "./createNew";
import { clientsByIdRouter } from "./getClientById";

export const clientsRouter = createTRPCRouter({
    createClient,
    deleteClient,
    updateClient,
    listClients,
    clientsByIdRouter,
});
