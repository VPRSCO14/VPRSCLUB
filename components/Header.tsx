import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SearchIcon, UserIcon, CartIcon, ChevronDownIcon } from "./icons";

const NAV_CATEGORIAS = [
  { label: "Vape Desechable", nombre: "Desechables" },
  { label: "Vape Recargable", nombre: "Recargables" },
  { label: "Líquidos de Vapeo", nombre: "Sales" },
  { label: "Parafernalia", nombre: "Parafernalia" },
];

export default async function Header() {
  const { data: categorias } = await supabase
    .from("categorias")
    .select("nombre, slug")
    .in(
      "nombre",
      NAV_CATEGORIAS.map((c) => c.nombre)
    );

  const navItems = NAV_CATEGORIAS.map((item) => {
    const categoria = categorias?.find((c) => c.nombre === item.nombre);
    return categoria ? { label: item.label, slug: categoria.slug } : null;
  }).filter((item): item is { label: string; slug: string } => item !== null);

  return (
    <header className="flex items-center justify-between px-6 md:px-20 py-7 bg-vprs-black border-b border-vprs-white/10">
      <Link href="/" className="font-display text-xl font-semibold tracking-wide text-vprs-white shrink-0">
        VPRS.CO
      </Link>

      <nav className="hidden xl:flex items-center gap-9">
        {navItems.map((item) => (
          <Link
            key={item.slug}
            href={`/tienda/${item.slug}`}
            className="nav-link flex items-center gap-1 whitespace-nowrap text-vprs-white/70 hover:text-vprs-white"
          >
            {item.label}
            <ChevronDownIcon />
          </Link>
        ))}
        <Link
          href="/blog"
          className="nav-link whitespace-nowrap text-vprs-white/70 hover:text-vprs-white"
        >
          Blog
        </Link>
      </nav>

      <div className="flex items-center gap-5 text-vprs-white/70 shrink-0">
        <button aria-label="Buscar" className="hover:text-vprs-white transition-colors">
          <SearchIcon />
        </button>
        <Link href="/admin/login" aria-label="Cuenta" className="hover:text-vprs-white transition-colors">
          <UserIcon />
        </Link>
        <button aria-label="Carrito" className="hover:text-vprs-white transition-colors">
          <CartIcon />
        </button>
      </div>
    </header>
  );
}
