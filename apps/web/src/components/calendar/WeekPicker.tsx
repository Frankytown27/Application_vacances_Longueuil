import { Dropdown, Option } from "@fluentui/react-components";
import React from "react";
import type { Week } from "../../types/models";
import { formatWeek } from "../../utils/date";

interface WeekPickerProps {
  weeks: Week[];
  value?: string;
  onChange: (weekId: string) => void;
}

export const WeekPicker: React.FC<WeekPickerProps> = ({ weeks, value, onChange }) => {
  return (
    <Dropdown
      value={weeks.find((week) => week.id === value)?.monday_date ?? ""}
      selectedOptions={value ? [value] : []}
      onOptionSelect={(_, data) => {
        const selected = data.optionValue as string;
        onChange(selected);
      }}
    >
      {weeks.map((week) => (
        <Option key={week.id} value={week.id}>
          {formatWeek(week.monday_date)}
        </Option>
      ))}
    </Dropdown>
  );
};
