import { addDays, eachDayOfInterval, isWithinInterval } from "date-fns";

interface WeekInterval {
  weekId: string;
  start: Date;
  end: Date;
}

interface Holiday {
  date: Date;
}

export function computeDaysInWeek(
  requestStart: Date,
  requestEnd: Date,
  week: WeekInterval,
  holidays: Holiday[] = [],
): number {
  const interval = {
    start: requestStart,
    end: requestEnd,
  } as const;

  if (!isWithinInterval(week.start, interval) && !isWithinInterval(week.end, interval)) {
    if (week.start > interval.end || week.end < interval.start) {
      return 0;
    }
  }

  const days = eachDayOfInterval({
    start: week.start,
    end: week.end,
  }).filter((day) => day >= requestStart && day <= requestEnd);

  const workingDays = days.filter((day) => {
    const isHoliday = holidays.some((holiday) => holiday.date.toDateString() === day.toDateString());
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    return !isHoliday && !isWeekend;
  });

  return workingDays.length;
}

export function weekBoundsFromMonday(monday: Date): { start: Date; end: Date } {
  return {
    start: monday,
    end: addDays(monday, 4),
  };
}
