"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";
import { ArrowLeftIcon } from "@/components/icons";

export default function EditarCategoria() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const { data: categoria } = await supabase
        .from("categorias")
        .select("nombre, slug, banner_url")
        .eq("id", id)
        .single();

      if (categoria) {
        setNombre(categoria.nombre ?? "");
        setSlug(categoria.slug ?? "");
        setImagenUrl(categoria.banner_url ?? "");
      }

      setCargando(false);
    };
    cargar();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase
      .from("categorias")
      .update({ nombre, slug, banner_url: imagenUrl || null })
      .eq("id", id);

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    router.push("/admin/categorias");
  };

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-body text-vprs-gray">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-2xl">
      <Link href="/admin/categorias" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver a categorias
      </Link>

      <h1 className="font-display text-2xl mb-8">Editar categoria</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-body text-sm block mb-2">Nombre</label>
          <input
            name="nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input-vprs"
          />
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Slug (URL)</label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="input-vprs"
          />
          <p className="font-body text-xs text-vprs-gray mt-2">
            Se vera en /tienda/{slug || "..."}
          </p>
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Imagen (URL)</label>
          <input
            name="imagen_url"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            className="input-vprs"
            placeholder="https://..."
          />
          <p className="font-body text-xs text-vprs-gray mt-2">
            Opcional. Si no se pone, se usa un fondo de color por defecto.
          </p>
        </div>

        {mensaje && <p className="font-body text-sm">{mensaje}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="btn-dark w-full"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}
