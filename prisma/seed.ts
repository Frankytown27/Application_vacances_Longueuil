import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

interface ConfigFile {
  min_staff_by_team_and_week: Record<string, Record<string, number>>;
  blackout_weeks: string[];
  holidays: { date: string; label: string; applies_to: string }[];
  rounds: {
    rounds_count: number;
    max_weeks_per_round: number;
    windows: { round_number: number; opens_at: string; closes_at: string; allowed_weeks_this_round: number }[];
  };
  year: number;
}

async function main() {
  const dataDir = path.join(__dirname, "..", "data");
  const configPath = path.join(__dirname, "..", "config", "2025.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as ConfigFile;

  const employees = [
    {
      full_name: "André Lavoie",
      upn: "andre.lavoie@longueuil.ca",
      team: "Direction",
      division: "Développement urbain",
      seniority_date: new Date("2004-01-01T00:00:00Z"),
    },
    {
      full_name: "Bianca Morin",
      upn: "bianca.morin@longueuil.ca",
      team: "Direction",
      division: "Développement urbain",
      seniority_date: new Date("2012-06-10T00:00:00Z"),
    },
    {
      full_name: "Charles Gagnon",
      upn: "charles.gagnon@longueuil.ca",
      team: "Projets majeurs",
      division: "Développement urbain",
      seniority_date: new Date("2019-09-01T00:00:00Z"),
    },
    {
      full_name: "Daphnée Roy",
      upn: "daphnee.roy@longueuil.ca",
      team: "Projets majeurs",
      division: "Développement urbain",
      seniority_date: new Date("2015-03-16T00:00:00Z"),
    },
  ];

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { upn: employee.upn },
      update: employee,
      create: {
        ...employee,
        status: "active",
      },
    });
  }

  // Weeks for Q2-Q3 2025
  const startMonday = new Date("2025-05-05T00:00:00Z");
  for (let i = 0; i < 12; i += 1) {
    const monday = new Date(startMonday);
    monday.setUTCDate(startMonday.getUTCDate() + i * 7);
    await prisma.week.upsert({
      where: { monday_date: monday },
      update: {},
      create: {
        monday_date: monday,
        year: 2025,
        week_number_iso: Number.parseInt(new Intl.DateTimeFormat("fr-CA-u-ca-iso8601", { week: "numeric" }).format(monday), 10),
      },
    });
  }

  await prisma.settings.upsert({
    where: { year: config.year },
    update: {
      rounds_count: config.rounds.rounds_count,
      max_weeks_per_round: config.rounds.max_weeks_per_round,
      min_staff_by_team_and_week: config.min_staff_by_team_and_week,
      blackout_weeks: config.blackout_weeks,
      priority_logic: "seniority",
    },
    create: {
      year: config.year,
      rounds_count: config.rounds.rounds_count,
      max_weeks_per_round: config.rounds.max_weeks_per_round,
      min_staff_by_team_and_week: config.min_staff_by_team_and_week,
      blackout_weeks: config.blackout_weeks,
      priority_logic: "seniority",
    },
  });

  for (const holiday of config.holidays) {
    await prisma.holiday.upsert({
      where: { date: new Date(`${holiday.date}T00:00:00Z`) },
      update: { label: holiday.label, applies_to: holiday.applies_to },
      create: { date: new Date(`${holiday.date}T00:00:00Z`), label: holiday.label, applies_to: holiday.applies_to },
    });
  }

  for (const round of config.rounds.windows) {
    await prisma.round.upsert({
      where: {
        year_round_number: {
          year: config.year,
          round_number: round.round_number,
        },
      },
      update: {
        opens_at: new Date(round.opens_at),
        closes_at: new Date(round.closes_at),
        allowed_weeks_this_round: round.allowed_weeks_this_round,
      },
      create: {
        year: config.year,
        round_number: round.round_number,
        opens_at: new Date(round.opens_at),
        closes_at: new Date(round.closes_at),
        allowed_weeks_this_round: round.allowed_weeks_this_round,
      },
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
