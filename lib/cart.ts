"use client";

import { useEffect, useState } from "react";

export type CartItem = {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  saborId?: string;
  saborNombre?: string;
};

const STORAGE_KEY = "vprs_carrito";
const CART_EVENT = "vprs-carrito-actualizado";

function claveItem(productoId: string, saborId?: string) {
  return `${productoId}::${saborId ?? ""}`;
}

function leerCarrito(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function guardarCarrito(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function obtenerCarrito(): CartItem[] {
  return leerCarrito();
}

export function agregarAlCarrito(item: Omit<CartItem, "cantidad">, cantidad = 1) {
  const items = leerCarrito();
  const clave = claveItem(item.productoId, item.saborId);
  const existente = items.find((i) => claveItem(i.productoId, i.saborId) === clave);

  if (existente) {
    existente.cantidad += cantidad;
    guardarCarrito(items);
  } else {
    guardarCarrito([...items, { ...item, cantidad }]);
  }
}

export function actualizarCantidad(productoId: string, saborId: string | undefined, cantidad: number) {
  const clave = claveItem(productoId, saborId);
  const items = leerCarrito();

  if (cantidad <= 0) {
    guardarCarrito(items.filter((i) => claveItem(i.productoId, i.saborId) !== clave));
    return;
  }

  guardarCarrito(
    items.map((i) => (claveItem(i.productoId, i.saborId) === clave ? { ...i, cantidad } : i))
  );
}

export function quitarDelCarrito(productoId: string, saborId?: string) {
  const clave = claveItem(productoId, saborId);
  guardarCarrito(leerCarrito().filter((i) => claveItem(i.productoId, i.saborId) !== clave));
}

export function vaciarCarrito() {
  guardarCarrito([]);
}

export function useCarrito() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(leerCarrito());
    const actualizar = () => setItems(leerCarrito());
    window.addEventListener(CART_EVENT, actualizar);
    window.addEventListener("storage", actualizar);
    return () => {
      window.removeEventListener(CART_EVENT, actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, []);

  return items;
}
