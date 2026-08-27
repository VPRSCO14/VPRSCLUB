"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeftIcon } from "@/components/icons";
import { ESTADO_LABELS, type EstadoPedido } from "@/lib/bold";

type ItemPedido = {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  saborNombre?: string;
};

type Pedido = {
  id: string;
  nombre: string;
  cedula: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  items: ItemPedido[];
  total: number;
  estado: EstadoPedido;
  bold_order_id: string | null;
  created_at: string;
};

const ESTADOS: EstadoPedido[] = ["pendiente", "pagado", "enviado", "entregado", "fallido", "reembolsado"];

export default function DetallePedido() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        router.push("/admin/login");
        return;
      }

      const { data } = await supabase.from("pedidos_tienda").select("*").eq("id", params.id).single();
      setPedido(data as Pedido | null);
      setCargando(false);
    };
    cargar();
  }, [router, params.id]);

  const cambiarEstado = async (estado: EstadoPedido) => {
    if (!pedido) return;
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase
      .from("pedidos_tienda")
      .update({ estado, updated_at: new Date().toISOString() })
      .eq("id", pedido.id);

    setGuardando(false);
    if (error) {
      setMensaje("No se pudo actualizar el estado: " + error.message);
      return;
    }
    setPedido({ ...pedido, estado });
    setMensaje("Estado actualizado.");
  };

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-body text-vprs-gray">Cargando...</p>
      </main>
    );
  }

  if (!pedido) {
    return (
      <main className="min-h-screen px-6 md:px-20 py-16">
        <p className="font-body text-vprs-gray">No se encontro el pedido.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-3xl">
      <Link href="/admin/pedidos" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver a pedidos
      </Link>

      <h1 className="font-display text-2xl mb-2">Pedido de {pedido.nombre}</h1>
      <p className="font-body text-xs text-vprs-gray mb-10">
        {new Date(pedido.created_at).toLocaleString("es-CO")}
        {pedido.bold_order_id ? ` · Ref. Bold: ${pedido.bold_order_id}` : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="card-vprs p-6">
          <h2 className="font-body font-medium mb-4">Cliente</h2>
          <p className="font-body text-sm text-vprs-gray">Cedula: {pedido.cedula}</p>
          <p className="font-body text-sm text-vprs-gray">Correo: {pedido.correo}</p>
          <p className="font-body text-sm text-vprs-gray">Telefono: {pedido.telefono}</p>
        </div>
        <div className="card-vprs p-6">
          <h2 className="font-body font-medium mb-4">Entrega</h2>
          <p className="font-body text-sm text-vprs-gray">{pedido.direccion}</p>
          <p className="font-body text-sm text-vprs-gray">
            {pedido.ciudad}, {pedido.departamento}
          </p>
        </div>
      </div>

      <div className="card-vprs p-6 mb-10">
        <h2 className="font-body font-medium mb-4">Productos</h2>
        <div className="space-y-3">
          {pedido.items.map((item, i) => (
            <div key={i} className="flex justify-between font-body text-sm">
              <span className="text-vprs-gray">
                {item.nombre}
                {item.saborNombre ? ` (${item.saborNombre})` : ""} x{item.cantidad}
              </span>
              <span>${(item.precio * item.cantidad).toLocaleString("es-CO")}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-body font-medium border-t border-vprs-black/10 pt-4 mt-4">
          <span>Total</span>
          <span>${pedido.total.toLocaleString("es-CO")}</span>
        </div>
      </div>

      <div className="card-vprs p-6">
        <h2 className="font-body font-medium mb-4">Estado</h2>
        <div className="flex flex-wrap gap-2">
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              type="button"
              disabled={guardando || pedido.estado === estado}
              onClick={() => cambiarEstado(estado)}
              className={`font-body text-xs px-4 py-2 rounded-full border transition-colors ${
                pedido.estado === estado
                  ? "bg-vprs-black text-white border-vprs-black"
                  : "border-vprs-black/20 hover:border-vprs-black"
              }`}
            >
              {ESTADO_LABELS[estado]}
            </button>
          ))}
        </div>
        {mensaje && <p className="font-body text-sm mt-4">{mensaje}</p>}
      </div>
    </main>
  );
}
