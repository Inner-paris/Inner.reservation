"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

type Session = { id: string; label: string; booked: number; held: number; remaining: number };

export default function AdminPanel() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/holds").then((response) => response.json()).then((data) => setSessions(data.sessions ?? [])).catch(() => toast.error("Impossible de charger les cours."));
  }, []);

  async function save(sessionId: string, held: number) {
    setSaving(sessionId);
    try {
      const response = await fetch("/api/admin/holds", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, held }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Modification impossible.");
      setSessions(data.sessions);
      toast.success("Places bloquées mises à jour.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Modification impossible."); }
    finally { setSaving(null); }
  }

  return <div className="admin-list">
    <Toaster position="top-center" richColors />
    {sessions.length === 0 && <p className="admin-loading">Chargement des cours…</p>}
    {sessions.map((session) => <article className="admin-session" key={session.id}>
      <div><h2>{session.label}</h2><p>{session.booked} réservée{session.booked > 1 ? "s" : ""} · {session.remaining} disponible{session.remaining > 1 ? "s" : ""}</p></div>
      <div className="hold-control" aria-label={`Places bloquées pour ${session.label}`}>
        <Button variant="outline" aria-label="Libérer une place" disabled={saving === session.id || session.held === 0} onClick={() => save(session.id, session.held - 1)}>−</Button>
        <div><strong>{session.held}</strong><span>bloquée{session.held > 1 ? "s" : ""}</span></div>
        <Button variant="outline" aria-label="Bloquer une place" disabled={saving === session.id || session.remaining === 0} onClick={() => save(session.id, session.held + 1)}>+</Button>
      </div>
    </article>)}
  </div>;
}
