import express from "express";
import cors from "cors";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

loadEnv({ path: "../../.env" });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AuthUser {
  id: string;
  email: string;
}

async function authenticateRequest(req: express.Request): Promise<AuthUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email || "",
  };
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/me", async (req, res) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: employee, error } = await supabase
      .from("Employee")
      .select("*, entitlements:Entitlement(*)")
      .eq("upn", user.email)
      .single();

    if (error || !employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ profile: employee });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/weeks", async (req, res) => {
  try {
    const year = Number.parseInt(req.query.year as string || "2025", 10);

    const { data: weeks, error } = await supabase
      .from("Week")
      .select("*")
      .eq("year", year)
      .order("monday_date", { ascending: true });

    if (error) {
      console.error("Error fetching weeks:", error);
      return res.status(500).json({ message: "Error fetching weeks" });
    }

    res.json({ weeks: weeks || [] });
  } catch (error) {
    console.error("Error in weeks endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/requests", async (req, res) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const mine = req.query.mine === "true";
    const year = Number.parseInt(req.query.year as string || "2025", 10);

    let query = supabase
      .from("TimeOffRequest")
      .select("*, requestWeeks:RequestWeek(*)");

    if (mine) {
      const { data: employee } = await supabase
        .from("Employee")
        .select("id")
        .eq("upn", user.email)
        .single();

      if (employee) {
        query = query.eq("employeeId", employee.id);
      }
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error("Error fetching requests:", error);
      return res.status(500).json({ message: "Error fetching requests" });
    }

    res.json({ requests: requests || [] });
  } catch (error) {
    console.error("Error in requests endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/requests", async (req, res) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type, start_date, end_date, partial_day } = req.body;

    const { data: employee } = await supabase
      .from("Employee")
      .select("id")
      .eq("upn", user.email)
      .single();

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { data: request, error } = await supabase
      .from("TimeOffRequest")
      .insert({
        employeeId: employee.id,
        type,
        start_date,
        end_date,
        partial_day: partial_day || null,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating request:", error);
      return res.status(500).json({ message: "Error creating request" });
    }

    res.status(201).json({ request });
  } catch (error) {
    console.error("Error in create request endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/requests/:id/submit", async (req, res) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const { data: request, error } = await supabase
      .from("TimeOffRequest")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error submitting request:", error);
      return res.status(500).json({ message: "Error submitting request" });
    }

    res.json({ request });
  } catch (error) {
    console.error("Error in submit request endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/holidays", async (req, res) => {
  try {
    const year = Number.parseInt(req.query.year as string || "2025", 10);

    const { data: holidays, error } = await supabase
      .from("Holiday")
      .select("*")
      .gte("date", `${year}-01-01`)
      .lte("date", `${year}-12-31`)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching holidays:", error);
      return res.status(500).json({ message: "Error fetching holidays" });
    }

    res.json({ holidays: holidays || [] });
  } catch (error) {
    console.error("Error in holidays endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/settings", async (req, res) => {
  try {
    const year = Number.parseInt(req.query.year as string || "2025", 10);

    const { data: settings, error } = await supabase
      .from("Settings")
      .select("*")
      .eq("year", year)
      .single();

    if (error) {
      console.error("Error fetching settings:", error);
      return res.status(500).json({ message: "Error fetching settings" });
    }

    res.json({ settings });
  } catch (error) {
    console.error("Error in settings endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});
