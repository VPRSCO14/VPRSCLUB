"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

type Variante = {
  id: string;
  nombre: string;
  stock: number;
};

type ProductoOpcionesProps = {
  variantes: Variante[];
  stockSimple: number;
};

export default function ProductoOpciones({ variantes, stockSimple }: ProductoOpcionesProps) {
  const primeraDisponible = variantes.find((v) => v.stock > 0) ?? variantes[0];
  const [seleccionId, setSeleccionId] = useState(primeraDisponible?.id);

  if (variantes.length === 0) {
    const agotado = stockSimple === 0;
    return (
      <>
        <p
          className="font-body text-sm mb-6"
          style={{ color: agotado ? "#8C2F2F" : "#707070" }}
        >
          {agotado ? "Agotado" : `${stockSimple} disponibles`}
        </p>
        <AddToCartButton agotado={agotado} />
      </>
    );
  }

  const seleccion = variantes.find((v) => v.id === seleccionId) ?? variantes[0];
  const agotado = seleccion.stock === 0;

  return (
    <>
      <p className="font-body text-xs tracking-wide uppercase text-vprs-gray font-semibold mb-2">
        Sabor
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {variantes.map((variante) => {
          const activo = variante.id === seleccion.id;
          const sinStock = variante.stock === 0;
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
        {agotado ? "Agotado" : `${seleccion.stock} disponibles`}
      </p>

      <AddToCartButton agotado={agotado} />
    </>
  );
}
