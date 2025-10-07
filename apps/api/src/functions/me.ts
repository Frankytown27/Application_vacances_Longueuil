import { app } from "@azure/functions";
import { appConfig } from "../config";
import { requireAuth } from "../middleware/authenticate";
import { getEmployeeProfile } from "../services/profileService";

app.http("get-me", {
  methods: ["GET"],
  route: "me",
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const auth = requireAuth(request, context);
      const profile = await getEmployeeProfile(auth.upn, appConfig.defaultYear);

      return {
        status: 200,
        jsonBody: {
          profile,
        },
      };
    } catch (error) {
      context.log.error("Error in GET /me", error);
      return { status: 401, jsonBody: { message: "Non autorisé" } };
    }
  },
});
