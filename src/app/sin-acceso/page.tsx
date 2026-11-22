import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-2xl font-bold text-texto-fuerte">
        Acceso no autorizado
      </h1>
      <p className="mt-3 text-sm leading-6 text-gris-texto">
        Tu cuenta no tiene un rol activo asignado para esta sección. Contacta al
        administrador de la plataforma.
      </p>
      <Link
        className="mt-6 inline-block font-semibold text-bertel-azul hover:underline"
        href="/ingreso"
      >
        Volver al ingreso
      </Link>
    </main>
  );
}
