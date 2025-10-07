import { makeStyles, shorthands } from "@fluentui/react-components";
import { Navigation24Regular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { supabase } from "./lib/supabase";
import Home from "./pages/Home";
import RequestPlanner from "./pages/RequestPlanner";
import Login from "./pages/Login";
import AdminPlanning from "./pages/Admin/Planning";
import AdminRounds from "./pages/Admin/Rounds";
import AdminSettings from "./pages/Admin/Settings";
import ImportWizard from "./pages/Admin/ImportWizard";

const useStyles = makeStyles({
  app: {
    minHeight: "100vh",
    backgroundColor: "var(--colorNeutralBackground1)",
    color: "var(--colorNeutralForeground1)",
    ...shorthands.padding("16px"),
  },
});

const App: React.FC = () => {
  const styles = useStyles();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className={styles.app}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/planification" element={<RequestPlanner />} />
        </Route>
        <Route path="/admin" element={<AdminLayout icon={<Navigation24Regular />} title="Administration" />}>
          <Route index element={<Navigate to="planning" replace />} />
          <Route path="planning" element={<AdminPlanning />} />
          <Route path="rondes" element={<AdminRounds />} />
          <Route path="parametres" element={<AdminSettings />} />
          <Route path="import" element={<ImportWizard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
