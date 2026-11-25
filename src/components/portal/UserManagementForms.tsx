"use client";

import { useActionState } from "react";
import { registerUser, updateUserAccess } from "@/app/(portal)/administracion/usuarios/actions";

const initial = { ok: false, message: "" };
const roleNames = { estudiante: "Estudiante", profesor: "Profesor", admin: "Administrador" };

export type UserAccess = {
  courses: { id: string; name: string; status: string | null; enabled: boolean; teaches: boolean }[];
  assessments: { id: string; title: string; status: string; enabled: boolean; reviewEnabled: boolean }[];
};

function RoleOptions() {
  return Object.entries(roleNames).map(([value, label]) => <option value={value} key={value}>{label}</option>);
}

function Feedback({ state }: { state: typeof initial }) {
  return state.message ? <p className={`mt-3 text-sm ${state.ok ? "text-exito" : "text-error"}`} role={state.ok ? "status" : "alert"}>{state.message}</p> : null;
}

export function UserRegistrationForm() {
  const [state, action, pending] = useActionState(registerUser, initial);
  return (
    <details className="mb-6 rounded-xl border border-borde bg-superficie p-4">
      <summary className="cursor-pointer font-semibold">Registrar usuario</summary>
      <form className="mt-4" action={action}>
        <div className="campo">
          <label htmlFor="new-email">Correo electrónico</label>
          <input className="entrada" type="email" id="new-email" name="email" maxLength={254} required />
        </div>
        <div className="campo">
          <label htmlFor="new-document">Cédula</label>
          <input className="entrada" id="new-document" name="document" inputMode="numeric" pattern="[0-9]{4,20}" maxLength={20} required />
        </div>
        <div className="campo">
          <label htmlFor="new-role">Rol</label>
          <select className="entrada" id="new-role" name="role" defaultValue="estudiante"><RoleOptions /></select>
        </div>
        <button type="submit" className="btn" disabled={pending}>{pending ? "Registrando…" : "Registrar y enviar invitación"}</button>
        <Feedback state={state} />
      </form>
    </details>
  );
}

export function UserManagementForms({ userId, roles, canChangeRole, access }: {
  userId: string;
  roles: string[];
  canChangeRole: boolean;
  access: UserAccess;
}) {
  const [roleState, roleAction, rolePending] = useActionState(updateUserAccess, initial);
  const [courseState, courseAction, coursePending] = useActionState(updateUserAccess, initial);
  const [testState, testAction, testPending] = useActionState(updateUserAccess, initial);
  const student = roles.includes("estudiante");
  const teacher = roles.includes("profesor");

  return (
    <div className="mt-5 grid gap-5">
      {canChangeRole && (
        <form className="rounded-lg border border-borde p-4" action={roleAction}>
          <input type="hidden" name="user" value={userId} />
          <div className="campo">
            <label htmlFor="assigned-role">Rol</label>
            <select className="entrada" id="assigned-role" name="role" defaultValue={roles.length === 1 ? roles[0] : ""} required>
              <option value="">Selecciona un rol</option><RoleOptions />
            </select>
          </div>
          <button className="btn btn--sm" name="action" value="role" disabled={rolePending}>Guardar rol</button>
          <Feedback state={roleState} />
        </form>
      )}
      {(student || teacher) && (
        <form className="rounded-lg border border-borde p-4" action={courseAction}>
          <input type="hidden" name="user" value={userId} />
          <div className="campo">
            <label htmlFor="assigned-course">Curso</label>
            <select className="entrada" id="assigned-course" name="resource" defaultValue="" required>
              <option value="">Selecciona un curso</option>
              {access.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} · {student ? (course.status ? `${course.status}, ${course.enabled ? "habilitado" : "deshabilitado"}` : "sin matrícula") : ""}
                  {teacher && (course.teaches ? " · docente asignado" : " · docente sin asignar")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {student && <>
              <button className="btn btn--sm" name="action" value="course_enroll" disabled={coursePending}>Matricular</button>
              <button className="btn btn--sm btn--linea" name="action" value="course_enable" disabled={coursePending}>Habilitar acceso</button>
              <button className="btn btn--sm btn--linea" name="action" value="course_disable" disabled={coursePending}>Deshabilitar acceso</button>
            </>}
            {teacher && <>
              <button className="btn btn--sm" name="action" value="course_assign_teacher" disabled={coursePending}>Asignar como docente</button>
              <button className="btn btn--sm btn--linea" name="action" value="course_remove_teacher" disabled={coursePending}>Retirar asignación docente</button>
            </>}
          </div>
          <Feedback state={courseState} />
        </form>
      )}
      <form className="rounded-lg border border-borde p-4" action={testAction}>
        <input type="hidden" name="user" value={userId} />
        <div className="campo">
          <label htmlFor="assigned-assessment">Simulacro</label>
          <select className="entrada" id="assigned-assessment" name="resource" defaultValue="" required>
            <option value="">Selecciona un simulacro</option>
            {access.assessments.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title} · {(teacher && !student ? test.reviewEnabled : test.enabled) ? "habilitado" : "deshabilitado"}
                {test.status !== "published" && " · sin publicar"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn--sm" name="action" value="assessment_enable" disabled={testPending}>Habilitar simulacro</button>
          <button className="btn btn--sm btn--linea" name="action" value="assessment_disable" disabled={testPending}>Deshabilitar simulacro</button>
        </div>
        <Feedback state={testState} />
      </form>
    </div>
  );
}
