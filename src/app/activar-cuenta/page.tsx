import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ActivationForm } from "./ActivationForm";

export const metadata = { title: "Activar cuenta", robots: { index: false, follow: false } };

export default async function ActivationPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-6">Activar cuenta</h1>
      {user && !error ? <ActivationForm /> : (
        <>
          <p>{"La invitaci\u00f3n no est\u00e1 disponible. Abre el enlace recibido por correo o contacta al administrador."}</p>
          <Link className="btn mt-5" href="/ingreso">Volver al ingreso</Link>
        </>
      )}
    </main>
  );
}
