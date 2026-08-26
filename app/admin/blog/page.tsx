import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlusIcon, ChevronRightIcon, ArrowLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ListaArticulos() {
  const { data: articulos } = await supabase
    .from("articulos")
    .select("id, titulo, publicado, publicado_en")
    .order("publicado_en", { ascending: false });

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <Link href="/admin" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver al panel
      </Link>

      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl">Blog</h1>
        <Link href="/admin/blog/nuevo" className="btn-dark inline-flex items-center gap-2">
          <PlusIcon size={16} />
          Agregar articulo
        </Link>
      </div>

      <div className="rounded-vprs border border-vprs-black/10 divide-y divide-vprs-black/10">
        {articulos?.map((articulo) => {
          const fecha = new Date(articulo.publicado_en).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <Link
              key={articulo.id}
              href={`/admin/blog/${articulo.id}/editar`}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-vprs-black/5 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-body font-medium truncate">{articulo.titulo}</p>
                <p className="font-body text-xs text-vprs-gray mt-1">{fecha}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-body text-xs px-3 py-1 rounded-full text-vprs-black bg-vprs-black/5">
                  {articulo.publicado ? "Publicado" : "Borrador"}
                </span>
                <ChevronRightIcon className="text-vprs-gray" size={16} />
              </div>
            </Link>
          );
        })}
        {(!articulos || articulos.length === 0) && (
          <p className="font-body text-vprs-gray px-6 py-8">Aun no hay articulos creados.</p>
        )}
      </div>
    </main>
  );
}
