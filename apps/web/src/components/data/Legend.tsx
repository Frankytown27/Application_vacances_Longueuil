import { Stack, Text } from "@fluentui/react-components";
import React from "react";

interface LegendItem {
  color: string;
  label: string;
}

interface LegendProps {
  items: LegendItem[];
}

export const Legend: React.FC<LegendProps> = ({ items }) => {
  return (
    <Stack horizontal tokens={{ childrenGap: 12 }}>
      {items.map((item) => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }} key={item.label}>
          <span
            style={{
              width: 16,
              height: 16,
              backgroundColor: item.color,
              borderRadius: 4,
              display: "inline-block",
            }}
          />
          <Text size={200}>{item.label}</Text>
        </Stack>
      ))}
    </Stack>
  );
};
