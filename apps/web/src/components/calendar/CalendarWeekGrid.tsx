import { Card, CardHeader, Text, makeStyles } from "@fluentui/react-components";
import React from "react";
import type { Week } from "../../types/models";
import { formatWeek } from "../../utils/date";

const useStyles = makeStyles({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
  },
  weekCard: {
    cursor: "pointer",
  },
});

interface CalendarWeekGridProps {
  weeks: Week[];
  selectedWeekIds: Set<string>;
  onToggle: (week: Week) => void;
  conflicts?: string[];
}

export const CalendarWeekGrid: React.FC<CalendarWeekGridProps> = ({ weeks, selectedWeekIds, onToggle, conflicts = [] }) => {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {weeks.map((week) => {
        const selected = selectedWeekIds.has(week.id);
        const hasConflict = conflicts.includes(week.id);
        return (
          <Card
            key={week.id}
            className={styles.weekCard}
            appearance={selected ? "filled" : "outline"}
            onClick={() => onToggle(week)}
          >
            <CardHeader
              header={<Text weight="semibold">{formatWeek(week.monday_date)}</Text>}
              description={hasConflict ? <Text role="alert">Conflit potentiel</Text> : undefined}
            />
          </Card>
        );
      })}
    </div>
  );
};
