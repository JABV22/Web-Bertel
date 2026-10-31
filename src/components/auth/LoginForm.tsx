"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
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
        return;
      }

      router.replace("/panel");
      router.refresh();
    } catch {
      setError("No fue posible conectar con el servicio de acceso.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label
          htmlFor="correo"
          className="mb-2 block text-sm font-semibold text-texto-fuerte"
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
          className="w-full rounded-lg border border-borde-fuerte bg-superficie px-4 py-3 text-sm text-texto outline-none focus:border-bertel-oro"
        />
      </div>

      <div>
        <label
          htmlFor="clave"
          className="mb-2 block text-sm font-semibold text-texto-fuerte"
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
          className="w-full rounded-lg border border-borde-fuerte bg-superficie px-4 py-3 text-sm text-texto outline-none focus:border-bertel-oro"
        />
      </div>

      <div className="flex justify-end text-sm">
        <Link href="#" className="text-bertel-azul hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {error && (
        <p
          className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-bertel-azul px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-bertel-azul-700 disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>

      <p className="text-center text-xs leading-5 text-gris-texto">
        ¿Problemas para entrar? Contacta a tu coordinador académico.
      </p>
    </form>
  );
}
