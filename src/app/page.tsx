import EscenaPortada from "@/components/home/escena-portada";
import Closure from "@/components/home/cierre";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Historic from "@/components/home/historic";
import Institucional from "@/components/home/institucional";
import Programs from "@/components/home/programs";
import Relato from "@/components/home/relato";

export default function Home() {
  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Relato />
        <Programs />
        <Historic />
        <Institucional />
        <Closure />
      </main>
      <Footer />
      <EscenaPortada />
    </>
  );
}
