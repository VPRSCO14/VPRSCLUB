"use client";

import Link from "next/link";
import { useCarrito, actualizarCantidad, quitarDelCarrito, vaciarCarrito } from "@/lib/cart";
import { ArrowLeftIcon, XIcon } from "@/components/icons";
import { getMaterialGradient } from "@/lib/materials";

export default function PaginaCarrito() {
  const items = useCarrito();
  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <Link href="/" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-8">
        <ArrowLeftIcon size={14} />
        Volver al inicio
      </Link>

      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl md:text-4xl">Tu carrito</h1>
        {items.length > 0 && (
          <button
            onClick={vaciarCarrito}
            className="font-body text-sm text-vprs-gray hover:text-vprs-black transition-colors"
          >
            Vaciar carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div>
          <p className="font-body text-vprs-gray mb-6">Tu carrito esta vacio.</p>
          <Link href="/" className="btn-dark inline-block">
            Explorar tienda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productoId}-${item.saborId ?? ""}`}
                className="flex items-center gap-4 card-vprs p-4"
              >
                <div
                  className="w-20 h-20 rounded-vprs shrink-0"
                  style={{ backgroundImage: getMaterialGradient(item.productoId) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium truncate">{item.nombre}</p>
                  {item.saborNombre && (
                    <p className="font-body text-xs text-vprs-gray mt-1">Sabor: {item.saborNombre}</p>
                  )}
                  <p className="font-body text-sm text-vprs-gray mt-1">
                    ${item.precio.toLocaleString("es-CO")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => actualizarCantidad(item.productoId, item.saborId, item.cantidad - 1)}
                    aria-label="Quitar una unidad"
                    className="w-7 h-7 rounded-full border border-vprs-black/20 flex items-center justify-center hover:border-vprs-black transition-colors"
                  >
                    −
                  </button>
                  <span className="font-body text-sm w-6 text-center">{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => actualizarCantidad(item.productoId, item.saborId, item.cantidad + 1)}
                    aria-label="Agregar una unidad"
                    className="w-7 h-7 rounded-full border border-vprs-black/20 flex items-center justify-center hover:border-vprs-black transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => quitarDelCarrito(item.productoId, item.saborId)}
                  aria-label="Quitar producto"
                  className="text-vprs-gray hover:text-vprs-black transition-colors shrink-0"
                >
                  <XIcon size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="card-vprs p-6 h-fit">
            <h2 className="font-display text-xl mb-6">Resumen</h2>
            <div className="flex justify-between font-body text-sm mb-6">
              <span className="text-vprs-gray">Subtotal</span>
              <span className="font-medium">${total.toLocaleString("es-CO")}</span>
            </div>
            <p className="font-body text-xs text-vprs-gray">
              Este carrito guarda tu pedido en este navegador. La compra y el pago se coordinan
              directamente con nosotros.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
