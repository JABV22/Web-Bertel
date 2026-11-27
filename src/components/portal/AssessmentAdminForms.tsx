"use client";

import { useActionState, useState } from "react";
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

export type PublicationRecipient = { id: string; name: string | null; email: string | null; roles: string[] };

export function PublishForm({ assessmentId, recipients }: { assessmentId: string; recipients: PublicationRecipient[] }) {
  const [feedback, action, pending] = useActionState(publishAssessment, initialState);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const query = search.trim().toLocaleLowerCase("es");
  const groups = [
    { role: "estudiante", field: "students", label: "Estudiantes que podrán presentar la prueba" },
    { role: "profesor", field: "teachers", label: "Profesores que podrán revisar la prueba" },
  ];
  const count = Object.values(selected).filter(Boolean).length;

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="id" value={assessmentId} />
      <div className="campo">
        <label htmlFor="publication-search">Buscar por nombre o correo</label>
        <input id="publication-search" type="search" className="entrada" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {groups.map(({ role, field, label }) => {
          const people = recipients.filter((person) => person.roles.includes(role));
          const matches = (person: PublicationRecipient) => [person.name, person.email]
            .some((value) => value?.toLocaleLowerCase("es").includes(query));
          return (
            <fieldset key={role} className="rounded-xl border border-borde p-4" disabled={pending || feedback.ok}>
              <legend className="px-2 font-semibold">{label}</legend>
              {people.length === 0 ? <p>No hay cuentas activas para este rol.</p>
                : !people.some(matches) && <p>No hay coincidencias.</p>}
              <div className="max-h-72 overflow-y-auto">
                {people.map((person) => {
                  const key = role + ":" + person.id;
                  return <label key={key} hidden={Boolean(query) && !matches(person)}>
                    <span className="flex items-start gap-2 px-2 py-2">
                      <input type="checkbox" name={field} value={person.id} checked={Boolean(selected[key])}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setSelected((previous) => ({ ...previous, [key]: checked }));
                        }} />
                      <span className="break-all">{person.name || person.email || "Usuario sin nombre"}
                        {person.name && person.email && <span className="block text-sm text-gris-texto">{person.email}</span>}
                      </span>
                    </span>
                  </label>;
                })}
              </div>
            </fieldset>
          );
        })}
      </div>
      <p className="text-sm" aria-live="polite">Accesos seleccionados: {count}</p>
      <div><button className="btn btn--sm" disabled={pending || feedback.ok || count === 0}>
        {pending ? "Validando..." : "Validar y publicar"}
      </button></div>
      {feedback.message && <p role={feedback.ok ? "status" : "alert"}>{feedback.message}</p>}
    </form>
  );
}
