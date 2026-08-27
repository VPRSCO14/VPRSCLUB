import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { estadoDesdeEventoBold } from "@/lib/bold";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const firmaRecibida = request.headers.get("x-bold-signature") ?? "";
  const secretKey = process.env.BOLD_SECRET_KEY!;
  const apiKey = process.env.BOLD_API_KEY!;
  const bodyBase64 = Buffer.from(rawBody).toString("base64");

  const firmaEsperada = crypto.createHmac("sha256", secretKey).update(bodyBase64).digest("hex");

  if (firmaRecibida !== firmaEsperada) {
    let dataStr = "";
    let dataBase64 = "";
    try {
      const parsed = JSON.parse(rawBody);
      dataStr = JSON.stringify(parsed.data ?? {});
      dataBase64 = Buffer.from(dataStr).toString("base64");
    } catch {
      // ignore parse errors, dataStr stays empty
    }

    const candidatos = {
      hmac_hex_base64body_secret: firmaEsperada,
      hmac_hex_rawbody_secret: crypto.createHmac("sha256", secretKey).update(rawBody).digest("hex"),
      hmac_b64_base64body_secret: crypto.createHmac("sha256", secretKey).update(bodyBase64).digest("base64"),
      hmac_b64_rawbody_secret: crypto.createHmac("sha256", secretKey).update(rawBody).digest("base64"),
      hmac_hex_base64body_apikey: crypto.createHmac("sha256", apiKey).update(bodyBase64).digest("hex"),
      hmac_hex_rawbody_apikey: crypto.createHmac("sha256", apiKey).update(rawBody).digest("hex"),
      hmac_hex_data_secret: crypto.createHmac("sha256", secretKey).update(dataStr).digest("hex"),
      hmac_hex_base64data_secret: crypto.createHmac("sha256", secretKey).update(dataBase64).digest("hex"),
      hmac_hex_data_apikey: crypto.createHmac("sha256", apiKey).update(dataStr).digest("hex"),
      hmac_hex_base64data_apikey: crypto.createHmac("sha256", apiKey).update(dataBase64).digest("hex"),
    };
    console.log("[bold-webhook] firma recibida:", firmaRecibida);
    console.log("[bold-webhook] candidatos:", JSON.stringify(candidatos, null, 2));
    console.log("[bold-webhook] largo secretKey:", secretKey?.length ?? 0, "largo apiKey:", apiKey?.length ?? 0);
    console.log("[bold-webhook] cuerpo crudo:", rawBody);
    console.log("[bold-webhook] data field:", dataStr);
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
    .from("pedidos_tienda")
    .update({
      estado: nuevoEstado,
      bold_payment_id: evento?.data?.payment_id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("bold_order_id", referencia);

  if (nuevoEstado === "pagado") {
    const { data: pedido } = await supabaseAdmin
      .from("pedidos_tienda")
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
