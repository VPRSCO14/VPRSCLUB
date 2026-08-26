import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlusIcon, ChevronRightIcon, ArrowLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ListaCategorias() {
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre, slug")
    .order("nombre");

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <Link href="/admin" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver al panel
      </Link>

      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl">Categorias</h1>
        <Link href="/admin/categorias/nueva" className="btn-dark inline-flex items-center gap-2">
          <PlusIcon size={16} />
          Agregar categoria
        </Link>
      </div>

      <div className="rounded-vprs border border-vprs-black/10 divide-y divide-vprs-black/10">
        {categorias?.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/admin/categorias/${categoria.id}/editar`}
            className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-vprs-black/5 transition-colors"
          >
            <div className="min-w-0">
              <p className="font-body font-medium truncate">{categoria.nombre}</p>
              <p className="font-body text-xs text-vprs-gray mt-1">/tienda/{categoria.slug}</p>
            </div>
            <ChevronRightIcon className="text-vprs-gray shrink-0" size={16} />
          </Link>
        ))}
        {(!categorias || categorias.length === 0) && (
          <p className="font-body text-vprs-gray px-6 py-8">Aun no hay categorias creadas.</p>
        )}
      </div>
    </main>
  );
}
