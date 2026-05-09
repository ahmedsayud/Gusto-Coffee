"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingBag, Coffee, ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDbData } from "../actions/db";

export default function Navbar() {
  const { items } = useCart();
  const pathname = usePathname();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getDbData().then((data: any) => {
      if (data.categories) setCategories(data.categories);
    });
  }, []);

  const isHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 w-full transition-smooth bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12 py-4 lg:py-5">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary text-white transition-all duration-300 group-hover:rotate-12 group-hover:scale-105 shadow-lg shadow-primary/20">
            <Coffee size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tighter text-stone-900 leading-none">ELWaly</span>
              <span className="text-2xl font-light tracking-tighter text-primary leading-none">Coffee</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mt-1.5">
              بن <span className="text-primary">الوالي</span> — الأصالة في كوب
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {categories.map((cat: any) => (
            <Link 
              key={cat.id}
              href={`/category/${cat.id}`} 
              className={`text-sm font-bold transition-all hover:text-primary ${pathname === `/category/${cat.id}` ? "text-primary" : "text-stone-600"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/cart" 
            className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white border border-stone-200 shadow-sm transition-all hover:bg-stone-900 hover:text-white hover:border-stone-900"
          >
            <ShoppingBag size={20} strokeWidth={2} className="text-stone-700 group-hover:text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>
          
          {!isHome && (
            <Link 
              href="/" 
              className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-50 text-stone-500 transition-all hover:bg-stone-200"
            >
              <ChevronLeft size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
