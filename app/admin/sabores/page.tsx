import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlusIcon, ChevronRightIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ListaSabores() {
  const { data: sabores } = await supabase
    .from("sabores")
    .select("id, nombre")
    .order("nombre");

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl">Sabores</h1>
        <Link href="/admin/sabores/nuevo" className="btn-dark inline-flex items-center gap-2">
          <PlusIcon size={16} />
          Agregar sabor
        </Link>
      </div>

      <div className="rounded-vprs border border-vprs-black/10 divide-y divide-vprs-black/10">
        {sabores?.map((sabor) => (
          <Link
            key={sabor.id}
            href={`/admin/sabores/${sabor.id}/editar`}
            className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-vprs-black/5 transition-colors"
          >
            <p className="font-body font-medium truncate">{sabor.nombre}</p>
            <ChevronRightIcon className="text-vprs-gray shrink-0" size={16} />
          </Link>
        ))}
        {(!sabores || sabores.length === 0) && (
          <p className="font-body text-vprs-gray px-6 py-8">Aun no hay sabores creados.</p>
        )}
      </div>
    </main>
  );
}
