import { Button, Card, CardHeader, ProgressBar, Steps, Step, Text } from "@fluentui/react-components";
import React, { useState } from "react";
import { DataTable } from "../../components/data/DataTable";

const ImportWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(
    Array.from({ length: 3 }, (_, index) => ({
      employee: ["André Lavoie", "Bianca Morin", "Charles Gagnon"][index],
      week: "2025-06-23",
      type: ["VAC", "TA", "VAC"][index],
      days: [5, 2.5, 3][index],
    })),
  );

  const handleNext = () => setStep((current) => Math.min(current + 1, 2));
  const handlePrev = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <Card>
      <CardHeader header={<Text weight="semibold">Assistant d'import CSV</Text>} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <Steps current={step}>
          <Step title="Téléverser" />
          <Step title="Mapper" />
          <Step title="Prévisualiser" />
        </Steps>
        <ProgressBar max={2} value={step} />
        {step === 0 && (
          <div>
            <Text>Glissez-déposez un fichier CSV exporté d'Excel.</Text>
            <Button appearance="primary" style={{ marginTop: "12px" }} onClick={handleNext}>
              Continuer
            </Button>
          </div>
        )}
        {step === 1 && (
          <div>
            <Text>Associez les colonnes à importer (Nom, UPN, semaines...).</Text>
            <Button appearance="primary" style={{ marginTop: "12px" }} onClick={handleNext}>
              Prévisualiser
            </Button>
          </div>
        )}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Text>Prévisualisation des demandes détectées :</Text>
            <DataTable
              items={preview}
              columns={[
                { key: "employee", name: "Employé", render: (item) => item.employee },
                { key: "week", name: "Semaine", render: (item) => item.week },
                { key: "type", name: "Type", render: (item) => item.type },
                { key: "days", name: "Jours", render: (item) => item.days },
              ]}
            />
            <Button appearance="primary">Importer</Button>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button appearance="secondary" onClick={handlePrev} disabled={step === 0}>
            Retour
          </Button>
          <Button appearance="secondary" onClick={() => setStep(0)}>
            Réinitialiser
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImportWizard;
