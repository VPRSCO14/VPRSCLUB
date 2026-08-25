import Link from "next/link";
import { getMaterialGradient } from "@/lib/materials";

type CategoryCardProps = {
  slug: string;
  nombre: string;
};

export default function CategoryCard({ slug, nombre }: CategoryCardProps) {
  return (
    <Link
      href={`/tienda/${slug}`}
      className="card-vprs relative block h-56 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: getMaterialGradient(slug) }}
      />
      <p className="absolute left-6 bottom-5 font-body font-medium text-vprs-white">
        {nombre}
      </p>
    </Link>
  );
}
