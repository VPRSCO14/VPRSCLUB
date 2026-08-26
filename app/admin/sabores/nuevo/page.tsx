"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NuevoSabor() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("sabores").insert({ nombre });

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    setMensaje("Sabor guardado correctamente.");
    setNombre("");
  };

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-2xl">
      <h1 className="font-display text-2xl mb-8">Agregar sabor</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-body text-sm block mb-2">Nombre</label>
          <input
            name="nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input-vprs"
            placeholder="Ej. Menta, Fresa, Mango"
          />
        </div>

        {mensaje && <p className="font-body text-sm">{mensaje}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="btn-dark w-full"
        >
          {guardando ? "Guardando..." : "Guardar sabor"}
        </button>
      </form>
    </main>
  );
}
