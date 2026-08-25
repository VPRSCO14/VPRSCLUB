import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 md:px-20 py-12 border-t border-vprs-black/10 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <p className="font-body text-sm text-vprs-gray">
          VPRS.CO
        </p>
        <nav className="flex items-center gap-7">
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
        <Link
          href="/admin/login"
          className="font-body text-xs text-vprs-gray/60 hover:text-vprs-gray"
        >
          Acceso equipo
        </Link>
      </div>
    </footer>
  );
}
