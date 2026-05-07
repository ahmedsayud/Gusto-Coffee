"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartProvider";
import { Order } from "@/types";
import { CheckCircle2, Truck, Store, ArrowRight, User, Phone, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    delivery: true,
  });

  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push("/cart");
    }
  }, [items.length, success, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newOrder: Order = {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      items: items,
      customerName: formData.name,
      phone: formData.phone,
      address: formData.delivery ? formData.address : "استلام من الفرع",
      delivery: formData.delivery,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      clearCart();
      
      setTimeout(() => {
        router.push("/");
      }, 4000);
    }, 2000);
  };

  if (items.length === 0 && !success) {
    return null;
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md w-full rounded-[40px] bg-white p-12 text-center shadow-premium border border-stone-100 animate-fade-in">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-primary mb-8">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">وصلنا طلبك!</h1>
          <p className="text-stone-500 font-medium leading-relaxed mb-10">
            شكراً لثقتك بنا. فريقنا بدأ الآن بتجهيز قهوتك المفضلة لتصلك في أسرع وقت.
          </p>
          <div className="pt-8 border-t border-stone-50">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest animate-pulse">جاري العودة للرئيسية...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 lg:px-8 bg-warm-gradient">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-12 text-4xl font-black text-stone-900 tracking-tight">إتمام الطلب</h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 flex flex-col gap-8">
              <div className="rounded-[40px] bg-white p-10 shadow-premium border border-stone-100">
                <h2 className="mb-8 text-xl font-black text-stone-800 flex items-center gap-3">
                  <User size={20} className="text-primary" />
                  معلوماتك الشخصية
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">الاسم بالكامل</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth font-bold"
                      placeholder="كيف نناديك؟"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">رقم الجوال</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth font-bold"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[40px] bg-white p-10 shadow-premium border border-stone-100">
                <h2 className="mb-8 text-xl font-black text-stone-800 flex items-center gap-3">
                  <Truck size={20} className="text-primary" />
                  تفاصيل الاستلام
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, delivery: true })}
                    className={`flex flex-col items-center gap-4 rounded-3xl border-2 p-6 transition-smooth ${
                      formData.delivery 
                      ? "border-primary bg-orange-50/50 text-primary shadow-lg shadow-primary/5" 
                      : "border-stone-50 text-stone-400 hover:border-stone-200"
                    }`}
                  >
                    <Truck size={28} />
                    <span className="font-black text-xs uppercase tracking-wider">توصيل منزلي</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, delivery: false })}
                    className={`flex flex-col items-center gap-4 rounded-3xl border-2 p-6 transition-smooth ${
                      !formData.delivery 
                      ? "border-primary bg-orange-50/50 text-primary shadow-lg shadow-primary/5" 
                      : "border-stone-50 text-stone-400 hover:border-stone-200"
                    }`}
                  >
                    <Store size={28} />
                    <span className="font-black text-xs uppercase tracking-wider">استلام شخصي</span>
                  </button>
                </div>

                {formData.delivery && (
                  <div className="animate-fade-in">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">العنوان بالتفصيل</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth font-bold"
                      rows={3}
                      placeholder="أين تود أن نرسل قهوتك؟"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
               <div className="sticky top-32 rounded-[40px] bg-stone-900 p-10 text-white shadow-premium">
                  <h3 className="text-xl font-black mb-8 text-stone-200">ملخص الطلب</h3>
                  <div className="space-y-4 mb-10 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                     {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-medium">
                           <span className="text-stone-400">{item.quantity}x {item.product.name}</span>
                           <span className="font-bold">{item.product.price * item.quantity} ج.م</span>
                        </div>
                     ))}
                  </div>
                  
                  <div className="border-t border-white/10 pt-8 flex items-center justify-between text-lg mb-10">
                    <span className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">الإجمالي</span>
                    <span className="text-3xl font-black text-primary tracking-tight">{totalPrice} <span className="text-base font-bold">ج.م</span></span>
                  </div>
                  
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full rounded-full bg-primary py-5 font-black text-white transition-smooth hover:bg-primary-hover hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50"
                  >
                    {loading ? "جاري الإرسال..." : "إرسال الطلب الآن"}
                  </button>
               </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
