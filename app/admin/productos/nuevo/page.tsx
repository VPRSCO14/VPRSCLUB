"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import VariantesEditor, { VarianteRow } from "@/components/admin/VariantesEditor";

type Categoria = { id: string; nombre: string };
type Marca = { id: string; nombre: string };

export default function NuevoProducto() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [variantes, setVariantes] = useState<VarianteRow[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria_id: "",
    marca_id: "",
  });

  useEffect(() => {
    const cargarListas = async () => {
      const { data: cats } = await supabase.from("categorias").select("id, nombre").order("nombre");
      const { data: marcasData } = await supabase.from("marcas").select("id, nombre").order("nombre");
      setCategorias(cats || []);
      setMarcas(marcasData || []);
    };
    cargarListas();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { data: producto, error } = await supabase
      .from("productos")
      .insert({
        codigo: form.codigo,
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock, 10),
        descripcion: form.descripcion,
        categoria_id: form.categoria_id || null,
        marca_id: form.marca_id || null,
      })
      .select("id")
      .single();

    if (error || !producto) {
      setGuardando(false);
      setMensaje("Error al guardar: " + error?.message);
      return;
    }

    const filasVariantes = variantes.filter((v) => v.sabor_id);
    if (filasVariantes.length > 0) {
      const { error: errorVariantes } = await supabase.from("producto_variantes").insert(
        filasVariantes.map((v) => ({
          producto_id: producto.id,
          sabor_id: v.sabor_id,
          stock: parseInt(v.stock, 10) || 0,
        }))
      );

      if (errorVariantes) {
        setGuardando(false);
        setMensaje("Producto guardado, pero hubo un error con los sabores: " + errorVariantes.message);
        return;
      }
    }

    setGuardando(false);
    setMensaje("Producto guardado correctamente.");
    setForm({
      codigo: "",
      nombre: "",
      precio: "",
      stock: "",
      descripcion: "",
      categoria_id: "",
      marca_id: "",
    });
    setVariantes([]);
  };

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-2xl">
      <h1 className="font-display text-2xl mb-8">Agregar producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-body text-sm block mb-2">Codigo</label>
          <input
            name="codigo"
            required
            value={form.codigo}
            onChange={handleChange}
            className="input-vprs"
          />
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Nombre</label>
          <input
            name="nombre"
            required
            value={form.nombre}
            onChange={handleChange}
            className="input-vprs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm block mb-2">Precio</label>
            <input
              name="precio"
              type="number"
              required
              value={form.precio}
              onChange={handleChange}
              className="input-vprs"
            />
          </div>
          <div>
            <label className="font-body text-sm block mb-2">Stock</label>
            <input
              name="stock"
              type="number"
              required
              value={form.stock}
              onChange={handleChange}
              className="input-vprs"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Categoria</label>
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            className="input-vprs"
          >
            <option value="">Selecciona una categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Marca</label>
          <select
            name="marca_id"
            value={form.marca_id}
            onChange={handleChange}
            className="input-vprs"
          >
            <option value="">Selecciona una marca</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-body text-sm block mb-2">Descripcion</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className="textarea-vprs"
          />
        </div>

        <VariantesEditor variantes={variantes} onChange={setVariantes} />

        {mensaje && <p className="font-body text-sm">{mensaje}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="btn-dark w-full"
        >
          {guardando ? "Guardando..." : "Guardar producto"}
        </button>
      </form>
    </main>
  );
}
