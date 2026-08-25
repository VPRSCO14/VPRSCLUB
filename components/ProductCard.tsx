import Link from "next/link";
import { getMaterialGradient } from "@/lib/materials";

type ProductCardProps = {
  id: string;
  nombre: string;
  precio: number;
};

export default function ProductCard({ id, nombre, precio }: ProductCardProps) {
  return (
    <Link
      href={`/producto/${id}`}
      className="card-vprs block overflow-hidden group"
    >
      <div
        className="aspect-square transition-transform duration-300 group-hover:scale-[1.015]"
        style={{ backgroundImage: getMaterialGradient(id) }}
      />
      <div className="p-4">
        <p className="font-body font-medium text-sm">{nombre}</p>
        <p className="font-body font-semibold text-sm text-vprs-gray mt-1">
          ${precio.toLocaleString("es-CO")}
        </p>
      </div>
    </Link>
  );
}
