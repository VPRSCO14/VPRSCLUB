"use client";

import Link from "next/link";
import { CartIcon } from "./icons";
import { useCarrito } from "@/lib/cart";

export default function CartButton() {
  const items = useCarrito();
  const total = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <Link href="/carrito" aria-label="Carrito" className="relative hover:text-vprs-white transition-colors">
      <CartIcon />
      {total > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-vprs-accent text-white text-[10px] leading-none">
          {total}
        </span>
      )}
    </Link>
  );
}
