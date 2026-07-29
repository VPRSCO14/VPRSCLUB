"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

      const perfil = (perfilUsuario as any)?.perfiles?.nombre_perfil;

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
          className="border border-vprs-gray/20 rounded-vprs p-6 hover:border-vprs-black transition-colors"
        >
          <p className="font-body font-medium">Agregar producto</p>
        </Link>
      </div>
    </main>
  );
}
