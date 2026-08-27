import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ItemRecibido = {
  productoId: string;
  nombre: string;
  cantidad: number;
  saborId?: string;
  saborNombre?: string;
};

export async function POST(request: Request) {
  const body = await request.json();
  const { nombre, cedula, correo, telefono, direccion, ciudad, departamento, items } = body as {
    nombre: string;
    cedula: string;
    correo: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    items: ItemRecibido[];
  };

  if (
    !nombre || !cedula || !correo || !telefono || !direccion || !ciudad || !departamento ||
    !Array.isArray(items) || items.length === 0
  ) {
    return NextResponse.json({ error: "Faltan datos del cliente o el carrito esta vacio." }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const productoIds = [...new Set(items.map((item) => item.productoId))];
  const { data: productos, error: errorProductos } = await supabaseAdmin
    .from("productos")
    .select("id, nombre, precio, activo")
    .in("id", productoIds);

  if (errorProductos || !productos) {
    return NextResponse.json({ error: "No se pudieron validar los productos." }, { status: 500 });
  }

  const precios = new Map(productos.map((p) => [p.id, p]));

  const itemsValidados: (ItemRecibido & { precio: number })[] = [];
  for (const item of items) {
    const producto = precios.get(item.productoId);
    if (!producto || !producto.activo) {
      return NextResponse.json(
        { error: `El producto "${item.nombre}" ya no esta disponible.` },
        { status: 400 }
      );
    }
    itemsValidados.push({ ...item, precio: producto.precio });
  }

  const total = itemsValidados.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const { data: pedido, error: errorPedido } = await supabaseAdmin
    .from("pedidos_tienda")
    .insert({
      nombre,
      cedula,
      correo,
      telefono,
      direccion,
      ciudad,
      departamento,
      items: itemsValidados,
      subtotal: total,
      total,
      estado: "pendiente",
    })
    .select("id")
    .single();

  if (errorPedido || !pedido) {
    return NextResponse.json({ error: "No se pudo crear el pedido." }, { status: 500 });
  }

  const orderReference = pedido.id as string;
  const amount = Math.round(total);
  const currency = "COP";

  const apiKey = process.env.BOLD_API_KEY!;
  const secretKey = process.env.BOLD_SECRET_KEY!;
  const integritySignature = crypto
    .createHash("sha256")
    .update(`${orderReference}${amount}${currency}${secretKey}`)
    .digest("hex");

  await supabaseAdmin.from("pedidos_tienda").update({ bold_order_id: orderReference }).eq("id", pedido.id);

  const origin = new URL(request.url).origin;

  return NextResponse.json({
    orderReference,
    amount,
    currency,
    apiKey,
    integritySignature,
    description: `Pedido VPRS ${orderReference.slice(0, 8)}`,
    redirectionUrl: `${origin}/checkout/confirmacion`,
    originUrl: origin,
    customerData: { email: correo, fullName: nombre, phone: telefono },
    billingAddress: { address: direccion, city: ciudad, state: departamento, country: "CO" },
  });
}
