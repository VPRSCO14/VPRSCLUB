import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BlogCard from "@/components/BlogCard";
import { ArrowLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function PaginaBlog() {
  const { data: articulos } = await supabase
    .from("articulos")
    .select("id, titulo, slug, resumen, imagen_url, publicado_en")
    .eq("publicado", true)
    .order("publicado_en", { ascending: false });

  return (
    <main className="min-h-screen">
      <section className="px-6 md:px-20 py-16 border-b border-vprs-black/10">
        <Link href="/" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2">
          <ArrowLeftIcon size={14} />
          Volver al inicio
        </Link>
        <h1 className="font-display text-3xl md:text-5xl mt-4">Blog</h1>
      </section>

      <section className="px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articulos?.map((articulo) => (
            <BlogCard
              key={articulo.id}
              slug={articulo.slug}
              titulo={articulo.titulo}
              resumen={articulo.resumen}
              imagenUrl={articulo.imagen_url}
              publicadoEn={articulo.publicado_en}
            />
          ))}
          {(!articulos || articulos.length === 0) && (
            <p className="font-body text-vprs-gray col-span-full">
              Aun no hay articulos publicados.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
