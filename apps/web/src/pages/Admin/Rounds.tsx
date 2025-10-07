import { Button, Card, CardHeader, TableCellLayout, Text } from "@fluentui/react-components";
import { DismissCircle24Regular } from "@fluentui/react-icons";
import React, { useMemo, useState } from "react";
import { DataTable } from "../../components/data/DataTable";
import { useCurrentUser } from "../../state/useCurrentUser";
import { formatDate } from "../../utils/date";

interface RoundItem {
  round: number;
  opens_at: string;
  closes_at: string;
  allowed_weeks: number;
}

const sampleRounds: RoundItem[] = [
  { round: 1, opens_at: "2024-11-04", closes_at: "2024-11-15", allowed_weeks: 2 },
  { round: 2, opens_at: "2024-11-25", closes_at: "2024-12-06", allowed_weeks: 2 },
  { round: 3, opens_at: "2025-01-06", closes_at: "2025-01-17", allowed_weeks: 3 },
];

const AdminRounds: React.FC = () => {
  const { data: profile } = useCurrentUser();
  const [order, setOrder] = useState<string[]>([]);

  const slots = useMemo(() => {
    const employees = profile ? [profile.full_name] : ["André Lavoie", "Bianca Morin", "Charles Gagnon"];
    return employees
      .map((name, index) => ({ name, order: index + 1 }))
      .sort((a, b) => a.order - b.order);
  }, [profile]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Card>
        <CardHeader header={<Text weight="semibold">Configuration des rondes</Text>} />
        <DataTable
          items={sampleRounds}
          columns={[
            { key: "round", name: "Ronde", render: (item) => item.round },
            { key: "opens", name: "Ouverture", render: (item) => formatDate(item.opens_at) },
            { key: "closes", name: "Fermeture", render: (item) => formatDate(item.closes_at) },
            { key: "quota", name: "Semaines permises", render: (item) => item.allowed_weeks },
          ]}
        />
        <Button style={{ marginTop: "12px" }} appearance="primary">
          Ajouter une ronde
        </Button>
      </Card>

      <Card>
        <CardHeader header={<Text weight="semibold">Ordre d'ancienneté</Text>} />
        <DataTable
          items={slots}
          columns={[
            {
              key: "order",
              name: "Ordre",
              render: (item) => <TableCellLayout media={<Text weight="semibold">{item.order}</Text>}>{item.name}</TableCellLayout>,
            },
          ]}
          emptyState={<Text>Aucun employé</Text>}
        />
        <Button icon={<DismissCircle24Regular />} appearance="secondary" style={{ marginTop: "12px" }}>
          Réinitialiser l'ordre
        </Button>
      </Card>
    </div>
  );
};

export default AdminRounds;
