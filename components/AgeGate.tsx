"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "vprs_age_gate";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

type Step = "checking" | "gate" | "form" | "blocked" | "done";

function isAdult(day: number, month: number, year: number) {
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age >= 18;
}

export default function AgeGate() {
  const [step, setStep] = useState<Step>("checking");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "verified") {
      setStep("done");
    } else if (stored === "blocked") {
      setStep("blocked");
    } else {
      setStep("gate");
    }
  }, []);

  useEffect(() => {
    if (step === "checking" || step === "done") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [step]);

  function block() {
    window.localStorage.setItem(STORAGE_KEY, "blocked");
    setStep("blocked");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!day || !month || !year) {
      setFormError("Por favor completa tu fecha de nacimiento.");
      return;
    }
    if (!idNumber.trim()) {
      setFormError("Por favor ingresa tu número de identificación.");
      return;
    }
    if (!isAdult(Number(day), Number(month), Number(year))) {
      block();
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, "verified");
    setStep("done");
  }

  if (step === "checking" || step === "done") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 bg-[radial-gradient(circle_at_50%_0%,rgba(110,31,43,0.12),transparent_60%)] bg-vprs-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-vprs bg-white shadow-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-vprs-black to-vprs-accent" />

        <div className="px-8 pt-8 pb-8">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full border-2 border-vprs-accent flex items-center justify-center">
              <span className="font-display text-sm font-bold tracking-wide text-vprs-black">
                VPRS.CO
              </span>
            </div>
          </div>

          {step === "gate" && (
            <>
              <div className="rounded-vprs border border-vprs-black/10 p-5 mb-6 flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-vprs-accent text-white flex items-center justify-center font-display text-sm font-bold">
                  18+
                </div>
                <div>
                  <p className="font-body text-xs tracking-wide uppercase text-vprs-gray font-semibold mb-1">
                    Acceso regulado
                  </p>
                  <h2 className="font-display text-2xl font-semibold mb-2">
                    Verificación de edad obligatoria
                  </h2>
                  <p className="font-body text-sm text-vprs-gray">
                    Este sitio es exclusivo para mayores de 18 años.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {["Mayoría de edad", "Validación segura", "Revisión checkout"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-vprs-black/10 px-4 py-2 font-body text-xs text-vprs-black"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-vprs-accent" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex-1 rounded-vprs bg-vprs-black text-white font-body font-medium py-3 hover:bg-vprs-graphite transition-colors ring-2 ring-vprs-accent/40 ring-offset-2"
                >
                  Sí, soy mayor de 18
                </button>
                <button
                  type="button"
                  onClick={block}
                  className="flex-1 rounded-vprs border border-vprs-black/15 text-vprs-black font-body font-medium py-3 hover:bg-vprs-black/5 transition-colors"
                >
                  No, soy menor de 18
                </button>
              </div>

              <p className="font-body text-xs text-vprs-gray text-center leading-relaxed">
                De acuerdo con la normativa vigente en Colombia, el acceso a este sitio está
                permitido únicamente a personas mayores de 18 años. Al seleccionar
                &ldquo;Sí, soy mayor de 18&rdquo;, declaras bajo la gravedad de juramento cumplir
                este requisito y autorizas la validación de esta información conforme a la Ley
                1581 de 2012.
              </p>
            </>
          )}

          {step === "form" && (
            <form onSubmit={handleSubmit}>
              <h2 className="font-display text-2xl font-semibold mb-2">Verifica tu edad</h2>
              <p className="font-body text-sm text-vprs-gray mb-6">
                Por favor proporciona tu fecha de nacimiento y número de identificación para
                continuar.
              </p>

              <label className="block font-body text-xs tracking-wide uppercase text-vprs-gray font-semibold mb-2">
                Fecha de nacimiento
              </label>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="rounded-vprs border border-vprs-gray/30 px-3 py-3 font-body text-sm text-vprs-black outline-none focus:border-vprs-black bg-white"
                  aria-label="Día"
                >
                  <option value="">Día</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="rounded-vprs border border-vprs-gray/30 px-3 py-3 font-body text-sm text-vprs-black outline-none focus:border-vprs-black bg-white"
                  aria-label="Mes"
                >
                  <option value="">Mes</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-vprs border border-vprs-gray/30 px-3 py-3 font-body text-sm text-vprs-black outline-none focus:border-vprs-black bg-white"
                  aria-label="Año"
                >
                  <option value="">Año</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <label className="block font-body text-xs tracking-wide uppercase text-vprs-gray font-semibold mb-2">
                Identificación (CC/CE/NIT)
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Ingresa tu número de identificación"
                className="w-full rounded-vprs border border-vprs-gray/30 px-4 py-3 font-body text-sm text-vprs-black outline-none focus:border-vprs-black bg-white mb-2"
              />

              {formError && (
                <p className="font-body text-xs text-vprs-accent mb-3">{formError}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 my-5">
                <button
                  type="submit"
                  className="flex-1 rounded-vprs bg-vprs-black text-white font-body font-medium py-3 hover:bg-vprs-graphite transition-colors ring-2 ring-vprs-accent/40 ring-offset-2"
                >
                  Verificar e ingresar
                </button>
                <button
                  type="button"
                  onClick={block}
                  className="flex-1 rounded-vprs border border-vprs-black/15 text-vprs-black font-body font-medium py-3 hover:bg-vprs-black/5 transition-colors"
                >
                  No, soy menor de 18
                </button>
              </div>

              <p className="font-body text-xs text-vprs-gray leading-relaxed">
                La información suministrada se utiliza exclusivamente para verificar tu mayoría
                de edad y no se almacena en nuestros servidores. Al continuar, declaras bajo la
                gravedad de juramento que eres mayor de dieciocho (18) años, que los datos
                ingresados son veraces y corresponden a tus datos personales, y autorizas a VPRS
                a validar esta información conforme a la Ley 1581 de 2012.
              </p>
            </form>
          )}

          {step === "blocked" && (
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-vprs-accent text-white flex items-center justify-center font-display text-sm font-bold mb-5">
                18+
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3">Acceso restringido</h2>
              <p className="font-body text-sm text-vprs-gray leading-relaxed">
                Este sitio está destinado exclusivamente a personas mayores de 18 años. De
                acuerdo con la normativa vigente en Colombia, no podemos darte acceso al
                contenido.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
