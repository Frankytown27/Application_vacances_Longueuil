import { app } from "@azure/functions";
import { getSettings } from "../services/timeOffService";

app.http("get-settings", {
  methods: ["GET"],
  route: "settings",
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const yearParam = request.query.get("year");
      const year = yearParam ? Number.parseInt(yearParam, 10) : new Date().getFullYear();
      const settings = await getSettings(year);
      return { status: 200, jsonBody: { settings } };
    } catch (error) {
      context.log.error("Error retrieving settings", error);
      return { status: 500, jsonBody: { message: "Erreur lors du chargement des paramètres" } };
    }
  },
});
