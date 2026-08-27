"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ContenidoConfirmacion() {
  const searchParams = useSearchParams();
  const estado = (searchParams.get("bold-tx-status") ?? "").toLowerCase();

  let titulo = "Estamos confirmando tu pago";
  let mensaje = "En unos minutos recibiras la confirmacion de tu pedido en tu correo.";

  if (estado === "approved") {
    titulo = "¡Pago aprobado!";
    mensaje = "Gracias por tu compra. Muy pronto nos pondremos en contacto para coordinar el envio.";
  } else if (estado === "rejected" || estado === "failed") {
    titulo = "El pago no fue aprobado";
    mensaje = "Tu pago no pudo procesarse. Puedes intentarlo de nuevo desde tu carrito.";
  } else if (estado === "pending") {
    titulo = "Tu pago esta en proceso";
    mensaje = "Te avisaremos apenas se confirme. No es necesario que vuelvas a pagar.";
  }

  return (
    <main className="min-h-screen px-6 md:px-20 py-24 flex flex-col items-center text-center">
      <h1 className="font-display text-3xl md:text-4xl mb-4">{titulo}</h1>
      <p className="font-body text-vprs-gray max-w-md mb-10">{mensaje}</p>
      <Link href="/" className="btn-dark inline-block">
        Volver al inicio
      </Link>
    </main>
  );
}

export default function PaginaConfirmacion() {
  return (
    <Suspense>
      <ContenidoConfirmacion />
    </Suspense>
  );
}
