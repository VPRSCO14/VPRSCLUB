import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre, slug")
    .order("nombre");

  const { data: productos } = await supabase
    .from("productos")
    .select("id, nombre, precio, codigo")
    .eq("activo", true)
    .limit(8);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-20 py-24 md:py-32 border-b border-vprs-gray/20">
        <p className="font-body text-sm tracking-wide text-vprs-gray uppercase mb-4">
          VPRS.CO
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-medium max-w-2xl leading-tight">
          Disenado para descubrir.
        </h1>
        <p className="font-body text-vprs-gray mt-6 max-w-lg">
          No vendemos productos. Creamos un lugar al que quieras volver.
        </p>
      </section>

      {/* Categorias */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="font-display text-2xl mb-8">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categorias?.map((cat) => (
            <div
              key={cat.id}
              className="border border-vprs-gray/20 rounded-vprs p-6 hover:border-vprs-black transition-colors"
            >
              <p className="font-body font-medium">{cat.nombre}</p>
            </div>
          ))}
          {(!categorias || categorias.length === 0) && (
            <p className="font-body text-vprs-gray">
              Aun no hay categorias cargadas.
            </p>
          )}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="font-display text-2xl mb-8">Productos destacados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productos?.map((prod) => (
            <div key={prod.id} className="rounded-vprs border border-vprs-gray/20 overflow-hidden">
              <div className="aspect-square bg-vprs-graphite/5" />
              <div className="p-4">
                <p className="font-body font-medium text-sm">{prod.nombre}</p>
                <p className="font-body text-vprs-gray text-sm mt-1">
                  ${prod.precio.toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          ))}
          {(!productos || productos.length === 0) && (
            <p className="font-body text-vprs-gray">
              Aun no hay productos cargados.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
