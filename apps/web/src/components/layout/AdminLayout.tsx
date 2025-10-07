import { Button, Title2, makeStyles, shorthands } from "@fluentui/react-components";
import type { ReactElement } from "react";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: "24px",
  },
  sidebar: {
    backgroundColor: "var(--colorNeutralBackground2)",
    ...shorthands.padding("24px"),
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  navLink: {
    textDecoration: "none",
    color: "inherit",
    paddingBlock: "8px",
    borderRadius: "8px",
    ...shorthands.padding("8px", "12px"),
    selectors: {
      "&.active": {
        backgroundColor: "var(--colorBrandBackground2)",
      },
    },
  },
});

interface AdminLayoutProps {
  title: string;
  icon?: ReactElement;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ title, icon }) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Title2>
          {icon} {title}
        </Title2>
        <NavLink className={styles.navLink} to="planning">
          Planning maître
        </NavLink>
        <NavLink className={styles.navLink} to="rondes">
          Rondes d'ancienneté
        </NavLink>
        <NavLink className={styles.navLink} to="parametres">
          Paramètres annuels
        </NavLink>
        <NavLink className={styles.navLink} to="import">
          Assistant d'import
        </NavLink>
        <Button as="a" href="/" appearance="secondary">
          Retour à l'accueil
        </Button>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
