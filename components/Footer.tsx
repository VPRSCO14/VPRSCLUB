import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 md:px-20 py-12 border-t border-vprs-gray/20 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="font-body text-sm text-vprs-gray">
          VPRS.CO
        </p>
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
