import Link from "next/link";
import { SearchIcon, UserIcon, CartIcon } from "./icons";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-20 py-7 border-b border-vprs-black/10">
      <Link href="/" className="font-display text-xl font-semibold tracking-wide">
        VPRS.CO
      </Link>

      <nav className="hidden md:flex items-center gap-9">
        <Link href="/" className="nav-link">
          Tienda
        </Link>
        <Link href="/#novedades" className="nav-link">
          Novedades
        </Link>
        <Link href="/#comunidad" className="nav-link">
          Comunidad
        </Link>
      </nav>

      <div className="flex items-center gap-5 text-vprs-black/70">
        <button aria-label="Buscar" className="hover:text-vprs-black transition-colors">
          <SearchIcon />
        </button>
        <Link href="/admin/login" aria-label="Cuenta" className="hover:text-vprs-black transition-colors">
          <UserIcon />
        </Link>
        <button aria-label="Carrito" className="hover:text-vprs-black transition-colors">
          <CartIcon />
        </button>
      </div>
    </header>
  );
}
