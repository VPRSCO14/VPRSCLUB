"use client";

import { useState } from "react";
import { CheckIcon } from "./icons";
import { agregarAlCarrito } from "@/lib/cart";

type AddToCartButtonProps = {
  agotado: boolean;
  productoId: string;
  nombre: string;
  precio: number;
  saborId?: string;
  saborNombre?: string;
};

export default function AddToCartButton({
  agotado,
  productoId,
  nombre,
  precio,
  saborId,
  saborNombre,
}: AddToCartButtonProps) {
  const [agregado, setAgregado] = useState(false);

  if (agotado) {
    return (
      <button disabled className="btn-dark w-full">
        Agotado
      </button>
    );
  }

  const handleClick = () => {
    agregarAlCarrito({ productoId, nombre, precio, saborId, saborNombre });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={agregado}
      className="btn-dark w-full gap-2"
    >
      {agregado ? (
        <>
          <CheckIcon size={16} />
          Agregado
        </>
      ) : (
        "Agregar al carrito"
      )}
    </button>
  );
}
