"use client";

import { useCart } from "./CartProvider";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleOrderNow = () => {
    addItem(product);
    router.push("/cart");
  };

  return (
    <button 
      onClick={handleOrderNow} 
      className="flex items-center justify-center gap-2 flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold transition-all hover:bg-primary shadow-lg shadow-black/5 hover:shadow-primary/20 w-full"
    >
      <ShoppingBag size={18} />
      إضافة للسلة
    </button>
  );
}
