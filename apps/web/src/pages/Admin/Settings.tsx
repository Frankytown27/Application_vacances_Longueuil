import { Button, Card, CardHeader, Field, Textarea, Text } from "@fluentui/react-components";
import React, { useState } from "react";
import config2025 from "../../config/2025.json";

const AdminSettings: React.FC = () => {
  const [minima, setMinima] = useState(JSON.stringify(config2025.min_staff_by_team_and_week, null, 2));
  const [blackout, setBlackout] = useState(JSON.stringify(config2025.blackout_weeks, null, 2));

  return (
    <Card>
      <CardHeader header={<Text weight="semibold">Paramètres annuels</Text>} />
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px" }}>
        <Field label="Minima d'effectifs par équipe/semaine">
          <Textarea rows={6} value={minima} onChange={(_, data) => setMinima(data.value)} />
        </Field>
        <Field label="Semaines de blackout">
          <Textarea rows={4} value={blackout} onChange={(_, data) => setBlackout(data.value)} />
        </Field>
        <Button appearance="primary">Enregistrer</Button>
      </div>
    </Card>
  );
};

export default AdminSettings;
