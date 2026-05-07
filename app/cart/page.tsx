"use client";

import Navbar from "../components/Navbar";
import { useCart } from "../components/CartProvider";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, addItem, removeItem, clearCart } = useCart();
  
  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 lg:px-8 bg-warm-gradient">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 flex items-center gap-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-premium text-stone-900">
                <ShoppingBag size={24} />
             </div>
             <h1 className="text-4xl font-black text-stone-900 tracking-tight">سلة المشتريات</h1>
          </div>

          {items.length === 0 ? (
            <div className="rounded-[40px] bg-white p-16 text-center shadow-premium border border-stone-100 animate-fade-in">
              <p className="text-xl text-stone-400 font-medium mb-8">سلتك فارغة حالياً، ابدأ بإضافة قهوتك المفضلة.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full bg-stone-900 px-8 py-4 font-bold text-white transition-smooth hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
              >
                تصفح المنتجات
                <ArrowRight size={20} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="rounded-[40px] bg-white p-8 shadow-premium border border-stone-100">
                <div className="flex flex-col gap-8">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-stone-50 pb-8 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 flex-shrink-0 rounded-[24px] bg-[#F7F3F0] flex items-center justify-center text-stone-300">
                          <ShoppingBag size={32} strokeWidth={1} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-stone-900 leading-tight">
                            {item.product.name}
                          </h3>
                          <span className="inline-block mt-1 rounded-full bg-orange-50 px-3 py-0.5 text-[10px] font-bold text-primary">
                            {item.product.degree}
                          </span>
                        </div>
                      </div>

                      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-8">
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">السعر</p>
                              <p className="font-black text-xl text-primary leading-none">
                                {item.product.price * item.quantity} <span className="text-xs">ج.م</span>
                              </p>
                           </div>
                           <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/50 p-1">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  addItem(item.product, -1);
                                } else {
                                  removeItem(item.product.id);
                                }
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-stone-400 transition-smooth hover:text-stone-900 shadow-sm"
                            >
                              <Minus size={16} strokeWidth={3} />
                            </button>
                            <span className="w-6 text-center font-bold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addItem(item.product, 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-stone-400 transition-smooth hover:text-stone-900 shadow-sm"
                            >
                              <Plus size={16} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-50 text-stone-300 transition-smooth hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[40px] bg-stone-900 p-10 text-white shadow-premium">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-stone-400 font-bold">المجموع النهائي:</span>
                  <span className="text-4xl font-black text-primary tracking-tight">{totalPrice} <span className="text-xl">ج.م</span></span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/checkout"
                    className="flex-1 flex items-center justify-center gap-3 rounded-full bg-primary py-5 font-black text-white transition-smooth hover:bg-primary-hover hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
                  >
                    تأكيد الطلب
                    <ArrowRight size={22} strokeWidth={3} />
                  </Link>
                  <button
                    onClick={clearCart}
                    className="px-8 py-5 rounded-full border border-white/10 font-bold text-stone-400 transition-smooth hover:bg-white/5 hover:text-white"
                  >
                    مسح السلة
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
