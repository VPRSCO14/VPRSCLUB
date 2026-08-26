"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlusIcon, XIcon } from "@/components/icons";

export type VarianteRow = {
  id?: string;
  sabor_id: string;
  stock: string;
};

type Sabor = { id: string; nombre: string };

type VariantesEditorProps = {
  variantes: VarianteRow[];
  onChange: (variantes: VarianteRow[]) => void;
};

export default function VariantesEditor({ variantes, onChange }: VariantesEditorProps) {
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [creandoSabor, setCreandoSabor] = useState(false);
  const [nuevoSabor, setNuevoSabor] = useState("");
  const [guardandoSabor, setGuardandoSabor] = useState(false);
  const [errorSabor, setErrorSabor] = useState("");

  useEffect(() => {
    const cargarSabores = async () => {
      const { data } = await supabase.from("sabores").select("id, nombre").order("nombre");
      setSabores(data || []);
    };
    cargarSabores();
  }, []);

  const actualizarFila = (index: number, cambios: Partial<VarianteRow>) => {
    const copia = [...variantes];
    copia[index] = { ...copia[index], ...cambios };
    onChange(copia);
  };

  const agregarFila = () => {
    onChange([...variantes, { sabor_id: "", stock: "0" }]);
  };

  const quitarFila = (index: number) => {
    onChange(variantes.filter((_, i) => i !== index));
  };

  const crearSabor = async () => {
    if (!nuevoSabor.trim()) return;
    setGuardandoSabor(true);
    setErrorSabor("");

    const { data, error } = await supabase
      .from("sabores")
      .insert({ nombre: nuevoSabor.trim() })
      .select("id, nombre")
      .single();

    setGuardandoSabor(false);

    if (error || !data) {
      setErrorSabor("Error al crear sabor: " + (error?.message ?? "sin datos"));
      return;
    }

    setSabores([...sabores, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    onChange([...variantes, { sabor_id: data.id, stock: "0" }]);
    setNuevoSabor("");
    setCreandoSabor(false);
  };

  return (
    <div>
      <label className="font-body text-sm block mb-2">Sabores y existencias</label>

      {variantes.length > 0 && (
        <div className="space-y-3 mb-3">
          {variantes.map((fila, index) => (
            <div key={index} className="flex items-center gap-3">
              <select
                value={fila.sabor_id}
                onChange={(e) => actualizarFila(index, { sabor_id: e.target.value })}
                className="input-vprs flex-1"
              >
                <option value="">Selecciona un sabor</option>
                {sabores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                value={fila.stock}
                onChange={(e) => actualizarFila(index, { stock: e.target.value })}
                className="input-vprs w-28"
                placeholder="Stock"
              />
              <button
                type="button"
                onClick={() => quitarFila(index)}
                aria-label="Quitar sabor"
                className="text-vprs-gray hover:text-vprs-black transition-colors shrink-0"
              >
                <XIcon size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {creandoSabor ? (
        <div className="mb-3">
          <div className="flex items-center gap-3">
            <input
              value={nuevoSabor}
              onChange={(e) => setNuevoSabor(e.target.value)}
              placeholder="Nombre del nuevo sabor"
              className="input-vprs flex-1"
            />
            <button
              type="button"
              onClick={crearSabor}
              disabled={guardandoSabor}
              className="font-body text-sm px-4 py-2 rounded-vprs bg-vprs-black text-white shrink-0"
            >
              {guardandoSabor ? "..." : "Crear"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCreandoSabor(false);
                setNuevoSabor("");
                setErrorSabor("");
              }}
              aria-label="Cancelar"
              className="text-vprs-gray hover:text-vprs-black transition-colors shrink-0"
            >
              <XIcon size={16} />
            </button>
          </div>
          {errorSabor && (
            <p className="font-body text-xs text-vprs-accent mt-2">{errorSabor}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={agregarFila}
            className="flex items-center gap-2 font-body text-sm text-vprs-graphite hover:text-vprs-black transition-colors"
          >
            <PlusIcon size={16} />
            Agregar sabor
          </button>
          <button
            type="button"
            onClick={() => setCreandoSabor(true)}
            className="font-body text-sm text-vprs-gray hover:text-vprs-black transition-colors underline"
          >
            Crear sabor nuevo
          </button>
        </div>
      )}

      <p className="font-body text-xs text-vprs-gray mt-2">
        Opcional. Si el producto no tiene sabores, se usa el stock general de arriba.
      </p>
    </div>
  );
}
