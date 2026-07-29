import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PaginaProducto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: producto } = await supabase
    .from("productos")
    .select("id, nombre, precio, descripcion, stock, categoria_id, marca_id, categorias(nombre), marcas(nombre)")
    .eq("id", id)
    .single();

  if (!producto) {
    notFound();
  }

  const categoriaNombre = (producto as any).categorias?.nombre;
  const marcaNombre = (producto as any).marcas?.nombre;

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <Link href="/" className="font-body text-sm text-vprs-gray">
        &larr; Volver al inicio
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div className="aspect-square bg-vprs-graphite/5 rounded-vprs" />

        <div>
          {categoriaNombre && (
            <p className="font-body text-sm text-vprs-gray uppercase mb-2">
              {categoriaNombre}
            </p>
          )}
          <h1 className="font-display text-3xl md:text-4xl mb-4">
            {producto!.nombre}
          </h1>
          {marcaNombre && (
            <p className="font-body text-vprs-gray mb-4">{marcaNombre}</p>
          )}
          <p className="font-display text-2xl mb-6">
            ${producto!.precio.toLocaleString("es-CO")}
          </p>

          {producto!.descripcion && (
            <p className="font-body text-vprs-graphite mb-8">
              {producto!.descripcion}
            </p>
          )}

          <p className="font-body text-sm text-vprs-gray mb-6">
            {producto!.stock > 0
              ? `${producto!.stock} disponibles`
              : "Agotado"}
          </p>

          <button
            disabled={producto!.stock === 0}
            className="w-full h-14 rounded-vprs bg-vprs-black text-vprs-white font-body font-medium disabled:opacity-50"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
