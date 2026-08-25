import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeftIcon } from "@/components/icons";
import { getMaterialGradient } from "@/lib/materials";

export const dynamic = "force-dynamic";

export default async function PaginaArticulo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: articulo } = await supabase
    .from("articulos")
    .select("titulo, slug, resumen, contenido, imagen_url, autor, publicado_en, publicado")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (!articulo) {
    notFound();
  }

  const fecha = new Date(articulo.publicado_en).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-3xl mx-auto">
      <Link href="/blog" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2">
        <ArrowLeftIcon size={14} />
        Volver al blog
      </Link>

      <div
        className="aspect-[16/9] rounded-vprs mt-8 bg-cover bg-center"
        style={{
          backgroundImage: articulo.imagen_url ? `url(${articulo.imagen_url})` : getMaterialGradient(articulo.slug),
        }}
      />

      <p className="font-body text-sm text-vprs-gray uppercase mt-8 mb-2">
        {fecha}
        {articulo.autor ? ` · ${articulo.autor}` : ""}
      </p>
      <h1 className="font-display text-3xl md:text-4xl mb-8">{articulo.titulo}</h1>

      <div className="font-body text-vprs-graphite space-y-4 whitespace-pre-line leading-relaxed">
        {articulo.contenido}
      </div>
    </main>
  );
}
