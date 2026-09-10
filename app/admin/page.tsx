import AdminPanel from "./admin-panel";
import AdminLogin from "./login-form";
import { isAdmin } from "./auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authorized = await isAdmin();

  return <main className="admin-page">
    <header className="admin-topbar"><img src="/inner-logo.png" alt="INNER" className="wordmark" />{authorized && <form action="/api/admin/logout" method="post"><button type="submit">SE DÉCONNECTER</button></form>}</header>
    <section className="admin-content">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>{authorized ? "Places réservées" : "Connexion"}</h1>
      {authorized ? <><p className="admin-intro">Bloque ou libère des places pour chaque cours. Le nombre disponible sur le site public est mis à jour automatiquement.</p><AdminPanel /></> : <AdminLogin />}
    </section>
  </main>;
}
