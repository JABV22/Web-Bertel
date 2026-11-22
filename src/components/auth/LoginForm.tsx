"use client";

import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { error: authError } = await createClient().auth.signInWithPassword(
        {
          email: email.trim(),
          password,
        },
      );
      if (authError) {
        setError("El correo o la contraseña no son correctos.");
        setIsSubmitting(false);
        return;
      }
      window.location.replace(window.location.href);
    } catch {
      setError("No fue posible conectar con el servicio de acceso.");
      setIsSubmitting(false);
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <div className="campo">
        <label
          htmlFor="correo"
        >
          Correo electrónico
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="entrada"
        />
      </div>

      <div className="campo">
        <label
          htmlFor="clave"
        >
          Contraseña
        </label>
        <input
          id="clave"
          name="clave"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="entrada"
        />
      </div>

      {error && (
        <p
          className="mb-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn w-full"
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>

      <p className="ayuda mt-5 text-center">
        ¿Problemas para entrar? Contacta a tu coordinador académico.
      </p>
    </form>
  );
}
