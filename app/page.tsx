import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { getMaterialGradient } from "@/lib/materials";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre, slug, banner_url")
    .order("nombre");

  const { data: productos } = await supabase
    .from("productos")
    .select("id, nombre, precio, codigo")
    .eq("activo", true)
    .limit(8);

  const destacado = productos?.[0];

  return (
    <main className="min-h-screen">
      <section className="px-6 md:px-20 py-24 md:py-32 border-b border-vprs-black/10">
        <p className="font-body text-sm tracking-wide text-vprs-gray uppercase mb-4">
          VPRS.CO
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-medium max-w-2xl leading-tight">
          Disenado para descubrir.
        </h1>
        <p className="font-body text-vprs-gray mt-6 max-w-lg">
          No vendemos productos. Creamos un lugar al que quieras volver.
        </p>
        <Link href="/#novedades" className="btn-dark mt-10">
          Explorar tienda
        </Link>
      </section>

      <section className="px-6 md:px-20 py-16">
        <h2 className="font-display text-2xl mb-8">Categorias</h2>
        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2">
          {categorias?.map((cat) => (
            <CategoryCard
              key={cat.id}
              slug={cat.slug}
              nombre={cat.nombre}
              imagenUrl={cat.banner_url}
            />
          ))}
          {(!categorias || categorias.length === 0) && (
            <p className="font-body text-vprs-gray">
              Aun no hay categorias cargadas.
            </p>
          )}
        </div>
      </section>

      <section id="novedades" className="px-6 md:px-20 py-16 scroll-mt-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-2xl">Novedades</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productos?.map((prod) => (
            <ProductCard key={prod.id} id={prod.id} nombre={prod.nombre} precio={prod.precio} />
          ))}
          {(!productos || productos.length === 0) && (
            <p className="font-body text-vprs-gray">
              Aun no hay productos cargados.
            </p>
          )}
        </div>
      </section>

      {destacado && (
        <section className="px-6 md:px-20 py-16">
          <h2 className="font-display text-2xl mb-8">Recomendado por el equipo</h2>
          <div className="card-vprs grid md:grid-cols-2 gap-0 overflow-hidden items-center">
            <div
              className="aspect-[4/3]"
              style={{ backgroundImage: getMaterialGradient(destacado.id) }}
            />
            <div className="p-10 md:p-14">
              <p className="font-body text-xs tracking-wide uppercase mb-4 font-semibold vprs-accent-text">
                Elegido por el equipo
              </p>
              <h3 className="font-display text-2xl font-semibold mb-4">
                {destacado.nombre}
              </h3>
              <p className="font-body text-vprs-graphite mb-7 max-w-md leading-relaxed">
                El favorito del equipo esta temporada. Nos recuerda por qué
                empezamos esto.
              </p>
              <Link href={`/producto/${destacado.id}`} className="btn-ghost">
                Ver producto
              </Link>
            </div>
          </div>
        </section>
      )}

      <section id="comunidad" className="px-6 md:px-20 py-16 scroll-mt-20">
        <div className="bg-vprs-black rounded-vprs px-10 py-14 md:px-16 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl font-semibold text-vprs-white mb-3">
              VPRS Sessions
            </h3>
            <p className="font-body text-vprs-gray max-w-md leading-relaxed">
              Encuentros para probar lo nuevo, compartir historias y descubrir
              algo distinto. Siempre hay una razón para volver.
            </p>
          </div>
          <Link
            href="#"
            className="shrink-0 inline-flex items-center h-[52px] px-7 rounded-vprs border border-vprs-white/30 text-vprs-white font-body text-sm hover:border-vprs-white transition-colors"
          >
            Ver próximos encuentros
          </Link>
        </div>
      </section>
    </main>
  );
}
