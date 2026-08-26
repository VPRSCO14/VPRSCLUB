"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import VariantesEditor, { VarianteRow } from "@/components/admin/VariantesEditor";

type Categoria = { id: string; nombre: string };
type Marca = { id: string; nombre: string };
type TipoProducto = { id: string; nombre: string; prefijo: string; digitos: number; consecutivo: number };

export default function NuevoProducto() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [tipos, setTipos] = useState<TipoProducto[]>([]);
  const [variantes, setVariantes] = useState<VarianteRow[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    tipo_producto_id: "",
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
      const { data: tiposData } = await supabase
        .from("tipos_producto")
        .select("id, nombre, prefijo, digitos, consecutivo")
        .order("nombre");
      setCategorias(cats || []);
      setMarcas(marcasData || []);
      setTipos(tiposData || []);
    };
    cargarListas();
  }, []);

  const tipoSeleccionado = tipos.find((t) => t.id === form.tipo_producto_id);
  const codigoPreview = tipoSeleccionado
    ? tipoSeleccionado.prefijo + String(tipoSeleccionado.consecutivo + 1).padStart(tipoSeleccionado.digitos, "0")
    : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.tipo_producto_id) {
      setMensaje("Selecciona un tipo de producto para generar el codigo.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { data: tipoActual, error: errorTipo } = await supabase
      .from("tipos_producto")
      .select("prefijo, digitos, consecutivo")
      .eq("id", form.tipo_producto_id)
      .single();

    if (errorTipo || !tipoActual) {
      setGuardando(false);
      setMensaje("Error al leer el tipo de producto: " + errorTipo?.message);
      return;
    }

    const siguienteConsecutivo = tipoActual.consecutivo + 1;
    const codigo = tipoActual.prefijo + String(siguienteConsecutivo).padStart(tipoActual.digitos, "0");

    const { data: producto, error } = await supabase
      .from("productos")
      .insert({
        codigo,
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

    await supabase
      .from("tipos_producto")
      .update({ consecutivo: siguienteConsecutivo })
      .eq("id", form.tipo_producto_id);

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
    setMensaje(`Producto guardado correctamente con el codigo ${codigo}.`);
    setTipos(
      tipos.map((t) =>
        t.id === form.tipo_producto_id ? { ...t, consecutivo: siguienteConsecutivo } : t
      )
    );
    setForm({
      tipo_producto_id: "",
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
          <label className="font-body text-sm block mb-2">Tipo de producto</label>
          <select
            name="tipo_producto_id"
            required
            value={form.tipo_producto_id}
            onChange={handleChange}
            className="input-vprs"
          >
            <option value="">Selecciona un tipo de producto</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
          <p className="font-body text-xs text-vprs-gray mt-2">
            {tipoSeleccionado
              ? `El codigo de este producto sera: ${codigoPreview}`
              : "El codigo se genera solo, segun el tipo de producto."}
          </p>
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
