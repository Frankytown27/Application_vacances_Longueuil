import { format, parseISO } from "date-fns";
import { frCA } from "date-fns/locale";

export function formatWeek(date: string) {
  const monday = parseISO(date);
  return `Semaine du ${format(monday, "d MMMM", { locale: frCA })}`;
}

export function formatDate(date: string) {
  return format(parseISO(date), "d MMMM yyyy", { locale: frCA });
}
