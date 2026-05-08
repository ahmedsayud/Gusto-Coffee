"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Order } from "@/types";
import { CheckCircle2, Clock, Phone, MapPin, Package, RefreshCcw, Trash2, ExternalLink, Menu as MenuIcon, Image as ImageIcon, Plus, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getDbData, saveCategory, deleteCategory, savePhoto, deletePhoto, uploadImage } from "../actions/db";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState({ categories: [], photos: [] });
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; message: string; onConfirm: () => void }>({ show: false, message: "", onConfirm: () => {} });
  
  // Image Picker State
  const [pickerModal, setPickerModal] = useState<{ show: boolean; onSelect: (url: string) => void }>({ show: false, onSelect: () => {} });
  const [uploading, setUploading] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const confirmAction = (message: string, action: () => void) => {
    setConfirmModal({ show: true, message, onConfirm: action });
  };

  const openPicker = (callback: (url: string) => void) => {
    setPickerModal({ show: true, onSelect: callback });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);
    setUploading(false);

    if (result.success && result.url) {
      pickerModal.onSelect(result.url);
      setPickerModal({ show: false, onSelect: () => {} });
      showToast("تم رفع الصورة بنجاح");
    } else {
      showToast(result.error || "خطأ في الرفع", "error");
    }
  };

  const fetchOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  };

  const loadDbData = async () => {
    const data = await getDbData();
    setDbData(data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    loadDbData();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleComplete = (orderId: string) => {
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, completed: !o.completed } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    showToast("تم تحديث حالة الطلب بنجاح");
  };

  const deleteOrder = (orderId: string) => {
    confirmAction("هل أنت متأكد من حذف هذا الطلب بشكل نهائي؟", () => {
      const updatedOrders = orders.filter((o) => o.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      showToast("تم حذف الطلب", "error");
    });
  };

  // Menu Management functions
  const handleSaveCategory = async (e: React.FormEvent | null, category: any) => {
    if (e) e.preventDefault();
    await saveCategory(category);
    loadDbData();
    showToast("تم حفظ التعديلات بنجاح!");
  };

  const handleDeleteCategory = (id: string) => {
    confirmAction("هل تريد حقاً حذف هذا القسم بجميع منتجاته؟", async () => {
      await deleteCategory(id);
      loadDbData();
      showToast("تم حذف القسم", "error");
    });
  };

  // Photo Management functions
  const handleAddPhoto = async (url: string) => {
    const newPhoto = { id: Date.now(), url, initialLikes: 0 };
    await savePhoto(newPhoto);
    loadDbData();
    showToast("تمت إضافة الصورة بنجاح");
  };

  const handleDeletePhoto = (id: number) => {
    confirmAction("هل تريد حذف هذه الصورة من المعرض؟", async () => {
      await deletePhoto(id);
      loadDbData();
      showToast("تم حذف الصورة", "error");
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] relative">
      <Navbar />
      
      {/* Toast Notification */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl font-bold text-white ${toast.type === 'success' ? 'bg-stone-900' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {toast.message}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="flex justify-center mb-6 text-red-500 bg-red-50 w-16 h-16 rounded-full items-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-center text-stone-900 mb-2">تأكيد الإجراء</h3>
            <p className="text-center text-stone-500 font-medium mb-8">{confirmModal.message}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ show: false, message: "", onConfirm: () => {} });
                }} 
                className="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                تأكيد الحذف
              </button>
              <button 
                onClick={() => setConfirmModal({ show: false, message: "", onConfirm: () => {} })} 
                className="flex-1 bg-stone-100 text-stone-600 font-bold py-4 rounded-2xl hover:bg-stone-200 transition-all"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {pickerModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <button onClick={() => setPickerModal({ show: false, onSelect: () => {} })} className="absolute top-6 left-6 text-stone-400 hover:text-stone-900 transition-colors">
              <X size={24} />
            </button>
            
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-4">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-2">إضافة صورة</h3>
              <p className="text-stone-500 font-medium">اختر طريقة إضافة الصورة للقسم أو المنتج</p>
            </div>

            <div className="space-y-4">
              {/* Upload Option */}
              <label className={`flex flex-col items-center justify-center gap-3 p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${uploading ? 'bg-stone-50 border-stone-200 pointer-events-none' : 'bg-stone-50 border-stone-200 hover:border-primary hover:bg-primary/5 group'}`}>
                {uploading ? (
                  <RefreshCcw size={32} className="text-primary animate-spin" />
                ) : (
                  <>
                    <Plus size={32} className="text-stone-300 group-hover:text-primary" />
                    <span className="font-bold text-stone-500 group-hover:text-primary">رفع من الجهاز</span>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-stone-100"></div>
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">أو</span>
                <div className="flex-1 h-px bg-stone-100"></div>
              </div>

              {/* URL Option */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-2">رابط صورة خارجي</label>
                <div className="flex gap-2">
                  <input 
                    id="url-picker-input"
                    className="flex-1 border border-stone-100 bg-stone-50/50 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none text-left" 
                    dir="ltr" 
                    placeholder="https://images.unsplash.com/..." 
                  />
                  <button 
                    onClick={() => {
                      const val = (document.getElementById('url-picker-input') as HTMLInputElement).value;
                      if (val) {
                        pickerModal.onSelect(val);
                        setPickerModal({ show: false, onSelect: () => {} });
                      }
                    }}
                    className="bg-stone-900 text-white px-6 rounded-2xl font-bold hover:bg-primary transition-all"
                  >
                    تم
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-8 w-1.5 rounded-full bg-primary"></div>
                 <h1 className="text-3xl font-black text-stone-900 tracking-tight">لوحة التحكم</h1>
              </div>
              <p className="text-stone-500 font-medium">إدارة الطلبات، الأقسام، والصور في كاستو كوفي بلمسة واحدة.</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-4 custom-scrollbar">
            <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-sm whitespace-nowrap ${activeTab === "orders" ? "bg-stone-900 text-white shadow-stone-900/20" : "bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-900 border border-stone-100"}`}>
              <Package size={18} /> الطلبات ({orders.length})
            </button>
            <button onClick={() => setActiveTab("menu")} className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-sm whitespace-nowrap ${activeTab === "menu" ? "bg-stone-900 text-white shadow-stone-900/20" : "bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-900 border border-stone-100"}`}>
              <MenuIcon size={18} /> الأقسام والمنيو
            </button>
            <button onClick={() => setActiveTab("photos")} className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-sm whitespace-nowrap ${activeTab === "photos" ? "bg-stone-900 text-white shadow-stone-900/20" : "bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-900 border border-stone-100"}`}>
              <ImageIcon size={18} /> معرض صور العملاء
            </button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                orders.length === 0 ? (
                  <div className="rounded-[40px] bg-white p-24 text-center shadow-premium border border-stone-100 flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-stone-50 text-stone-200 flex items-center justify-center mb-6">
                      <Package size={48} />
                    </div>
                    <p className="text-xl text-stone-400 font-bold">لا توجد طلبات جديدة حالياً.</p>
                  </div>
                ) : (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                       <div key={order.id} className={`rounded-[32px] bg-white p-8 shadow-premium border-2 transition-all ${order.completed ? 'border-green-500/20 bg-green-50/10' : 'border-transparent hover:border-primary/20'}`}>
                         <div className="flex justify-between items-center mb-6 pb-6 border-b border-stone-50">
                           <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">#{order.id}</span>
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${order.completed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                             <div className={`h-1.5 w-1.5 rounded-full ${order.completed ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                             {order.completed ? "مكتمل" : "قيد التحضير"}
                           </span>
                         </div>
                         <h3 className="text-2xl font-black text-stone-900 mb-4">{order.customerName}</h3>
                         <div className="space-y-3 mb-8">
                           <p className="flex items-center gap-3 text-stone-500 font-medium text-sm"><Phone size={16} className="text-stone-300"/> {order.phone}</p>
                           <p className="flex items-center gap-3 text-stone-500 font-medium text-sm"><MapPin size={16} className="text-stone-300"/> {order.address}</p>
                         </div>
                         <div className="bg-stone-50 rounded-2xl p-5 mb-8">
                           <ul className="space-y-3">
                             {order.items.map((item, idx) => (
                               <li key={idx} className="flex gap-3 text-sm font-bold items-center">
                                 <span className="h-6 w-6 rounded-lg bg-white flex items-center justify-center text-primary text-[10px] shadow-sm">{item.quantity}</span>
                                 <span className="text-stone-700">{item.product.name}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                         <div className="flex gap-3">
                            <button onClick={() => toggleComplete(order.id)} className={`flex-1 font-bold px-4 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${order.completed ? "bg-stone-100 text-stone-500 hover:bg-stone-200" : "bg-stone-900 text-white shadow-lg shadow-stone-900/10 hover:bg-primary"}`}>
                               <CheckCircle2 size={18} /> {order.completed ? "إلغاء الإكمال" : "تأكيد التجهيز"}
                            </button>
                            <button onClick={() => deleteOrder(order.id)} className="h-14 w-14 flex items-center justify-center bg-white border border-stone-100 text-stone-300 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                              <Trash2 size={20} />
                            </button>
                         </div>
                       </div>
                    ))}
                  </div>
                )
              )}

              {/* MENU TAB */}
              {activeTab === "menu" && (
                <div className="space-y-8 max-w-4xl mx-auto">
                  {dbData.categories.map((cat: any) => (
                    <div key={cat.id} className="bg-white p-8 rounded-[40px] shadow-premium border border-stone-100 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400">
                            <MenuIcon size={24} />
                          </div>
                          <h2 className="text-2xl font-black text-stone-900">{cat.name}</h2>
                        </div>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-stone-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">اسم القسم</label>
                            <input className="w-full border border-stone-100 bg-stone-50/50 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none" defaultValue={cat.name} onChange={(e) => { cat.name = e.target.value; handleSaveCategory(null, cat); }} placeholder="مثال: الإسبريسو" required />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">صورة القسم</label>
                            <div className="flex gap-2">
                              <input className="flex-1 border border-stone-100 bg-stone-50/50 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none text-left" dir="ltr" value={cat.image} onChange={(e) => { cat.image = e.target.value; handleSaveCategory(null, cat); }} placeholder="/image.jpg" />
                              <button onClick={() => openPicker((url) => { cat.image = url; handleSaveCategory(null, cat); })} className="bg-stone-100 text-stone-600 p-4 rounded-2xl hover:bg-stone-200 transition-all flex items-center justify-center">
                                <ImageIcon size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">الوصف</label>
                          <textarea className="w-full border border-stone-100 bg-stone-50/50 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none" defaultValue={cat.description} onChange={(e) => { cat.description = e.target.value; handleSaveCategory(null, cat); }} placeholder="اكتب وصفاً جذاباً للقسم" required rows={2} />
                        </div>
                        
                        <div className="mt-4 bg-stone-50 rounded-3xl p-6 border border-stone-100/50">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-stone-800 text-lg">المنتجات التابعة</h3>
                            <span className="bg-stone-200 text-stone-600 px-3 py-1 rounded-full text-xs font-bold">{cat.products.length} منتجات</span>
                          </div>
                          
                          <div className="space-y-4">
                            {cat.products.map((p: any, idx: number) => (
                              <div key={p.id} className="flex flex-col md:flex-row gap-3 items-center bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                                <input className="w-full md:w-1/3 border border-stone-50 bg-stone-50/30 p-3 rounded-xl font-bold text-sm outline-none focus:border-primary/50" defaultValue={p.name} onChange={(e) => { p.name = e.target.value; handleSaveCategory(null, cat); }} placeholder="اسم المنتج" required />
                                <input className="w-full md:w-1/6 border border-stone-50 bg-stone-50/30 p-3 rounded-xl font-bold text-sm outline-none focus:border-primary/50 text-center" defaultValue={p.price} type="number" onChange={(e) => { p.price = Number(e.target.value); handleSaveCategory(null, cat); }} placeholder="السعر" required />
                                
                                <div className="flex flex-1 gap-2 w-full md:w-auto">
                                  <input className="flex-1 border border-stone-50 bg-stone-50/30 p-3 rounded-xl font-bold text-[10px] outline-none focus:border-primary/50 text-left" dir="ltr" value={p.imageUrl} onChange={(e) => { p.imageUrl = e.target.value; handleSaveCategory(null, cat); }} placeholder="/prod.jpg" />
                                  <button onClick={() => openPicker((url) => { p.imageUrl = url; handleSaveCategory(null, cat); })} className="bg-stone-50 text-stone-400 p-3 rounded-xl hover:bg-stone-100 transition-all">
                                    <ImageIcon size={18} />
                                  </button>
                                </div>

                                <button type="button" onClick={() => { cat.products.splice(idx, 1); handleSaveCategory(null, cat); }} className="w-full md:w-auto text-stone-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <button type="button" onClick={() => { cat.products.push({id: `prod-${Date.now()}`, name: '', price: 0, imageUrl: '', degree: 'تحميص متوسط'}); handleSaveCategory(null, cat); }} className="mt-6 flex items-center gap-2 text-primary font-bold bg-primary/5 px-6 py-3 rounded-xl hover:bg-primary/10 transition-all w-fit">
                            <Plus size={18} /> إضافة منتج جديد
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={() => {
                    const newCat = { id: `cat-${Date.now()}`, name: 'قسم جديد', description: 'وصف القسم', image: '', products: [] };
                    saveCategory(newCat).then(loadDbData);
                    showToast("تم إنشاء قسم جديد. يرجى تعديل بياناته.");
                  }} className="flex flex-col items-center justify-center gap-4 w-full text-stone-500 font-bold bg-white border-2 border-dashed border-stone-200 hover:border-primary hover:text-primary transition-all p-12 rounded-[40px]">
                    <div className="h-16 w-16 bg-stone-50 rounded-full flex items-center justify-center">
                      <Plus size={24} />
                    </div>
                    إضافة قسم قائمة جديد
                  </button>
                </div>
              )}

              {/* PHOTOS TAB */}
              {activeTab === "photos" && (
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white p-12 rounded-[40px] shadow-premium border border-stone-100 mb-10 text-center">
                    <div className="h-20 w-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                      <ImageIcon size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-stone-900 mb-4">رفع صورة لصور العملاء</h2>
                    <p className="text-stone-500 font-medium mb-8 max-w-md mx-auto">أضف صور العملاء المميزة لتظهر في المعرض التفاعلي بالصفحة الرئيسية.</p>
                    
                    <button 
                      onClick={() => openPicker(handleAddPhoto)}
                      className="bg-stone-900 text-white px-12 py-5 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-primary shadow-xl hover:shadow-primary/20 transition-all mx-auto"
                    >
                      <Plus size={24} /> إضافة صورة للمعرض
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {dbData.photos.map((photo: any) => (
                      <div key={photo.id} className="relative group rounded-[32px] overflow-hidden aspect-square shadow-sm border border-stone-100 bg-stone-50">
                        <img src={photo.url} alt="Customer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => handleDeletePhoto(photo.id)} className="bg-red-500 text-white p-4 rounded-full hover:scale-110 hover:bg-red-600 transition-all shadow-xl">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
