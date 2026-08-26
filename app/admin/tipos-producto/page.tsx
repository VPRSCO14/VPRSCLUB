import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlusIcon, ChevronRightIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ListaTiposProducto() {
  const { data: tipos } = await supabase
    .from("tipos_producto")
    .select("id, nombre, prefijo, digitos, consecutivo")
    .order("nombre");

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl">Tipos de producto</h1>
        <Link href="/admin/tipos-producto/nuevo" className="btn-dark inline-flex items-center gap-2">
          <PlusIcon size={16} />
          Agregar tipo
        </Link>
      </div>

      <div className="rounded-vprs border border-vprs-black/10 divide-y divide-vprs-black/10">
        {tipos?.map((tipo) => {
          const siguienteCodigo =
            tipo.prefijo + String(tipo.consecutivo + 1).padStart(tipo.digitos, "0");
          return (
            <Link
              key={tipo.id}
              href={`/admin/tipos-producto/${tipo.id}/editar`}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-vprs-black/5 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-body font-medium truncate">{tipo.nombre}</p>
                <p className="font-body text-xs text-vprs-gray mt-1">
                  Prefijo {tipo.prefijo} · siguiente codigo: {siguienteCodigo}
                </p>
              </div>
              <ChevronRightIcon className="text-vprs-gray shrink-0" size={16} />
            </Link>
          );
        })}
        {(!tipos || tipos.length === 0) && (
          <p className="font-body text-vprs-gray px-6 py-8">Aun no hay tipos de producto creados.</p>
        )}
      </div>
    </main>
  );
}
