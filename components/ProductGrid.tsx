"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

type Producto = { id: string; nombre: string; precio: number };
type Orden = "relevancia" | "precio-asc" | "precio-desc";

export default function ProductGrid({ productos }: { productos: Producto[] }) {
  const [orden, setOrden] = useState<Orden>("relevancia");

  const productosOrdenados = useMemo(() => {
    const lista = [...productos];
    if (orden === "precio-asc") lista.sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") lista.sort((a, b) => b.precio - a.precio);
    return lista;
  }, [productos, orden]);

  const pill = (activo: boolean) =>
    `h-9 px-4 rounded-full border text-xs font-body transition-colors ${
      activo
        ? "bg-vprs-black text-vprs-white border-vprs-black"
        : "border-vprs-black/20 text-vprs-gray hover:border-vprs-black hover:text-vprs-black"
    }`;

  return (
    <div>
      <div className="flex items-center justify-between mb-9">
        <p className="font-body text-sm text-vprs-gray">
          {productos.length} producto{productos.length === 1 ? "" : "s"}
        </p>
        <div className="flex gap-2">
          <button className={pill(orden === "relevancia")} onClick={() => setOrden("relevancia")}>
            Relevancia
          </button>
          <button className={pill(orden === "precio-asc")} onClick={() => setOrden("precio-asc")}>
            Precio: menor a mayor
          </button>
          <button className={pill(orden === "precio-desc")} onClick={() => setOrden("precio-desc")}>
            Precio: mayor a menor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {productosOrdenados.map((prod) => (
          <ProductCard key={prod.id} id={prod.id} nombre={prod.nombre} precio={prod.precio} />
        ))}
        {productos.length === 0 && (
          <p className="font-body text-vprs-gray col-span-full">
            Aun no hay productos en esta categoria.
          </p>
        )}
      </div>
    </div>
  );
}
