import Link from "next/link";

export default function Closure() {
  return (
    <section className="seccion seccion--oscura cierre" id="contacto">
      <div className="envoltura envoltura--estrecha tema-oscuro">
        <p className="etiqueta" style={{ justifyContent: "center" }}>
          Siguiente paso
        </p>
        <h2>Da el siguiente paso con Bertel.</h2>
        <p>
          Conoce la oferta completa o escribe al equipo para resolver dudas
          sobre los programas y las fechas de los próximos simulacros.
        </p>
        <div className="cierre__acciones">
          <a className="btn btn--acento" href="#programas">
            Ver los programas
          </a>
          <Link className="btn btn--linea-clara" href="/ingreso">
            Ingresar al portal
          </Link>
        </div>
        <p style={{ margin: "var(--e6)", fontSize: "var(--t-micro)" }}>
          Canales de contacto pendientes de confirmar. No se publican correos ni
          teléfonos hasta recibir los datos reales.
        </p>
      </div>
    </section>
  );
}
