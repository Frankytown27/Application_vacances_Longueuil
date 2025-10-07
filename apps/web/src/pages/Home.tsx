import { Card, CardHeader, Spinner, Text } from "@fluentui/react-components";
import React from "react";
import { DataTable } from "../components/data/DataTable";
import { useCurrentUser } from "../state/useCurrentUser";
import { useMyRequests } from "../state/useRequests";
import { formatDate } from "../utils/date";

const CURRENT_YEAR = 2025;

const Home: React.FC = () => {
  const { data: profile, isLoading: loadingProfile } = useCurrentUser();
  const { data: requests, isLoading: loadingRequests } = useMyRequests(CURRENT_YEAR);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Card>
        <CardHeader header={<Text weight="semibold">Mes soldes</Text>} description="Vacances et congés" />
        {loadingProfile ? (
          <Spinner label="Chargement" />
        ) : (
          <div style={{ display: "flex", gap: "24px", padding: "16px" }}>
            {profile?.entitlements.map((entitlement) => (
              <div key={entitlement.year}>
                <Text>Année {entitlement.year}</Text>
                <ul>
                  <li>Vacances: {entitlement.vacation_days_remaining} jours</li>
                  <li>Temps accumulé: {entitlement.ta_hours_remaining} h</li>
                  <li>Jours personnels: {entitlement.personal_days_remaining}</li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader header={<Text weight="semibold">Mes demandes</Text>} />
        {loadingRequests ? (
          <Spinner label="Chargement" />
        ) : (
          <DataTable
            items={requests ?? []}
            columns={[
              { key: "type", name: "Type", render: (item) => item.type },
              { key: "start", name: "Début", render: (item) => formatDate(item.start_date) },
              { key: "end", name: "Fin", render: (item) => formatDate(item.end_date) },
              { key: "status", name: "Statut", render: (item) => item.status },
            ]}
            emptyState={<Text>Aucune demande pour le moment.</Text>}
          />
        )}
      </Card>
    </div>
  );
};

export default Home;
