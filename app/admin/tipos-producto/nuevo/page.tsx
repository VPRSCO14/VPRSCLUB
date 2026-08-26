"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeftIcon } from "@/components/icons";

export default function NuevoTipoProducto() {
  const [nombre, setNombre] = useState("");
  const [prefijo, setPrefijo] = useState("");
  const [digitos, setDigitos] = useState("3");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const ejemploCodigo = prefijo + "1".padStart(Number(digitos) || 0, "0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("tipos_producto").insert({
      nombre,
      prefijo: prefijo.toUpperCase(),
      digitos: parseInt(digitos, 10),
      consecutivo: 0,
    });

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    setMensaje("Tipo de producto guardado correctamente.");
    setNombre("");
    setPrefijo("");
    setDigitos("3");
  };

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-2xl">
      <Link href="/admin/tipos-producto" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver a tipos de producto
      </Link>

      <h1 className="font-display text-2xl mb-8">Agregar tipo de producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-body text-sm block mb-2">Nombre</label>
          <input
            name="nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input-vprs"
            placeholder="Ej. Desechable"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm block mb-2">Prefijo</label>
            <input
              name="prefijo"
              required
              value={prefijo}
              onChange={(e) => setPrefijo(e.target.value.toUpperCase())}
              className="input-vprs"
              placeholder="Ej. DE"
              maxLength={4}
            />
          </div>
          <div>
            <label className="font-body text-sm block mb-2">Digitos del consecutivo</label>
            <input
              name="digitos"
              type="number"
              min={1}
              max={10}
              required
              value={digitos}
              onChange={(e) => setDigitos(e.target.value)}
              className="input-vprs"
            />
          </div>
        </div>

        <p className="font-body text-xs text-vprs-gray">
          El primer producto de este tipo tendra el codigo: <strong>{ejemploCodigo || "..."}</strong>
        </p>

        {mensaje && <p className="font-body text-sm">{mensaje}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="btn-dark w-full"
        >
          {guardando ? "Guardando..." : "Guardar tipo de producto"}
        </button>
      </form>
    </main>
  );
}
