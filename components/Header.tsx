import Link from "next/link";
import { SearchIcon, UserIcon, CartIcon } from "./icons";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-20 py-7 bg-vprs-black border-b border-vprs-white/10">
      <Link href="/" className="font-display text-xl font-semibold tracking-wide text-vprs-white">
        VPRS.CO
      </Link>

      <nav className="hidden md:flex items-center gap-9">
        <Link href="/" className="nav-link text-vprs-white/70 hover:text-vprs-white">
          Tienda
        </Link>
        <Link href="/#novedades" className="nav-link text-vprs-white/70 hover:text-vprs-white">
          Novedades
        </Link>
        <Link href="/#comunidad" className="nav-link text-vprs-white/70 hover:text-vprs-white">
          Comunidad
        </Link>
      </nav>

      <div className="flex items-center gap-5 text-vprs-white/70">
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
