import Link from "next/link";
import Navbar from "./components/Navbar";
import CustomerPhotos from "./components/CustomerPhotos";
import { Coffee, Flame, ArrowRight, Camera, Globe, Send, LayoutDashboard, Star } from "lucide-react";
import { getDbData } from "./actions/db";

export default async function Home() {
  const dbData: any = await getDbData();
  const categories = dbData.categories || [];

  return (
    <div className="flex min-h-screen flex-col selection:bg-[#2D241E] selection:text-[#FDFCFB]">
      <Navbar />
      
      <main className="flex-1 bg-warm-gradient overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-12 py-12 lg:py-20 mx-auto max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Text Content */}
            <div className="flex flex-col items-start text-start z-20 order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 rounded-full bg-stone-100 px-5 py-2 text-[10px] font-bold text-stone-600 mb-8 uppercase tracking-[0.3em] animate-fade-in shadow-sm border border-stone-200/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Premium Roasters
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-stone-900 mb-6 leading-[1.1] animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                مذاق يرتقي <br />
                <span className="text-primary font-normal">بكل حواسك.</span>
              </h1>
              
              <p className="text-lg text-stone-500 max-w-lg leading-relaxed font-medium mb-10 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                منتقاة بعناية من أفضل مزارع العالم، ومحمصة بشغف لتمنحك الكوب المثالي الذي يضاهي أفخم العلامات التجارية.
              </p>
              
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                 {categories.slice(0, 2).map((cat: any, idx: number) => (
                   <Link key={cat.id} href={`/category/${cat.id}`} className={`rounded-full px-8 py-4 font-bold transition-all duration-300 hover:-translate-y-1 ${idx === 0 ? "bg-stone-900 text-white hover:bg-primary hover:shadow-xl hover:shadow-primary/20" : "bg-transparent border-2 border-stone-200 text-stone-900 hover:border-stone-900 hover:bg-stone-50"}`}>
                     {cat.name}
                   </Link>
                 ))}
              </div>
            </div>

            {/* Image Content */}
            <div className="relative h-[450px] lg:h-[650px] w-full rounded-[40px] overflow-hidden shadow-premium order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
               <img src="/WhatsApp Image 2026-05-07 at 2.42.11 PM.jpeg" alt="Premium Coffee" className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-105" />
               <div className="absolute inset-0 bg-black/5"></div>
               
               {/* Elegant Badge overlay */}
               <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl max-w-[200px] border border-white/20 transform transition-transform hover:-translate-y-2">
                  <Coffee className="text-primary mb-3" size={28} />
                  <p className="text-sm font-bold text-stone-900 leading-tight">100% Arabica <br/><span className="text-stone-500 font-medium text-[10px] uppercase tracking-wider mt-1 block">Premium Selection</span></p>
               </div>
            </div>
          </div>
        </section>

        {/* Branches Grid (Dynamic) */}
        <section className="relative z-20 mx-auto max-w-[1400px] px-6 py-20 lg:py-32">
          <div className="grid gap-8 md:grid-cols-2">
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="group relative h-[450px] lg:h-[550px] overflow-hidden rounded-[40px] bg-stone-900 shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 transition-opacity duration-700 group-hover:opacity-90"></div>
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-[10s] ease-out" />
                
                <div className="absolute bottom-0 p-10 lg:p-14 z-20 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="flex items-center gap-2 rounded-full bg-white/10 w-fit px-4 py-2 text-[10px] font-bold text-white backdrop-blur-md border border-white/20 mb-6 uppercase tracking-[0.2em]">
                    {cat.icon === 'Coffee' ? <Coffee size={14} className="text-primary" /> : <Flame size={14} className="text-primary" />}
                    <span>{cat.subtitle || 'Premium Blend'}</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">{cat.name}</h2>
                  <p className="text-stone-300 font-medium mb-8 max-w-sm text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-4 group-hover:translate-y-0">{cat.description}</p>
                  <div className="flex items-center gap-3 text-primary font-bold group-hover:gap-5 transition-all duration-500">
                    <span className="uppercase tracking-widest text-xs">عرض القائمة</span>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Social Wall / Customer Photos */}
        <CustomerPhotos />

        {/* Testimonials Section */}
        <section className="relative z-20 mx-auto max-w-[1400px] px-6 py-20 lg:py-32 border-t border-stone-200/50">
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 mb-6">ماذا يقول عشاق قهوتنا؟</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto font-medium">نفخر بتقديم تجربة استثنائية يشاركنا بها عملاؤنا المميزون يومياً.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "أحمد النجار",
                role: "متذوق قهوة",
                review: "الإسبريسو هنا عالمي بمعنى الكلمة، نكهة التحميص وتوازن الحموضة فكرني بأشهر مقاهي روما. تجربة تستحق التكرار يومياً.",
                rating: 5
              },
              {
                name: "سارة محمد",
                role: "عاشقة للقهوة التركية",
                review: "القهوة التركية عندهم حكاية! الوش مظبوط جداً والمذاق العثماني الأصيل واضح في كل رشفة. التغليف والتقديم بريميوم جداً.",
                rating: 5
              },
              {
                name: "محمود طارق",
                role: "صانع محتوى",
                review: "كمية الاحترافية في التحضير وسرعة التوصيل خلتني أعتمد عليهم كلياً. طعم البن واضح إنه منتقى بعناية فائقة الجودة.",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-primary fill-primary/20 group-hover:fill-primary transition-colors duration-500" size={18} />
                  ))}
                </div>
                <p className="text-stone-600 font-medium leading-relaxed mb-8 text-lg min-h-[100px]">"{testimonial.review}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-500 text-lg border border-stone-200">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{testimonial.name}</h4>
                    <span className="text-xs text-stone-400 font-medium">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-stone-950 text-white pt-24 pb-12 px-6 border-t border-white/5">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 md:grid-cols-12 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                  <Coffee size={28} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                   <span className="text-3xl font-bold tracking-tight leading-none">كاستو كوفي</span>
                   <span className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold mt-2">Premium Roasters</span>
                </div>
              </div>
              <p className="text-stone-400 font-medium max-w-md leading-relaxed text-lg">
                نحن لا نبيع القهوة فقط، بل نصنع تجربة متكاملة تأخذك في رحلة حول العالم مع كل رشفة.
              </p>
            </div>
            
            <div className="md:col-span-3">
              <h4 className="text-xs font-bold mb-8 text-stone-500 uppercase tracking-[0.2em]">اكتشف</h4>
              <ul className="space-y-5 text-stone-300 font-medium">
                {categories.map((cat: any) => (
                  <li key={cat.id}><Link href={`/category/${cat.id}`} className="hover:text-primary transition-colors flex items-center gap-3"><ArrowRight size={14} className="text-primary"/> {cat.name}</Link></li>
                ))}
                <li><Link href="/cart" className="hover:text-primary transition-colors flex items-center gap-3"><ArrowRight size={14} className="text-primary"/> سلة المشتريات</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-xs font-bold mb-8 text-stone-500 uppercase tracking-[0.2em]">للموظفين فقط</h4>
              <div className="bg-white/5 rounded-[32px] p-8 border border-white/5">
                 <p className="text-sm text-stone-400 mb-8 leading-relaxed">بوابة الدخول المخصصة لإدارة الطلبات والأقسام.</p>
                 <Link 
                   href="/dashboard" 
                   className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white text-stone-900 px-6 py-4 text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
                 >
                   <LayoutDashboard size={18} />
                   لوحة تحكم الموقع
                 </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-stone-500 text-sm font-bold tracking-widest uppercase">© 2026 CUSTO COFFEE. All Rights Reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-white/5 text-stone-400 hover:bg-primary hover:text-white transition-all hover:scale-110"><Camera size={20} /></Link>
              <Link href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-white/5 text-stone-400 hover:bg-primary hover:text-white transition-all hover:scale-110"><Globe size={20} /></Link>
              <Link href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-white/5 text-stone-400 hover:bg-primary hover:text-white transition-all hover:scale-110"><Send size={20} /></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
