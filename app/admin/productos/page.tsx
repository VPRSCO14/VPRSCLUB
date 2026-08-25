import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlusIcon, ChevronRightIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

type ProductoConCategoria = {
  id: string;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
  categorias: { nombre: string } | { nombre: string }[] | null;
};

export default async function ListaProductos() {
  const { data } = await supabase
    .from("productos")
    .select("id, codigo, nombre, precio, stock, activo, categorias(nombre)")
    .order("nombre");

  const productos = (data ?? []) as unknown as ProductoConCategoria[];

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl">Productos</h1>
        <Link href="/admin/productos/nuevo" className="btn-dark inline-flex items-center gap-2">
          <PlusIcon size={16} />
          Agregar producto
        </Link>
      </div>

      <div className="rounded-vprs border border-vprs-black/10 divide-y divide-vprs-black/10">
        {productos.map((producto) => {
          const categoriaRel = Array.isArray(producto.categorias)
            ? producto.categorias[0]
            : producto.categorias;

          return (
            <Link
              key={producto.id}
              href={`/admin/productos/${producto.id}/editar`}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-vprs-black/5 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-body font-medium truncate">{producto.nombre}</p>
                <p className="font-body text-xs text-vprs-gray mt-1">
                  {producto.codigo}
                  {categoriaRel?.nombre ? ` · ${categoriaRel.nombre}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <p className="font-body text-sm">${producto.precio.toLocaleString("es-CO")}</p>
                <p className="font-body text-xs text-vprs-gray hidden sm:block">
                  {producto.stock} en stock
                </p>
                <span
                  className={`font-body text-xs px-3 py-1 rounded-full ${
                    producto.activo
                      ? "text-vprs-black bg-vprs-black/5"
                      : "text-vprs-gray bg-vprs-black/5"
                  }`}
                >
                  {producto.activo ? "Activo" : "Inactivo"}
                </span>
                <ChevronRightIcon className="text-vprs-gray" size={16} />
              </div>
            </Link>
          );
        })}
        {productos.length === 0 && (
          <p className="font-body text-vprs-gray px-6 py-8">Aun no hay productos creados.</p>
        )}
      </div>
    </main>
  );
}
