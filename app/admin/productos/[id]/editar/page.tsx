"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeftIcon } from "@/components/icons";
import VariantesEditor, { VarianteRow } from "@/components/admin/VariantesEditor";

type Categoria = { id: string; nombre: string };
type Marca = { id: string; nombre: string };

export default function EditarProducto() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [variantes, setVariantes] = useState<VarianteRow[]>([]);
  const [variantesOriginales, setVariantesOriginales] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria_id: "",
    marca_id: "",
    activo: true,
  });

  useEffect(() => {
    const cargar = async () => {
      const [{ data: cats }, { data: marcasData }, { data: producto }, { data: variantesData }] =
        await Promise.all([
          supabase.from("categorias").select("id, nombre").order("nombre"),
          supabase.from("marcas").select("id, nombre").order("nombre"),
          supabase
            .from("productos")
            .select("codigo, nombre, precio, stock, descripcion, categoria_id, marca_id, activo")
            .eq("id", id)
            .single(),
          supabase.from("producto_variantes").select("id, sabor_id, stock").eq("producto_id", id),
        ]);

      setCategorias(cats || []);
      setMarcas(marcasData || []);

      if (producto) {
        setForm({
          codigo: producto.codigo ?? "",
          nombre: producto.nombre ?? "",
          precio: String(producto.precio ?? ""),
          stock: String(producto.stock ?? ""),
          descripcion: producto.descripcion ?? "",
          categoria_id: producto.categoria_id ?? "",
          marca_id: producto.marca_id ?? "",
          activo: producto.activo ?? true,
        });
      }

      const filas = (variantesData || []).map((v) => ({
        id: v.id,
        sabor_id: v.sabor_id,
        stock: String(v.stock),
      }));
      setVariantes(filas);
      setVariantesOriginales(filas.map((f) => f.id!));

      setCargando(false);
    };
    cargar();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase
      .from("productos")
      .update({
        codigo: form.codigo,
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock, 10),
        descripcion: form.descripcion,
        categoria_id: form.categoria_id || null,
        marca_id: form.marca_id || null,
        activo: form.activo,
      })
      .eq("id", id);

    if (error) {
      setGuardando(false);
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    const filasVariantes = variantes.filter((v) => v.sabor_id);
    const idsActuales = filasVariantes.filter((v) => v.id).map((v) => v.id!);
    const idsAEliminar = variantesOriginales.filter((originalId) => !idsActuales.includes(originalId));
    const filasNuevas = filasVariantes.filter((v) => !v.id);
    const filasExistentes = filasVariantes.filter((v) => v.id);

    const [{ error: errorEliminar }, { error: errorNuevas }, ...resultadosActualizar] = await Promise.all([
      idsAEliminar.length > 0
        ? supabase.from("producto_variantes").delete().in("id", idsAEliminar)
        : Promise.resolve({ error: null }),
      filasNuevas.length > 0
        ? supabase.from("producto_variantes").insert(
            filasNuevas.map((v) => ({
              producto_id: id,
              sabor_id: v.sabor_id,
              stock: parseInt(v.stock, 10) || 0,
            }))
          )
        : Promise.resolve({ error: null }),
      ...filasExistentes.map((v) =>
        supabase
          .from("producto_variantes")
          .update({ sabor_id: v.sabor_id, stock: parseInt(v.stock, 10) || 0 })
          .eq("id", v.id!)
      ),
    ]);

    setGuardando(false);

    const errorActualizar = resultadosActualizar.find((r) => r.error)?.error;
    if (errorEliminar || errorNuevas || errorActualizar) {
      setMensaje(
        "Producto guardado, pero hubo un error con los sabores: " +
          (errorEliminar || errorNuevas || errorActualizar)?.message
      );
      return;
    }

    router.push("/admin/productos");
  };

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-body text-vprs-gray">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 max-w-2xl">
      <Link href="/admin/productos" className="font-body text-sm text-vprs-gray inline-flex items-center gap-2 mb-6">
        <ArrowLeftIcon size={14} />
        Volver a productos
      </Link>

      <h1 className="font-display text-2xl mb-8">Editar producto</h1>

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

        <label className="flex items-center gap-2 font-body text-sm">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
          />
          Visible en la tienda
        </label>

        {mensaje && <p className="font-body text-sm">{mensaje}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="btn-dark w-full"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}
