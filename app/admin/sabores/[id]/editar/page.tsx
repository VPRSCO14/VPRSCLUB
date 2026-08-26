"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeftIcon } from "@/components/icons";

export default function EditarSabor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const { data: sabor } = await supabase
        .from("sabores")
        .select("nombre")
        .eq("id", id)
        .single();

      if (sabor) {
        setNombre(sabor.nombre ?? "");
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
      .from("sabores")
      .update({ nombre })
      .eq("id", id);

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    router.push("/admin/sabores");
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
      <Link href="/admin/sabores" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver a sabores
      </Link>

      <h1 className="font-display text-2xl mb-8">Editar sabor</h1>

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
