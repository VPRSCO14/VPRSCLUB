"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeftIcon } from "@/components/icons";

export default function EditarTipoProducto() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [prefijo, setPrefijo] = useState("");
  const [digitos, setDigitos] = useState("3");
  const [consecutivo, setConsecutivo] = useState("0");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const { data: tipo } = await supabase
        .from("tipos_producto")
        .select("nombre, prefijo, digitos, consecutivo")
        .eq("id", id)
        .single();

      if (tipo) {
        setNombre(tipo.nombre ?? "");
        setPrefijo(tipo.prefijo ?? "");
        setDigitos(String(tipo.digitos ?? 3));
        setConsecutivo(String(tipo.consecutivo ?? 0));
      }

      setCargando(false);
    };
    cargar();
  }, [id]);

  const siguienteCodigo =
    prefijo + String(Number(consecutivo) + 1).padStart(Number(digitos) || 0, "0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase
      .from("tipos_producto")
      .update({
        nombre,
        prefijo: prefijo.toUpperCase(),
        digitos: parseInt(digitos, 10),
        consecutivo: parseInt(consecutivo, 10),
      })
      .eq("id", id);

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    router.push("/admin/tipos-producto");
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
      <Link href="/admin/tipos-producto" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver a tipos de producto
      </Link>

      <h1 className="font-display text-2xl mb-8">Editar tipo de producto</h1>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm block mb-2">Prefijo</label>
            <input
              name="prefijo"
              required
              value={prefijo}
              onChange={(e) => setPrefijo(e.target.value.toUpperCase())}
              className="input-vprs"
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

        <div>
          <label className="font-body text-sm block mb-2">Consecutivo actual</label>
          <input
            name="consecutivo"
            type="number"
            min={0}
            required
            value={consecutivo}
            onChange={(e) => setConsecutivo(e.target.value)}
            className="input-vprs"
          />
          <p className="font-body text-xs text-vprs-gray mt-2">
            El siguiente producto de este tipo tendra el codigo: <strong>{siguienteCodigo}</strong>.
            Solo cambia este numero si necesitas corregir el consecutivo.
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
