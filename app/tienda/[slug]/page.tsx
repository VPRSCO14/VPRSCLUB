import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductGrid from "@/components/ProductGrid";
import { ArrowLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function PaginaCategoria({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: categoria } = await supabase
    .from("categorias")
    .select("id, nombre, slug, banner_url")
    .eq("slug", slug)
    .single();

  if (!categoria) {
    notFound();
  }

  const { data: productos } = await supabase
    .from("productos")
    .select("id, nombre, precio")
    .eq("categoria_id", categoria!.id)
    .eq("activo", true);

  return (
    <main className="min-h-screen">
      <section className="px-6 md:px-20 py-16 border-b border-vprs-black/10">
        <Link href="/" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2">
          <ArrowLeftIcon size={14} />
          Volver al inicio
        </Link>
        <h1 className="font-display text-3xl md:text-5xl mt-4">
          {categoria!.nombre}
        </h1>
      </section>

      <section className="px-6 md:px-20 py-16">
        <ProductGrid productos={productos ?? []} />
      </section>
    </main>
  );
}
