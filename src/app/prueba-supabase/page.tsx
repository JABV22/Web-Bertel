
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Resultado = {
  tabla: string;
  conectado: boolean;
  datos?: unknown[];
  error?: string;
};

export default function PruebaSupabase() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [cargando, setCargando] = useState(false);

  async function probarConexion() {
    setCargando(true);
    setResultados([]);

    const supabase = createClient();

    const {
            data: { user },
            error: authError,
    } = await supabase.auth.getUser();

    console.log("Usuario autenticado:", user?.id ?? "NINGUNO");
    console.log("Error de autenticación:", authError?.message ?? "NINGUNO");

    const tablas = [
      "programs",
      "academic_periods",
      "subjects",
      "courses",
      "competencies",
      "topics",
      "profiles",
    ] as const;

    const pruebas: Resultado[] = [];

    for (const tabla of tablas) {
      const { data, error } = await supabase
        .from(tabla)
        .select("*")
        .limit(3);

      pruebas.push({
        tabla,
        conectado: !error,
        datos: data ?? [],
        error: error?.message,
      });
    }

    setResultados(pruebas);
    setCargando(false);
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Prueba de conexión — Plataforma Bertel</h1>

      <p>
        Verificación de acceso a las tablas de Supabase.
      </p>

      <button onClick={probarConexion} disabled={cargando}>
        {cargando ? "Verificando..." : "Probar conexión"}
      </button>

      <div style={{ marginTop: 30 }}>
        {resultados.map((resultado) => (
          <div key={resultado.tabla} style={{ marginBottom: 20 }}>
            <h3>
              {resultado.conectado ? "✅" : "❌"}{" "}
              {resultado.tabla}
            </h3>

            {resultado.error ? (
              <p>Error: {resultado.error}</p>
            ) : (
              <pre>
                {JSON.stringify(resultado.datos, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}