"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

type Variante = {
  id: string;
  nombre: string;
  disponible: boolean;
};

type ProductoOpcionesProps = {
  productoId: string;
  nombre: string;
  precio: number;
  variantes: Variante[];
  disponibleSimple: boolean;
};

export default function ProductoOpciones({
  productoId,
  nombre,
  precio,
  variantes,
  disponibleSimple,
}: ProductoOpcionesProps) {
  const primeraDisponible = variantes.find((v) => v.disponible) ?? variantes[0];
  const [seleccionId, setSeleccionId] = useState(primeraDisponible?.id);

  if (variantes.length === 0) {
    const agotado = !disponibleSimple;
    return (
      <>
        <p
          className="font-body text-sm mb-6"
          style={{ color: agotado ? "#8C2F2F" : "#707070" }}
        >
          {agotado ? "Sin Stock" : "Stock"}
        </p>
        <AddToCartButton agotado={agotado} productoId={productoId} nombre={nombre} precio={precio} />
      </>
    );
  }

  const seleccion = variantes.find((v) => v.id === seleccionId) ?? variantes[0];
  const agotado = !seleccion.disponible;

  return (
    <>
      <p className="font-body text-xs tracking-wide uppercase text-vprs-gray font-semibold mb-2">
        Sabor
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {variantes.map((variante) => {
          const activo = variante.id === seleccion.id;
          const sinStock = !variante.disponible;
          return (
            <button
              key={variante.id}
              type="button"
              onClick={() => setSeleccionId(variante.id)}
              disabled={sinStock}
              className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
                activo
                  ? "bg-vprs-black text-white border-vprs-black"
                  : sinStock
                  ? "border-vprs-black/10 text-vprs-gray/40 line-through"
                  : "border-vprs-black/20 text-vprs-black hover:border-vprs-black"
              }`}
            >
              {variante.nombre}
            </button>
          );
        })}
      </div>

      <p
        className="font-body text-sm mb-6"
        style={{ color: agotado ? "#8C2F2F" : "#707070" }}
      >
        {agotado ? "Sin Stock" : "Stock"}
      </p>

      <AddToCartButton
        agotado={agotado}
        productoId={productoId}
        nombre={nombre}
        precio={precio}
        saborId={seleccion.id}
        saborNombre={seleccion.nombre}
      />
    </>
  );
}
