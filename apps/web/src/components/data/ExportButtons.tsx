import { Button, ButtonGroup } from "@fluentui/react-components";
import { ArrowDownload20Regular } from "@fluentui/react-icons";
import React from "react";

interface ExportButtonsProps {
  onExportCsv: () => void;
  onExportPdf: () => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportCsv, onExportPdf }) => (
  <ButtonGroup>
    <Button icon={<ArrowDownload20Regular />} onClick={onExportCsv} appearance="primary">
      Export CSV
    </Button>
    <Button icon={<ArrowDownload20Regular />} onClick={onExportPdf} appearance="secondary">
      Export PDF
    </Button>
  </ButtonGroup>
);
