import Closure from "@/components/home/cierre";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Historic from "@/components/home/historic";
import Institucional from "@/components/home/institucional";
import Programs from "@/components/home/programs";
import Relato from "@/components/home/relato";

/**
 * Página de espera de la Fase 1.
 *
 * NO es la página de inicio del producto (P01 de WIREFRAMES.md §3).
 * Existe únicamente para verificar que el entorno arranca y compila, y para
 * dejar claro en qué punto está el proyecto. Se sustituye en la Fase 3.
 */

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Relato />
        <Programs />
        <Institucional />
        <Historic />
        <Closure />
      </main>
      <Footer />
    </>
  );
}
