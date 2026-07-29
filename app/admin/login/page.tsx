"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: correo,
      password: clave,
    });

    if (loginError) {
      setError("Correo o contrasena incorrectos.");
      setCargando(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-vprs-white px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm border border-vprs-gray/20 rounded-vprs p-8"
      >
        <h1 className="font-display text-2xl mb-6">Panel VPRS.CO</h1>

        <label className="font-body text-sm block mb-2">Correo</label>
        <input
          type="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full h-14 rounded-vprs border border-vprs-gray/30 px-4 mb-4 font-body"
        />

        <label className="font-body text-sm block mb-2">Contrasena</label>
        <input
          type="password"
          required
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="w-full h-14 rounded-vprs border border-vprs-gray/30 px-4 mb-4 font-body"
        />

        {error && (
          <p className="text-red-600 text-sm font-body mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full h-14 rounded-vprs bg-vprs-black text-vprs-white font-body font-medium disabled:opacity-50"
        >
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
