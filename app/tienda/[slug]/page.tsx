import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PaginaCategoria({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: categoria } = await supabase
    .from("categorias")
    .select("id, nombre, slug, banner_url")
    .eq("slug", slug)
    .single();

  if (!categoria) {
    notFound();
  }

  const { data: productos } = await supabase
    .from("productos")
    .select("id, nombre, precio")
    .eq("categoria_id", categoria!.id)
    .eq("activo", true);

  return (
    <main className="min-h-screen">
      <section className="px-6 md:px-20 py-16 border-b border-vprs-gray/20">
        <Link href="/" className="font-body text-sm text-vprs-gray">
          &larr; Volver al inicio
        </Link>
        <h1 className="font-display text-3xl md:text-5xl mt-4">
          {categoria!.nombre}
        </h1>
      </section>

      <section className="px-6 md:px-20 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productos?.map((prod) => (
            <Link
              key={prod.id}
              href={`/producto/${prod.id}`}
              className="rounded-vprs border border-vprs-gray/20 overflow-hidden block"
            >
              <div className="aspect-square bg-vprs-graphite/5" />
              <div className="p-4">
                <p className="font-body font-medium text-sm">{prod.nombre}</p>
                <p className="font-body text-vprs-gray text-sm mt-1">
                  ${prod.precio.toLocaleString("es-CO")}
                </p>
              </div>
            </Link>
          ))}
          {(!productos || productos.length === 0) && (
            <p className="font-body text-vprs-gray">
              Aun no hay productos en esta categoria.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
