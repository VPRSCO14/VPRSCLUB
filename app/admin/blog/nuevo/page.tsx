"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";
import { ArrowLeftIcon } from "@/components/icons";

export default function NuevoArticulo() {
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEditadoManual, setSlugEditadoManual] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    resumen: "",
    contenido: "",
    imagen_url: "",
    autor: "",
    publicado: true,
  });

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setTitulo(valor);
    if (!slugEditadoManual) {
      setSlug(slugify(valor));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEditadoManual(true);
    setSlug(slugify(e.target.value));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("articulos").insert({
      titulo,
      slug,
      resumen: form.resumen || null,
      contenido: form.contenido,
      imagen_url: form.imagen_url || null,
      autor: form.autor || null,
      publicado: form.publicado,
    });

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    setMensaje("Articulo guardado correctamente.");
    setTitulo("");
    setSlug("");
    setSlugEditadoManual(false);
    setForm({ resumen: "", contenido: "", imagen_url: "", autor: "", publicado: true });
  };

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-2xl">
      <Link href="/admin/blog" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver al blog
      </Link>

      <h1 className="font-display text-2xl mb-8">Agregar articulo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-body text-sm block mb-2">Titulo</label>
          <input
            name="titulo"
            required
            value={titulo}
            onChange={handleTituloChange}
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
            Se vera en /blog/{slug || "..."}
          </p>
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Autor</label>
          <input
            name="autor"
            value={form.autor}
            onChange={handleChange}
            className="input-vprs"
          />
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Imagen (URL)</label>
          <input
            name="imagen_url"
            value={form.imagen_url}
            onChange={handleChange}
            className="input-vprs"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Resumen</label>
          <textarea
            name="resumen"
            value={form.resumen}
            onChange={handleChange}
            rows={2}
            className="textarea-vprs"
          />
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Contenido</label>
          <textarea
            name="contenido"
            required
            value={form.contenido}
            onChange={handleChange}
            rows={10}
            className="textarea-vprs"
          />
        </div>

        <label className="flex items-center gap-2 font-body text-sm">
          <input
            type="checkbox"
            name="publicado"
            checked={form.publicado}
            onChange={handleChange}
          />
          Publicar de inmediato
        </label>

        {mensaje && <p className="font-body text-sm">{mensaje}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="btn-dark w-full"
        >
          {guardando ? "Guardando..." : "Guardar articulo"}
        </button>
      </form>
    </main>
  );
}
