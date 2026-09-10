"use client";

import { FormEvent, useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: data.get("password") }),
    });
    if (response.ok) window.location.reload();
    else {
      setError("Mot de passe incorrect.");
      setLoading(false);
    }
  }

  return <form className="admin-login" onSubmit={submit}>
    <label htmlFor="admin-password">Mot de passe</label>
    <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
    {error && <p role="alert">{error}</p>}
    <button type="submit" disabled={loading}>{loading ? "CONNEXION…" : "SE CONNECTER"}</button>
  </form>;
}
