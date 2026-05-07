"use client";

import { Product } from "@/types";
import { useCart } from "./CartProvider";
import { Plus, Coffee } from "lucide-react";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group relative overflow-hidden rounded-[32px] bg-white p-5 shadow-premium transition-smooth hover:shadow-premium-hover border border-stone-100 flex flex-col h-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-[#F7F3F0]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
        
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-bold text-primary backdrop-blur-md shadow-sm">
          {product.degree}
        </div>
      </div>
      
      <div className="mt-6 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="text-xl font-bold text-stone-900 leading-tight mb-1">{product.name}</h3>
          <p className="text-xs text-stone-400 font-medium">تجربة غنية ومذاق متوازن</p>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">السعر</span>
            <span className="text-2xl font-black text-primary leading-none">
              {product.price} <span className="text-sm font-bold">ج.م</span>
            </span>
          </div>
          
          <button
            onClick={() => addItem(product)}
            className="group/btn flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-white transition-smooth hover:bg-primary active:scale-95 shadow-lg shadow-stone-900/10 hover:shadow-primary/20"
            aria-label="أضف للسلة"
          >
            <Plus size={24} strokeWidth={3} className="transition-smooth group-hover/btn:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
