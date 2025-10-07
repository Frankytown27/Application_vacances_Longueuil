import { ProgressBar, Text } from "@fluentui/react-components";
import React from "react";

interface QuotaBarProps {
  label: string;
  value: number;
  max: number;
}

export const QuotaBar: React.FC<QuotaBarProps> = ({ label, value, max }) => {
  const percent = max === 0 ? 0 : Math.min(1, value / max);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <Text>{label}</Text>
      <ProgressBar value={percent} max={1} />
      <Text size={200} weight="semibold">
        {value} / {max}
      </Text>
    </div>
  );
};
