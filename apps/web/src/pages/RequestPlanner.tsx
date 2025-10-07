import { Button, Card, CardHeader, Spinner, Text } from "@fluentui/react-components";
import React, { useMemo, useState } from "react";
import { CalendarWeekGrid } from "../components/calendar/CalendarWeekGrid";
import { RequestFormDrawer } from "../components/calendar/RequestFormDrawer";
import { useCreateRequest } from "../state/useRequests";
import { useWeeks } from "../state/useWeeks";

const CURRENT_YEAR = 2025;

const RequestPlanner: React.FC = () => {
  const { data: weeks, isLoading: loadingWeeks } = useWeeks(CURRENT_YEAR);
  const [selectedWeekIds, setSelectedWeekIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const createRequest = useCreateRequest(CURRENT_YEAR);

  const conflicts = useMemo(() => {
    if (!weeks) return [] as string[];
    const selectedWeeks = weeks.filter((week) => selectedWeekIds.has(week.id));
    return selectedWeeks.filter((week) => week.is_holiday_week).map((week) => week.id);
  }, [weeks, selectedWeekIds]);

  if (loadingWeeks) {
    return <Spinner label="Chargement du calendrier" />;
  }

  const handleToggleWeek = (weekId: string) => {
    setSelectedWeekIds((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Card>
        <CardHeader header={<Text weight="semibold">Planifier mes congés</Text>} />
        <div style={{ padding: "16px" }}>
          {weeks && (
            <CalendarWeekGrid
              weeks={weeks}
              selectedWeekIds={selectedWeekIds}
              onToggle={(week) => handleToggleWeek(week.id)}
              conflicts={conflicts}
            />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", padding: "16px" }}>
          <Button appearance="secondary" onClick={() => setOpen(true)}>
            Créer une demande détaillée
          </Button>
          <Button appearance="primary" disabled={!selectedWeekIds.size}>
            Soumettre la sélection ({selectedWeekIds.size} semaines)
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader header={<Text weight="semibold">Brouillons</Text>} />
        <Text style={{ padding: "16px" }}>Vos brouillons et demandes soumises apparaîtront ici.</Text>
      </Card>

      <RequestFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(payload) => {
          createRequest.mutate(payload, {
            onSuccess: () => setOpen(false),
          });
        }}
      />
    </div>
  );
};

export default RequestPlanner;
