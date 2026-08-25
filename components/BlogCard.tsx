import Link from "next/link";
import { getMaterialGradient } from "@/lib/materials";

type BlogCardProps = {
  slug: string;
  titulo: string;
  resumen: string | null;
  imagenUrl: string | null;
  publicadoEn: string;
};

export default function BlogCard({ slug, titulo, resumen, imagenUrl, publicadoEn }: BlogCardProps) {
  const fecha = new Date(publicadoEn).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/blog/${slug}`} className="card-vprs block overflow-hidden group">
      <div
        className="aspect-[16/9] transition-transform duration-300 group-hover:scale-[1.015] bg-cover bg-center"
        style={{
          backgroundImage: imagenUrl ? `url(${imagenUrl})` : getMaterialGradient(slug),
        }}
      />
      <div className="p-5">
        <p className="font-body text-xs text-vprs-gray uppercase mb-2">{fecha}</p>
        <p className="font-body font-medium">{titulo}</p>
        {resumen && (
          <p className="font-body text-sm text-vprs-gray mt-2 line-clamp-2">{resumen}</p>
        )}
      </div>
    </Link>
  );
}
