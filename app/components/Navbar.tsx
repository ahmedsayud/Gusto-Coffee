"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingBag, Coffee, ChevronLeft, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDbData } from "../actions/db";

export default function Navbar() {
  const { items } = useCart();
  const pathname = usePathname();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getDbData().then((data: any) => {
      if (data.categories) setCategories(data.categories);
    });
  }, []);

  const isHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 w-full transition-smooth bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12 py-4 lg:py-5">
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex md:hidden h-10 w-10 items-center justify-center rounded-full bg-stone-50 text-stone-600 hover:bg-stone-100 transition-all"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="flex items-center gap-3 md:gap-4 group">
          <div className="relative flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-[14px] md:rounded-[20px] bg-primary text-white transition-all duration-300 group-hover:rotate-12 group-hover:scale-105 shadow-lg shadow-primary/20">
            <Coffee size={20} className="md:w-7 md:h-7" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="text-lg md:text-2xl font-black tracking-tighter text-stone-900 leading-none">ELWaly</span>
              <span className="text-lg md:text-2xl font-light tracking-tighter text-primary leading-none">Coffee</span>
            </div>
            <span className="hidden xs:block text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-stone-400 mt-1 md:mt-1.5">
              بن <span className="text-primary">الوالي</span> — الأصالة في كوب
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
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

        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            href="/cart" 
            className="group relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white border border-stone-200 shadow-sm transition-all hover:bg-stone-900 hover:text-white hover:border-stone-900"
          >
            <ShoppingBag size={18} strokeWidth={2} className="text-stone-700 group-hover:text-white md:w-5 md:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-primary text-[9px] md:text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>
          
          {!isHome && (
            <Link 
              href="/" 
              className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-stone-50 text-stone-500 transition-all hover:bg-stone-200"
            >
              <ChevronLeft size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 top-[65px] md:top-[81px] z-40 bg-white transition-all duration-500 md:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="p-8 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 mb-8">قائمة الأقسام</p>
          <div className="grid gap-4">
            {categories.map((cat: any) => (
              <Link 
                key={cat.id}
                href={`/category/${cat.id}`} 
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between p-6 rounded-3xl font-bold transition-all ${pathname === `/category/${cat.id}` ? "bg-primary/10 text-primary" : "bg-stone-50 text-stone-900"}`}
              >
                {cat.name}
                <ChevronLeft size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
