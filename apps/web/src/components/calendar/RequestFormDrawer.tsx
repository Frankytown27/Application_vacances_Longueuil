import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  Radio,
  RadioGroup,
  Select,
  makeStyles,
} from "@fluentui/react-components";
import React, { useState } from "react";
import type { TimeOffType } from "../../types/models";

const useStyles = makeStyles({
  fields: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
});

interface RequestFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { type: TimeOffType; start_date: string; end_date: string; partial_day?: "AM" | "PM" | "FULL" }) => void;
}

export const RequestFormDrawer: React.FC<RequestFormDrawerProps> = ({ open, onClose, onSubmit }) => {
  const styles = useStyles();
  const [type, setType] = useState<TimeOffType>("VAC");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [partialDay, setPartialDay] = useState<"AM" | "PM" | "FULL" | undefined>(undefined);

  const handleSubmit = () => {
    if (!startDate || !endDate) return;
    onSubmit({ type, start_date: startDate, end_date: endDate, partial_day: partialDay });
  };

  return (
    <Drawer open={open} position="end" onOpenChange={(_, data) => (!data.open ? onClose() : undefined)}>
      <DrawerHeader>
        <DrawerHeaderTitle>Nouvelle demande</DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.fields}>
          <Field label="Type de congé">
            <Select value={type} onChange={(_, data) => setType(data.value as TimeOffType)}>
              <option value="VAC">Vacances</option>
              <option value="TA">Temps accumulé</option>
              <option value="PER">Personnel</option>
              <option value="CM">CM</option>
              <option value="OTHER">Autre</option>
            </Select>
          </Field>
          <Field label="Date de début">
            <Input type="date" value={startDate} onChange={(_, data) => setStartDate(data.value)} />
          </Field>
          <Field label="Date de fin">
            <Input type="date" value={endDate} onChange={(_, data) => setEndDate(data.value)} />
          </Field>
          <Field label="Fraction de journée (optionnel)">
            <RadioGroup value={partialDay} onChange={(_, data) => setPartialDay(data.value as typeof partialDay)}>
              <Radio value="FULL" label="Journée complète" />
              <Radio value="AM" label="Avant-midi" />
              <Radio value="PM" label="Après-midi" />
              <Radio value="" label="Aucune" />
            </RadioGroup>
          </Field>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <Button appearance="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button appearance="primary" onClick={handleSubmit}>
          Créer le brouillon
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};
