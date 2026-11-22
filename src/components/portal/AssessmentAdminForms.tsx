"use client";

import { useActionState } from "react";
import { createDraft, publishAssessment } from "@/app/(portal)/administracion/actions";

const initialState = { ok: false, message: "" };

export function DraftForm({ sources }: { sources: { id: string; title: string }[] }) {
  const [feedback, action, pending] = useActionState(createDraft, initialState);
  return (
    <details className="mb-6 rounded-xl border border-borde bg-superficie p-4">
      <summary className="cursor-pointer font-semibold">Nueva prueba</summary>
      {sources.length === 0 ? (
        <p className="mt-4 text-sm text-gris-texto">Para crear un borrador necesitas una prueba base con preguntas.</p>
      ) : (
        <form action={action} className="mt-4">
          <p className="mb-4 text-sm text-gris-texto">El borrador conserva las preguntas, secciones y claves de la prueba base.</p>
          <div className="campo">
            <label htmlFor="draft-source">Prueba base</label>
            <select name="source" id="draft-source" defaultValue="" required className="entrada">
              <option value="">Selecciona una prueba</option>
              {sources.map(({ id, title }) => <option value={id} key={id}>{title}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="draft-title">Nombre</label>
            <input className="entrada" name="title" id="draft-title" maxLength={200} required />
          </div>
          <div className="campo">
            <label htmlFor="draft-duration">Duraci?n en minutos</label>
            <input className="entrada" name="duration" id="draft-duration" type="number" min={1} max={480} required />
          </div>
          <div className="campo">
            <label htmlFor="draft-description">Descripci?n (opcional)</label>
            <textarea className="entrada" name="description" id="draft-description" maxLength={2000} rows={3} />
          </div>
          <button className="btn btn--sm" disabled={pending}>{pending ? "Guardando..." : "Crear borrador"}</button>
          {feedback.message && <p role={feedback.ok ? "status" : "alert"} className="mt-3 text-sm">{feedback.message}</p>}
        </form>
      )}
    </details>
  );
}

export function PublishForm({ assessmentId }: { assessmentId: string }) {
  const [feedback, action, pending] = useActionState(publishAssessment, initialState);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={assessmentId} />
      <button className="btn btn--sm btn--linea" disabled={pending}>{pending ? "Validando..." : "Validar y publicar"}</button>
      {feedback.message && <p role={feedback.ok ? "status" : "alert"} className="mt-2 text-sm">{feedback.message}</p>}
    </form>
  );
}
