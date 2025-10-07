import { Avatar, Button, Link, Subtitle2, Title3, makeStyles, shorthands } from "@fluentui/react-components";
import { CalendarAgenda20Regular } from "@fluentui/react-icons";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../state/useCurrentUser";

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: "24px",
  },
  sidebar: {
    backgroundColor: "var(--colorNeutralBackground2)",
    ...shorthands.padding("24px"),
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minHeight: "80vh",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
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

export const MainLayout: React.FC = () => {
  const styles = useStyles();
  const { data: profile } = useCurrentUser();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Avatar name={profile?.full_name ?? "Utilisateur"} color="colorful" />
          <Title3>{profile?.full_name ?? "Compte"}</Title3>
          <Subtitle2>{profile?.team}</Subtitle2>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <NavLink className={styles.link} to="/">
            <CalendarAgenda20Regular /> Accueil
          </NavLink>
          <NavLink className={styles.link} to="/planification">
            <CalendarAgenda20Regular /> Faire mes choix
          </NavLink>
        </nav>
        <Button appearance="secondary" as={Link} href="/admin" target="_self">
          Console d'administration
        </Button>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
