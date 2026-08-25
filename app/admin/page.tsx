"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlusIcon, CartIcon, UserIcon } from "@/components/icons";

type PerfilUsuario = {
  perfil_id: string;
  perfiles: { nombre_perfil: string } | { nombre_perfil: string }[] | null;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [nombrePerfil, setNombrePerfil] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificar = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const usuario = sessionData.session?.user;

      if (!usuario) {
        router.push("/admin/login");
        return;
      }

      const { data: perfilUsuario } = await supabase
        .from("usuarios")
        .select("perfil_id, perfiles(nombre_perfil)")
        .eq("id", usuario.id)
        .single();

      const perfilData = perfilUsuario as PerfilUsuario | null;
      const perfilRel = Array.isArray(perfilData?.perfiles)
        ? perfilData?.perfiles[0]
        : perfilData?.perfiles;
      const perfil = perfilRel?.nombre_perfil;

      if (!perfil || perfil === "cliente") {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setNombrePerfil(perfil);
      setCargando(false);
    };

    verificar();
  }, [router]);

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-body text-vprs-gray">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-20 py-16">
      <h1 className="font-display text-2xl mb-2">Panel VPRS.CO</h1>
      <p className="font-body text-vprs-gray mb-10">
        Perfil: {nombrePerfil}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/productos/nuevo"
          className="card-vprs p-6 block"
        >
          <PlusIcon className="mb-4" />
          <p className="font-body font-medium">Agregar producto</p>
        </Link>

        <Link
          href="/admin/categorias/nueva"
          className="card-vprs p-6 block"
        >
          <PlusIcon className="mb-4" />
          <p className="font-body font-medium">Agregar categoria</p>
        </Link>

        <div className="rounded-vprs border border-vprs-black/10 p-6 text-vprs-gray/50">
          <CartIcon className="mb-4" />
          <p className="font-body font-medium mb-1">Pedidos</p>
          <p className="font-body text-xs">Próximamente</p>
        </div>

        <div className="rounded-vprs border border-vprs-black/10 p-6 text-vprs-gray/50">
          <UserIcon className="mb-4" />
          <p className="font-body font-medium mb-1">Clientes</p>
          <p className="font-body text-xs">Próximamente</p>
        </div>
      </div>
    </main>
  );
}
