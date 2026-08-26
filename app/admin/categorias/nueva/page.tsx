"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";
import { ArrowLeftIcon } from "@/components/icons";

export default function NuevaCategoria() {
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEditadoManual, setSlugEditadoManual] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNombre(valor);
    if (!slugEditadoManual) {
      setSlug(slugify(valor));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEditadoManual(true);
    setSlug(slugify(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("categorias").insert({
      nombre,
      slug,
    });

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    setMensaje("Categoria guardada correctamente.");
    setNombre("");
    setSlug("");
    setSlugEditadoManual(false);
  };

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-2xl">
      <Link href="/admin/categorias" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver a categorias
      </Link>

      <h1 className="font-display text-2xl mb-8">Agregar categoria</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-body text-sm block mb-2">Nombre</label>
          <input
            name="nombre"
            required
            value={nombre}
            onChange={handleNombreChange}
            className="input-vprs"
          />
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Slug (URL)</label>
          <input
            name="slug"
            required
            value={slug}
            onChange={handleSlugChange}
            className="input-vprs"
          />
          <p className="font-body text-xs text-vprs-gray mt-2">
            Se vera en /tienda/{slug || "..."}
          </p>
        </div>

        {mensaje && <p className="font-body text-sm">{mensaje}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="btn-dark w-full"
        >
          {guardando ? "Guardando..." : "Guardar categoria"}
        </button>
      </form>
    </main>
  );
}
