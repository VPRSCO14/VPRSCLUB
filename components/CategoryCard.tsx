import Link from "next/link";
import { getMaterialGradient } from "@/lib/materials";

type CategoryCardProps = {
  slug: string;
  nombre: string;
  imagenUrl?: string | null;
};

export default function CategoryCard({ slug, nombre, imagenUrl }: CategoryCardProps) {
  return (
    <Link
      href={`/tienda/${slug}`}
      className="shrink-0 relative block w-36 h-24 md:w-44 md:h-28 rounded-vprs overflow-hidden group"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: imagenUrl ? `url(${imagenUrl})` : getMaterialGradient(slug),
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      <p className="absolute left-3 bottom-2 font-body text-xs font-medium text-vprs-white">
        {nombre}
      </p>
    </Link>
  );
}
