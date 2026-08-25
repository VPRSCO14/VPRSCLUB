import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";
import { ArrowLeftIcon } from "@/components/icons";
import { getMaterialGradient } from "@/lib/materials";

export const dynamic = "force-dynamic";

type ProductoConRelaciones = {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string | null;
  stock: number;
  categoria_id: string | null;
  marca_id: string | null;
  categorias: { nombre: string } | { nombre: string }[] | null;
  marcas: { nombre: string } | { nombre: string }[] | null;
};

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

  const prod = producto as unknown as ProductoConRelaciones;
  const categoriaRel = Array.isArray(prod.categorias) ? prod.categorias[0] : prod.categorias;
  const marcaRel = Array.isArray(prod.marcas) ? prod.marcas[0] : prod.marcas;
  const categoriaNombre = categoriaRel?.nombre;
  const marcaNombre = marcaRel?.nombre;
  const agotado = prod.stock === 0;

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <Link href="/" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2">
        <ArrowLeftIcon size={14} />
        Volver al inicio
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div
          className="aspect-square rounded-vprs"
          style={{ backgroundImage: getMaterialGradient(prod.id) }}
        />

        <div>
          {categoriaNombre && (
            <p className="font-body text-sm text-vprs-gray uppercase mb-2">
              {categoriaNombre}
            </p>
          )}
          <h1 className="font-display text-3xl md:text-4xl mb-4">
            {prod.nombre}
          </h1>
          {marcaNombre && (
            <p className="font-body text-vprs-gray mb-4">{marcaNombre}</p>
          )}
          <p className="font-display text-2xl mb-6">
            ${prod.precio.toLocaleString("es-CO")}
          </p>

          {prod.descripcion && (
            <p className="font-body text-vprs-graphite mb-8">
              {prod.descripcion}
            </p>
          )}

          <p
            className="font-body text-sm mb-6"
            style={{ color: agotado ? "#8C2F2F" : "#707070" }}
          >
            {agotado ? "Agotado" : `${prod.stock} disponibles`}
          </p>

          <AddToCartButton agotado={agotado} />
        </div>
      </div>
    </main>
  );
}
