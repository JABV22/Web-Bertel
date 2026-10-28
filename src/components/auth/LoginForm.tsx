"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? "No fue posible iniciar sesión.");
        return;
      }

      router.push("/panel");
    } catch {
      setError("No fue posible conectar con el acceso de prueba.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="usuario" className="mb-2 block text-sm font-semibold text-texto-fuerte">
          Usuario
        </label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-lg border border-borde-fuerte bg-superficie px-4 py-3 text-sm text-texto outline-none focus:border-bertel-oro"
        />
        <p className="mt-2 text-xs leading-5 text-gris-texto">
          En la versión real, el identificador será definido por la arquitectura.
        </p>
      </div>

      <div>
        <label htmlFor="clave" className="mb-2 block text-sm font-semibold text-texto-fuerte">
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

      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2 text-gris-texto">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 accent-bertel-azul"
          />
          Mantener la sesión
        </label>
        <Link href="#" className="text-bertel-azul hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error" role="alert">
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
