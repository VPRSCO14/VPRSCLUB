"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeftIcon, ChevronRightIcon } from "@/components/icons";
import { ESTADO_LABELS, type EstadoPedido } from "@/lib/bold";

type Pedido = {
  id: string;
  nombre: string;
  ciudad: string;
  departamento: string;
  total: number;
  estado: EstadoPedido;
  created_at: string;
};

const ESTADO_ESTILOS: Record<EstadoPedido, string> = {
  pendiente: "bg-vprs-black/5 text-vprs-gray",
  pagado: "bg-vprs-accent text-white",
  enviado: "bg-vprs-accent text-white",
  entregado: "bg-vprs-accent text-white",
  fallido: "bg-red-100 text-red-700",
  reembolsado: "bg-red-100 text-red-700",
};

export default function ListaPedidos() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        router.push("/admin/login");
        return;
      }

      const { data } = await supabase
        .from("pedidos_tienda")
        .select("id, nombre, ciudad, departamento, total, estado, created_at")
        .order("created_at", { ascending: false });

      setPedidos((data ?? []) as Pedido[]);
      setCargando(false);
    };
    cargar();
  }, [router]);

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-body text-vprs-gray">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <Link href="/admin" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver al panel
      </Link>

      <h1 className="font-display text-2xl mb-10">Pedidos</h1>

      <div className="rounded-vprs border border-vprs-black/10 divide-y divide-vprs-black/10">
        {pedidos.map((pedido) => (
          <Link
            key={pedido.id}
            href={`/admin/pedidos/${pedido.id}`}
            className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-vprs-black/5 transition-colors"
          >
            <div className="min-w-0">
              <p className="font-body font-medium truncate">{pedido.nombre}</p>
              <p className="font-body text-xs text-vprs-gray mt-1">
                {pedido.ciudad}, {pedido.departamento} ·{" "}
                {new Date(pedido.created_at).toLocaleDateString("es-CO")}
              </p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <p className="font-body text-sm">${pedido.total.toLocaleString("es-CO")}</p>
              <span className={`font-body text-xs px-3 py-1 rounded-full ${ESTADO_ESTILOS[pedido.estado]}`}>
                {ESTADO_LABELS[pedido.estado]}
              </span>
              <ChevronRightIcon className="text-vprs-gray" size={16} />
            </div>
          </Link>
        ))}
        {pedidos.length === 0 && (
          <p className="font-body text-vprs-gray px-6 py-8">Aun no hay pedidos.</p>
        )}
      </div>
    </main>
  );
}
