import { Tooltip } from "@fluentui/react-components";
import React from "react";

interface HeatmapCell {
  weekId: string;
  team: string;
  planned: number;
  threshold: number;
}

interface HeatmapProps {
  cells: HeatmapCell[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ cells }) => {
  const teams = Array.from(new Set(cells.map((cell) => cell.team)));
  const weeks = Array.from(new Set(cells.map((cell) => cell.weekId)));
  const getColor = (planned: number, threshold: number) => {
    if (planned >= threshold) return "var(--colorPaletteLightGreenBackground2)";
    if (planned >= threshold - 1) return "var(--colorPaletteYellowBackground2)";
    return "var(--colorPaletteRedBackground2)";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Équipe</th>
            {weeks.map((weekId) => (
              <th key={weekId} style={{ textAlign: "center", padding: "8px" }}>
                {weekId}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team}>
              <td style={{ padding: "8px", fontWeight: 600 }}>{team}</td>
              {weeks.map((weekId) => {
                const cell = cells.find((c) => c.team === team && c.weekId === weekId);
                if (!cell) {
                  return <td key={`${team}-${weekId}`} style={{ padding: "8px" }}>-</td>;
                }
                const color = getColor(cell.planned, cell.threshold);
                return (
                  <td key={`${team}-${weekId}`} style={{ padding: "8px" }}>
                    <Tooltip content={`Planifiés: ${cell.planned} / Seuil: ${cell.threshold}`} relationship="description">
                      <div
                        style={{
                          backgroundColor: color,
                          borderRadius: "8px",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {cell.planned}
                      </div>
                    </Tooltip>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
