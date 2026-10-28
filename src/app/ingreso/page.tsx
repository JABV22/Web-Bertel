import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Ingresar",
  robots: { index: false, follow: false },
};

export default function IngresoPage() {
  return (
    <div className="min-h-screen bg-superficie">
      <div className=" mx-auto flex min-h-[calc(100vh-49px)] max-w-7xl items-center justify-center gap-20 px-5 py-12 lg:justify-between lg:px-12">
        <main className="w-full max-w-md rounded-2xl bg-superficie p-7 sm:p-10">
          <Link href="/" className="mb-12 flex items-center gap-3">
            <Image src="/logo-bertel.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
            <span className="text-base font-bold leading-tight text-bertel-azul">
              Preicfés Bertel
              <span className="block text-sm font-normal text-gris-texto">Portal académico</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-texto-fuerte">Ingresa a tu portal</h1>
          <p className="mt-3 text-sm leading-6 text-gris-texto">
            Consulta tus pruebas disponibles y revisa tus resultados.
          </p>
          <LoginForm />
        </main>
      </div>
    </div>
  );
}
