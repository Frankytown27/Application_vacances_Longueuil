import { app } from "@azure/functions";
import { appConfig } from "../config";
import { requireAuth } from "../middleware/authenticate";
import { createDraftRequest, createRequestSchema, listRequests, submitRequest } from "../services/timeOffService";

app.http("list-requests", {
  methods: ["GET"],
  route: "requests",
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const auth = requireAuth(request, context);
      const mine = request.query.get("mine") === "true";
      const year = Number.parseInt(request.query.get("year") ?? String(appConfig.defaultYear), 10);

      const requests = await listRequests({
        upn: auth.upn,
        year,
        mine,
      });

      return { status: 200, jsonBody: { requests } };
    } catch (error) {
      context.log.error("Error listing requests", error);
      return { status: 500, jsonBody: { message: "Erreur lors du chargement des demandes" } };
    }
  },
});

app.http("create-request", {
  methods: ["POST"],
  route: "requests",
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const auth = requireAuth(request, context);
      const body = await request.json();
      const payload = createRequestSchema.parse(body);
      const created = await createDraftRequest(payload, auth.upn);
      return { status: 201, jsonBody: { request: created } };
    } catch (error) {
      context.log.error("Error creating request", error);
      return { status: 400, jsonBody: { message: "Création impossible", details: (error as Error).message } };
    }
  },
});

app.http("submit-request", {
  methods: ["POST"],
  route: "requests/{id}/submit",
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      requireAuth(request, context);
      const id = request.params.id;
      const updated = await submitRequest(id);
      return { status: 200, jsonBody: { request: updated } };
    } catch (error) {
      context.log.error("Error submitting request", error);
      return { status: 400, jsonBody: { message: "Soumission impossible" } };
    }
  },
});
