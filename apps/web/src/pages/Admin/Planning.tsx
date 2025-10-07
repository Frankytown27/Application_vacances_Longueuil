import { Card, CardHeader, Dropdown, Option, Spinner, Text } from "@fluentui/react-components";
import React, { useMemo, useState } from "react";
import { ConflictBadge } from "../../components/data/ConflictBadge";
import { ExportButtons } from "../../components/data/ExportButtons";
import { Heatmap } from "../../components/data/Heatmap";
import { Legend } from "../../components/data/Legend";
import { useWeeks } from "../../state/useWeeks";

const CURRENT_YEAR = 2025;

const AdminPlanning: React.FC = () => {
  const { data: weeks, isLoading } = useWeeks(CURRENT_YEAR);
  const [team, setTeam] = useState("Direction");

  const heatmapData = useMemo(() => {
    if (!weeks) return [];
    return weeks.map((week) => ({
      weekId: week.monday_date,
      team,
      planned: Math.floor(Math.random() * 5),
      threshold: team === "Direction" ? 2 : 3,
    }));
  }, [weeks, team]);

  if (isLoading) {
    return <Spinner label="Chargement du planning" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Card>
        <CardHeader
          header={<Text weight="semibold">Planning maître</Text>}
          description="Vue consolidée des absences par semaine et par équipe"
        />
        <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Dropdown value={team} onOptionSelect={(_, data) => setTeam(data.optionValue as string)}>
            <Option value="Direction">Direction</Option>
            <Option value="Projets majeurs">Projets majeurs</Option>
          </Dropdown>
          <ExportButtons onExportCsv={() => console.log("CSV")} onExportPdf={() => console.log("PDF")} />
        </div>
        <div style={{ padding: "0 16px 16px" }}>
          <Legend
            items={[
              { color: "var(--colorPaletteLightGreenBackground2)", label: "Seuil atteint" },
              { color: "var(--colorPaletteYellowBackground2)", label: "A surveiller" },
              { color: "var(--colorPaletteRedBackground2)", label: "Conflit" },
            ]}
          />
        </div>
        <div style={{ padding: "0 16px 16px" }}>
          <Heatmap cells={heatmapData} />
        </div>
      </Card>

      <Card>
        <CardHeader header={<Text weight="semibold">Conflits détectés</Text>} />
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <ConflictBadge label="Semaine du 24 juin — 1 personne sous le seuil" severity="high" />
          <ConflictBadge label="Semaine du 1er juillet — vérifier le blackout" severity="medium" />
        </div>
      </Card>
    </div>
  );
};

export default AdminPlanning;
