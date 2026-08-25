"use client";

import { useState } from "react";
import { CheckIcon } from "./icons";

export default function AddToCartButton({ agotado }: { agotado: boolean }) {
  const [agregado, setAgregado] = useState(false);

  if (agotado) {
    return (
      <button disabled className="btn-dark w-full">
        Agotado
      </button>
    );
  }

  return (
    <button
      onClick={() => setAgregado(true)}
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
