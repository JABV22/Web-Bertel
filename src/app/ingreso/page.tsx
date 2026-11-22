import Image from "next/image";
import Link from "next/link";
import { DemoProgress } from "@/components/auth/DemoProgress";
import { LoginForm } from "@/components/auth/LoginForm";
import logo from "@/prototipo/assets/logo-bertel.png";

export const metadata = {
  title: "Ingresar",
  robots: { index: false, follow: false },
};

export default function IngresoPage() {
  return (
    <div className="acceso">
      <main className="acceso__forma">
        <div className="acceso__caja">
          <Link href="/" className="marca acceso__marca">
            <Image src={logo} alt="" width={44} height={44} />
            <span className="marca__texto">
              Preicfés Bertel<span>Portal académico</span>
            </span>
          </Link>
          <h1>Ingresa a tu portal</h1>
          <p>Consulta tus pruebas disponibles y revisa tus resultados.</p>
          <LoginForm />
        </div>
      </main>
      <DemoProgress />
    </div>
  );
}
