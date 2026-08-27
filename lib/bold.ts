export type EstadoPedido =
  | "pendiente"
  | "pagado"
  | "enviado"
  | "entregado"
  | "fallido"
  | "reembolsado";

export function estadoDesdeEventoBold(tipo: string): EstadoPedido | null {
  const valor = tipo.toUpperCase();

  if (valor === "SALE_APPROVED" || valor === "APPROVED") return "pagado";
  if (valor === "PENDING" || valor === "PROCESSING") return "pendiente";
  if (valor === "VOID_APPROVED" || valor === "VOIDED") return "reembolsado";
  if (valor === "SALE_REJECTED" || valor === "REJECTED" || valor === "FAILED") return "fallido";

  return null;
}

export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  pendiente: "Pendiente de pago",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  fallido: "Fallido",
  reembolsado: "Reembolsado",
};
