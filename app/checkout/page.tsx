"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useCarrito, vaciarCarrito } from "@/lib/cart";
import { DEPARTAMENTOS_COLOMBIA } from "@/lib/colombia";
import { ArrowLeftIcon } from "@/components/icons";

declare global {
  interface Window {
    BoldCheckout: new (config: Record<string, unknown>) => { open: () => void };
  }
}

export default function PaginaCheckout() {
  const items = useCarrito();
  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const [boldListo, setBoldListo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    correo: "",
    telefono: "",
    direccion: "",
    departamento: "",
    ciudad: "",
  });

  const ciudadesDisponibles = useMemo(() => {
    const dep = DEPARTAMENTOS_COLOMBIA.find((d) => d.departamento === form.departamento);
    return dep?.ciudades ?? [];
  }, [form.departamento]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "departamento") {
      setForm((f) => ({ ...f, departamento: value, ciudad: "" }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!boldListo) {
      setError("La pasarela de pago aun se esta cargando, intenta de nuevo en un momento.");
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.error ?? "No se pudo iniciar el pago.");
        setEnviando(false);
        return;
      }

      const boldCheckout = new window.BoldCheckout({
        apiKey: datos.apiKey,
        orderId: datos.orderReference,
        currency: datos.currency,
        amount: datos.amount,
        description: datos.description,
        integritySignature: datos.integritySignature,
        redirectionUrl: datos.redirectionUrl,
        originUrl: datos.originUrl,
        customerData: JSON.stringify(datos.customerData),
        billingAddress: JSON.stringify(datos.billingAddress),
      });

      vaciarCarrito();
      boldCheckout.open();
    } catch {
      setError("No se pudo conectar con la pasarela de pago.");
      setEnviando(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen px-6 md:px-20 py-16">
        <p className="font-body text-vprs-gray mb-6">Tu carrito esta vacio.</p>
        <Link href="/" className="btn-dark inline-block">
          Explorar tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <Script
        src="https://checkout.bold.co/library/boldPaymentButton.js"
        strategy="afterInteractive"
        onLoad={() => setBoldListo(true)}
      />

      <Link href="/carrito" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-8">
        <ArrowLeftIcon size={14} />
        Volver al carrito
      </Link>

      <h1 className="font-display text-3xl md:text-4xl mb-10">Datos de entrega</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div>
            <label className="font-body text-sm block mb-2">Nombre completo</label>
            <input name="nombre" required value={form.nombre} onChange={handleChange} className="input-vprs" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm block mb-2">Cedula</label>
              <input name="cedula" required value={form.cedula} onChange={handleChange} className="input-vprs" />
            </div>
            <div>
              <label className="font-body text-sm block mb-2">Telefono</label>
              <input name="telefono" required value={form.telefono} onChange={handleChange} className="input-vprs" />
            </div>
          </div>

          <div>
            <label className="font-body text-sm block mb-2">Correo</label>
            <input
              name="correo"
              type="email"
              required
              value={form.correo}
              onChange={handleChange}
              className="input-vprs"
            />
          </div>

          <div>
            <label className="font-body text-sm block mb-2">Direccion</label>
            <input name="direccion" required value={form.direccion} onChange={handleChange} className="input-vprs" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm block mb-2">Departamento</label>
              <select
                name="departamento"
                required
                value={form.departamento}
                onChange={handleChange}
                className="input-vprs"
              >
                <option value="">Selecciona un departamento</option>
                {DEPARTAMENTOS_COLOMBIA.map((d) => (
                  <option key={d.departamento} value={d.departamento}>
                    {d.departamento}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-body text-sm block mb-2">Ciudad / Municipio</label>
              <select
                name="ciudad"
                required
                disabled={!form.departamento}
                value={form.ciudad}
                onChange={handleChange}
                className={`input-vprs ${!form.departamento ? "bg-vprs-black/5 text-vprs-gray" : ""}`}
              >
                <option value="">
                  {form.departamento ? "Selecciona una ciudad" : "Primero elige un departamento"}
                </option>
                {ciudadesDisponibles.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>
                    {ciudad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="font-body text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={enviando} className="btn-dark w-full">
            {enviando ? "Procesando..." : `Pagar $${total.toLocaleString("es-CO")}`}
          </button>
        </form>

        <div className="card-vprs p-6 h-fit">
          <h2 className="font-display text-xl mb-6">Resumen</h2>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={`${item.productoId}-${item.saborId ?? ""}`} className="flex justify-between font-body text-sm">
                <span className="text-vprs-gray">
                  {item.nombre}
                  {item.saborNombre ? ` (${item.saborNombre})` : ""} x{item.cantidad}
                </span>
                <span>${(item.precio * item.cantidad).toLocaleString("es-CO")}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-body font-medium border-t border-vprs-black/10 pt-4">
            <span>Total</span>
            <span>${total.toLocaleString("es-CO")}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
