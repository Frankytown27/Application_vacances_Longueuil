import { app } from "@azure/functions";
import { listHolidays } from "../services/timeOffService";

app.http("get-holidays", {
  methods: ["GET"],
  route: "holidays",
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const yearParam = request.query.get("year");
      const year = yearParam ? Number.parseInt(yearParam, 10) : new Date().getFullYear();
      const holidays = await listHolidays(year);
      return { status: 200, jsonBody: { holidays } };
    } catch (error) {
      context.log.error("Error retrieving holidays", error);
      return { status: 500, jsonBody: { message: "Erreur lors du chargement des jours fériés" } };
    }
  },
});
