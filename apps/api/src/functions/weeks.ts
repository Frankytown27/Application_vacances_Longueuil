import { app } from "@azure/functions";
import { listWeeks } from "../services/timeOffService";

app.http("get-weeks", {
  methods: ["GET"],
  route: "weeks",
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const yearParam = request.query.get("year");
      const year = yearParam ? Number.parseInt(yearParam, 10) : new Date().getFullYear();
      const weeks = await listWeeks(year);
      return { status: 200, jsonBody: { weeks } };
    } catch (error) {
      context.log.error("Error retrieving weeks", error);
      return { status: 500, jsonBody: { message: "Erreur lors du chargement des semaines" } };
    }
  },
});
