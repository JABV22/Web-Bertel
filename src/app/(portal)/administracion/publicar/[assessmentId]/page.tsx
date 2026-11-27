import Link from "next/link";
import { notFound } from "next/navigation";
import { PublishForm, type PublicationRecipient } from "@/components/portal/AssessmentAdminForms";
import { requireRole } from "@/services/auth";

export const metadata = { title: "Configurar publicación" };

export default async function PublicationPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { supabase } = await requireRole(["admin"]);
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(assessmentId)) notFound();
  const [assessment, directory] = await Promise.all([
    supabase.from("assessments").select("id, title, status").eq("id", assessmentId).maybeSingle(),
    supabase.rpc("bertel_publication_recipients"),
  ]);
  if (assessment.error) throw new Error("No fue posible consultar la prueba.");
  if (!assessment.data) notFound();

  return (
    <main id="principal" className="contenido">
      <Link href="/administracion" className="font-semibold text-bertel-azul">Volver a Administración</Link>
      <h1 className="my-4">Publicar {assessment.data.title}</h1>
      {assessment.data.status !== "draft" ? <p>Esta prueba ya no está en borrador.</p>
        : directory.error ? <p role="alert">No se pudo cargar la lista de destinatarios. Verifica que la migración de publicación esté aplicada.</p>
        : <PublishForm assessmentId={assessmentId} recipients={(directory.data ?? []) as PublicationRecipient[]} />}
    </main>
  );
}

