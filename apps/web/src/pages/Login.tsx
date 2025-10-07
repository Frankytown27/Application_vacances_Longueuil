import { Button, Card, CardHeader, Field, Input, Text } from "@fluentui/react-components";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card style={{ maxWidth: "400px", width: "100%" }}>
        <CardHeader
          header={<Text weight="semibold" size={500}>Connexion</Text>}
          description="Application Vacances Longueuil"
        />
        <form onSubmit={handleLogin} style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && (
            <Text style={{ color: "var(--colorPaletteRedForeground1)" }}>{error}</Text>
          )}
          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(_, data) => setEmail(data.value)}
              placeholder="votre.email@longueuil.ca"
            />
          </Field>
          <Field label="Mot de passe" required>
            <Input
              type="password"
              value={password}
              onChange={(_, data) => setPassword(data.value)}
              placeholder="••••••••"
            />
          </Field>
          <Button appearance="primary" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
