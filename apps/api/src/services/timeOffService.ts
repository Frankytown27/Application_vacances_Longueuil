import { differenceInCalendarDays } from "date-fns";
import { z } from "zod";
import { prisma } from "../utils/prismaClient";
import { computeDaysInWeek, weekBoundsFromMonday } from "../utils/weekUtils";

export const createRequestSchema = z.object({
  type: z.enum(["VAC", "TA", "PER", "CM", "OTHER"]),
  start_date: z.string(),
  end_date: z.string(),
  partial_day: z.enum(["AM", "PM", "FULL"]).optional(),
});

export async function listWeeks(year: number) {
  return prisma.week.findMany({
    where: { year },
    orderBy: { monday_date: "asc" },
  });
}

export async function getSettings(year: number) {
  return prisma.settings.findUnique({ where: { year } });
}

export async function listHolidays(year: number) {
  return prisma.holiday.findMany({
    where: {
      date: {
        gte: new Date(`${year}-01-01T00:00:00Z`),
        lte: new Date(`${year}-12-31T23:59:59Z`),
      },
    },
  });
}

export async function listRequests(options: { upn?: string; year: number; mine: boolean }) {
  const employee = options.upn
    ? await prisma.employee.findUnique({ where: { upn: options.upn } })
    : null;

  return prisma.timeOffRequest.findMany({
    where: {
      employeeId: options.mine ? employee?.id : undefined,
    },
    include: {
      requestWeeks: true,
    },
  });
}

export async function createDraftRequest(payload: z.infer<typeof createRequestSchema>, employeeUpn: string) {
  const employee = await prisma.employee.findUniqueOrThrow({ where: { upn: employeeUpn } });
  const startDate = new Date(payload.start_date);
  const endDate = new Date(payload.end_date);

  if (startDate > endDate) {
    throw new Error("INVALID_INTERVAL");
  }

  const holidays = await listHolidays(startDate.getUTCFullYear());
  const weeks = await listWeeks(startDate.getUTCFullYear());

  const created = await prisma.timeOffRequest.create({
    data: {
      employeeId: employee.id,
      type: payload.type,
      start_date: startDate,
      end_date: endDate,
      partial_day: payload.partial_day ?? null,
      status: "draft",
    },
  });

  const relevantWeeks = weeks.filter((week) => {
    const bounds = weekBoundsFromMonday(week.monday_date);
    return bounds.end >= startDate && bounds.start <= endDate;
  });

  for (const week of relevantWeeks) {
    const bounds = weekBoundsFromMonday(week.monday_date);
    const days = computeDaysInWeek(startDate, endDate, {
      weekId: week.id,
      start: bounds.start,
      end: bounds.end,
    }, holidays.map((holiday) => ({ date: holiday.date })));

    await prisma.requestWeek.create({
      data: {
        requestId: created.id,
        weekId: week.id,
        days_in_week: days,
      },
    });
  }

  return prisma.timeOffRequest.findUnique({
    where: { id: created.id },
    include: { requestWeeks: true },
  });
}

export function computeDurationInDays(start: Date, end: Date) {
  return differenceInCalendarDays(end, start) + 1;
}

export async function submitRequest(id: string) {
  return prisma.timeOffRequest.update({
    where: { id },
    data: {
      status: "submitted",
      submitted_at: new Date(),
    },
  });
}
