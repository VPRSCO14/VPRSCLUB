import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { estadoDesdeEventoBold } from "@/lib/bold";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const firmaRecibida = request.headers.get("x-bold-signature") ?? "";
  const secretKey = process.env.BOLD_SECRET_KEY!;

  const firmaEsperada = crypto
    .createHmac("sha256", secretKey)
    .update(Buffer.from(rawBody).toString("base64"))
    .digest("hex");

  if (firmaRecibida !== firmaEsperada) {
    return NextResponse.json({ error: "Firma invalida." }, { status: 401 });
  }

  const evento = JSON.parse(rawBody);
  const nuevoEstado = estadoDesdeEventoBold(evento.type ?? "");
  const referencia = evento?.data?.metadata?.reference;

  if (!nuevoEstado || !referencia) {
    return NextResponse.json({ recibido: true });
  }

  const supabaseAdmin = getSupabaseAdmin();

  await supabaseAdmin
    .from("pedidos")
    .update({
      estado: nuevoEstado,
      bold_payment_id: evento?.data?.payment_id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("bold_order_id", referencia);

  if (nuevoEstado === "pagado") {
    const { data: pedido } = await supabaseAdmin
      .from("pedidos")
      .select("items")
      .eq("bold_order_id", referencia)
      .single();

    type ItemPedido = { productoId: string; saborId?: string; cantidad: number };
    const items = (pedido?.items ?? []) as ItemPedido[];

    for (const item of items) {
      if (item.saborId) {
        const { data: variante } = await supabaseAdmin
          .from("producto_variantes")
          .select("id, stock")
          .eq("id", item.saborId)
          .single();
        if (variante) {
          await supabaseAdmin
            .from("producto_variantes")
            .update({ stock: Math.max(0, variante.stock - item.cantidad) })
            .eq("id", variante.id);
        }
      } else {
        const { data: producto } = await supabaseAdmin
          .from("productos")
          .select("stock")
          .eq("id", item.productoId)
          .single();
        if (producto) {
          await supabaseAdmin
            .from("productos")
            .update({ stock: Math.max(0, producto.stock - item.cantidad) })
            .eq("id", item.productoId);
        }
      }
    }
  }

  return NextResponse.json({ recibido: true });
}
