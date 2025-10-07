import { Badge } from "@fluentui/react-components";
import React from "react";

interface ConflictBadgeProps {
  label: string;
  severity?: "low" | "medium" | "high";
}

export const ConflictBadge: React.FC<ConflictBadgeProps> = ({ label, severity = "medium" }) => {
  const appearance = severity === "high" ? "danger" : severity === "medium" ? "warning" : "outline";
  return <Badge appearance={appearance}>{label}</Badge>;
};
