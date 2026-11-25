"use client";

import { useActionState } from "react";
import { activateAccount } from "./actions";

export function ActivationForm() {
  const [state, action, pending] = useActionState(activateAccount, { message: "" });
  return (
    <form action={action}>
      <div className="campo">
        <label htmlFor="password">{"Contrase\u00f1a nueva"}</label>
        <input className="entrada" name="password" id="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required />
      </div>
      <div className="campo">
        <label htmlFor="confirm">{"Confirmar contrase\u00f1a"}</label>
        <input className="entrada" name="confirm" id="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={72} required />
      </div>
      <button type="submit" className="btn" disabled={pending}>{pending ? "Guardando..." : "Activar mi cuenta"}</button>
      {state.message && <p className="mt-4 text-error" role="alert">{state.message}</p>}
    </form>
  );
}
