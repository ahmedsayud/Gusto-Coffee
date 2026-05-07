import Navbar from "../../components/Navbar";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { getDbData } from "../../actions/db";
import AddToCartButton from "../../components/AddToCartButton";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dbData: any = await getDbData();
  const category = dbData.categories.find((c: any) => c.id === resolvedParams.id);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col selection:bg-[#2D241E] selection:text-[#FDFCFB]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-bold">القسم غير موجود</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col selection:bg-[#2D241E] selection:text-[#FDFCFB]">
      <Navbar />

      <main className="flex-1 bg-warm-gradient pb-24">
        {/* Header */}
        <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-stone-900 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 z-10"></div>
          <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
          
          <div className="relative z-20 text-center px-6 mt-12">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight animate-fade-in">{category.name}</h1>
            <p className="text-stone-300 font-medium max-w-xl mx-auto text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {category.description}
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="relative z-20 mx-auto max-w-[1400px] px-6 -mt-12">
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product: any, idx: number) => (
              <div key={product.id} className="group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-premium border border-stone-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-black text-stone-900 tracking-tight">{product.name}</h3>
                  </div>
                  
                  {product.degree && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold text-stone-500 w-fit mb-6 uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {product.degree}
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">السعر</span>
                      <span className="text-2xl font-black text-primary leading-none">
                        {product.price} <span className="text-sm font-bold">ج.م</span>
                      </span>
                    </div>
                    
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-stone-950 py-8 text-center border-t border-white/5">
        <p className="text-stone-500 text-sm font-bold tracking-widest uppercase">© 2026 CUSTO COFFEE.</p>
      </footer>
    </div>
  );
}
