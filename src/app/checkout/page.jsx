// // ملف: app/checkout/page.jsx
// "use client";
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   ArrowLeft,
//   CreditCard,
//   User,
//   Phone,
//   MapPin,
//   ChefHat,
//   Home,
//   Briefcase,
//   Star,
//   Edit,
//   Save,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   Clock,
//   Plus,
//   Trash2
// } from "lucide-react";
// import { useApp } from "../layout-client";
// import { customerApi } from "../_services/customerApi";

// export default function CheckoutPage() {
//   const { cart, getTotalPrice, setCart } = useApp();
//   const router = useRouter();
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSavingAddress, setIsSavingAddress] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showAddressForm, setShowAddressForm] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     paymentMethod: "cash",
//     chefNotes: "",
//   });
  
//   const [newAddress, setNewAddress] = useState({
//     title: "",
//     details: "",
//     type: "home"
//   });

//   useEffect(() => {
//     loadUserData();
    
//     // إذا كانت السلة فارغة، توجيه إلى القائمة
//     if (cart.length === 0) {
//       const pendingCart = localStorage.getItem("pendingCart");
//       if (pendingCart) {
//         try {
//           const parsedCart = JSON.parse(pendingCart);
//           if (parsedCart.length > 0) {
//             setCart(parsedCart);
//             localStorage.removeItem("pendingCart");
//           } else {
//             router.push("/menu");
//           }
//         } catch {
//           router.push("/menu");
//         }
//       } else {
//         router.push("/menu");
//       }
//     }
//   }, []);

//   const loadUserData = async () => {
//     try {
//       const isAuth = customerApi.isAuthenticated();
//       if (!isAuth) {
//         localStorage.setItem("pendingCart", JSON.stringify(cart));
//         localStorage.setItem("redirectAfterAuth", "/checkout");
//         router.push("/auth/signin");
//         return;
//       }

//       // تحميل بيانات المستخدم
//       const user = await customerApi.getCurrentCustomer();
//       if (user) {
//         setUserData(user);
//         setAddresses(user.addresses || []);
        
//         // الحصول على البيانات المحفوظة
//         const lastOrderInfo = customerApi.getLastOrderInfo();
//         const defaultAddress = customerApi.getDefaultAddress();
        
//         // تعيين البيانات في النموذج
//         setFormData({
//           name: lastOrderInfo.name || user.name || "",
//           phone: lastOrderInfo.phone || user.phone || "",
//           paymentMethod: lastOrderInfo.paymentMethod || "cash",
//           chefNotes: lastOrderInfo.chefNotes || "",
//         });

//         if (defaultAddress) {
//           setSelectedAddress(defaultAddress.id);
//         }
//       }
//     } catch (error) {
//       console.error("Error loading user data:", error);
//       toast.error("حدث خطأ في تحميل البيانات");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleNewAddressChange = (e) => {
//     const { name, value } = e.target;
//     setNewAddress(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAddressTypeSelect = (type) => {
//     setNewAddress(prev => ({
//       ...prev,
//       type,
//       title: type === "home" ? "المنزل" : type === "work" ? "العمل" : "عنوان آخر"
//     }));
//   };

//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address.id);
//     setShowAddressForm(false);
//   };

//   const saveNewAddress = async () => {
//     if (!newAddress.details.trim()) {
//       toast.error("الرجاء إدخال العنوان التفصيلي");
//       return;
//     }

//     try {
//       setIsSavingAddress(true);
      
//       const addressData = {
//         title: newAddress.title || (newAddress.type === "home" ? "المنزل" : newAddress.type === "work" ? "العمل" : "عنوان آخر"),
//         address: newAddress.details,
//         type: newAddress.type,
//         isDefault: addresses.length === 0 // أول عنوان يصبح افتراضي
//       };

//       const savedAddress = await customerApi.upsertAddress(addressData);
      
//       toast.success("تم حفظ العنوان بنجاح");
//       setShowAddressForm(false);
//       setNewAddress({ title: "", details: "", type: "home" });
      
//       // تحديث قائمة العناوين
//       const updatedUser = await customerApi.getCurrentCustomer();
//       setAddresses(updatedUser?.addresses || []);
      
//       if (savedAddress) {
//         setSelectedAddress(savedAddress.id);
//       }
      
//       return savedAddress;
//     } catch (error) {
//       console.error("Error saving address:", error);
//       toast.error("حدث خطأ في حفظ العنوان");
//       return null;
//     } finally {
//       setIsSavingAddress(false);
//     }
//   };

//   const setAsDefaultAddress = async (addressId) => {
//     try {
//       await customerApi.setDefaultAddress(addressId);
      
//       toast.success("تم تعيين العنوان كافتراضي");
      
//       // تحديث العناوين المحلية
//       const updatedAddresses = addresses.map(addr => ({
//         ...addr,
//         isDefault: addr.id === addressId
//       }));
//       setAddresses(updatedAddresses);
//     } catch (error) {
//       console.error("Error setting default address:", error);
//       toast.error("حدث خطأ في تعيين العنوان");
//     }
//   };

//   const deleteAddress = async (addressId, e) => {
//     e.stopPropagation();
    
//     if (!confirm("هل أنت متأكد من حذف هذا العنوان؟")) {
//       return;
//     }

//     try {
//       await customerApi.deleteAddress(addressId);
      
//       toast.success("تم حذف العنوان");
      
//       // تحديث قائمة العناوين
//       const updatedUser = await customerApi.getCurrentCustomer();
//       setAddresses(updatedUser?.addresses || []);
      
//       // إذا كان العنوان المحذوف هو المحدد، حدد العنوان الأول
//       if (selectedAddress === addressId) {
//         const newAddresses = updatedUser?.addresses || [];
//         if (newAddresses.length > 0) {
//           setSelectedAddress(newAddresses[0].id);
//         } else {
//           setSelectedAddress(null);
//         }
//       }
//     } catch (error) {
//       console.error("Error deleting address:", error);
//       toast.error("حدث خطأ في حذف العنوان");
//     }
//   };

//   const createOrder = async () => {
//     // التحقق من البيانات
//     if (!formData.name.trim()) {
//       toast.error("الرجاء إدخال الاسم");
//       return;
//     }
//     if (!formData.phone.trim()) {
//       toast.error("الرجاء إدخال رقم الهاتف");
//       return;
//     }

//     // الحصول على العنوان المختار
//     const selected = addresses.find(addr => addr.id === selectedAddress);
//     if (!selected && !showAddressForm) {
//       toast.error("الرجاء اختيار عنوان التوصيل");
//       return;
//     }

//     // إذا كان هناك عنوان جديد، احفظه أولاً
//     let deliveryAddress = "";
//     if (showAddressForm && newAddress.details.trim()) {
//       const savedAddress = await saveNewAddress();
//       if (savedAddress) {
//         deliveryAddress = savedAddress.address;
//       } else {
//         return;
//       }
//     } else if (selected) {
//       deliveryAddress = selected.address;
//     }

//     if (!deliveryAddress.trim()) {
//       toast.error("الرجاء إدخال العنوان");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const { supabase } = await import("../_services/supabase");
      
//       // حفظ بيانات الطلب للمرة القادمة
//       customerApi.saveLastOrderInfo({
//         name: formData.name,
//         phone: formData.phone,
//         paymentMethod: formData.paymentMethod,
//         chefNotes: formData.chefNotes
//       });

//       const customerId = customerApi.getCustomerId();
      
//       // تحضير بيانات الطلب
//       const orderData = {
//         customer_name: formData.name,
//         customer_phone: formData.phone,
//         customer_address: deliveryAddress,
//         notes: formData.chefNotes,
//         items: cart.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.calculatedPrice || item.price,
//           quantity: item.quantity,
//           selectedSize: item.selectedSize,
//           image: item.image,
//         })),
//         total_amount: getTotalPrice(),
//         payment_method: formData.paymentMethod,
//         chef_notes: formData.chefNotes,
//         customer_id: customerId,
//         status: "pending",
//       };

//       // إرسال الطلب
//       const { data, error } = await supabase
//         .from("orders")
//         .insert([orderData])
//         .select()
//         .single();

//       if (error) {
//         console.error("خطأ في إنشاء الطلب:", error);
//         throw error;
//       }

//       toast.success("تم إنشاء الطلب بنجاح! سيتم تجهيزه قريباً");

//       // إعادة تعيين السلة
//       setCart([]);

//       // توجيه إلى صفحة تأكيد الطلب
//       router.push(`/order-confirmation/${data.id}`);
//     } catch (error) {
//       console.error("Create order error:", error);
//       toast.error(error.message || "حدث خطأ في إنشاء الطلب");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatQuantity = (item) => {
//     if (item.selectedSize) {
//       const sizeLabels = {
//         0.25: "ربع كيلو",
//         0.33: "تلت كيلو",
//         0.5: "نص كيلو",
//       };
//       const sizeLabel = sizeLabels[item.selectedSize] || `${item.selectedSize} `;
//       return `${sizeLabel} × ${item.quantity}`;
//     } else {
//       return item.quantity === 1 ? "1 " : `${item.quantity} `;
//     }
//   };

//   const calculateEstimatedTime = () => {
//     if (cart.length === 0) return "";

//     let totalTime = 0;
//     cart.forEach(item => {
//       let itemTime = 15;
//       if (item.category === "grill" || item.name.includes("شواية")) {
//         itemTime = 25;
//       }
//       if (item.quantity > 2) {
//         itemTime += 5 * (item.quantity - 2);
//       }
//       totalTime += itemTime;
//     });

//     totalTime += 30;
//     const now = new Date();
//     const deliveryTime = new Date(now.getTime() + totalTime * 60000);

//     return deliveryTime.toLocaleTimeString("ar-EG", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const estimatedTime = calculateEstimatedTime();

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center px-4">
//         <div className="text-center">
//           <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
//           <h2 className="text-lg text-white/60 mb-3">السلة فارغة</h2>
//           <Link
//             href="/menu"
//             className="bg-[#C49A6C] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all text-sm inline-block"
//           >
//             تصفح القائمة
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white pt-16 pb-12 px-4">
//       <Toaster position="top-center" />
      
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <Link
//             href="/cart"
//             className="flex items-center gap-2 text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm"
//           >
//             <ArrowLeft size={20} />
//             <span>رجوع للسلة</span>
//           </Link>
//           <h1 className="text-xl font-bold text-[#C49A6C] text-center">تأكيد الطلب</h1>
//           <div className="w-10"></div>
//         </div>

//         {/* Progress Steps */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="text-center">
//             <div className="w-8 h-8 bg-[#C49A6C] text-black rounded-full flex items-center justify-center mx-auto mb-1 text-sm font-bold">1</div>
//             <p className="text-[#C49A6C] text-xs">السلة</p>
//           </div>
//           <div className="flex-1 h-1 bg-[#C49A6C] mx-2"></div>
//           <div className="text-center">
//             <div className="w-8 h-8 bg-[#C49A6C] text-black rounded-full flex items-center justify-center mx-auto mb-1 text-sm font-bold">2</div>
//             <p className="text-[#C49A6C] text-xs">التفاصيل</p>
//           </div>
//           <div className="flex-1 h-1 bg-zinc-700 mx-2"></div>
//           <div className="text-center">
//             <div className="w-8 h-8 bg-zinc-700 text-white rounded-full flex items-center justify-center mx-auto mb-1 text-sm font-bold">3</div>
//             <p className="text-white/60 text-xs">التأكيد</p>
//           </div>
//         </div>

//         {/* Customer Info */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
//         >
//           <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//             <User className="w-5 h-5 text-[#C49A6C]" />
//             معلومات العميل
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-white/70 mb-1 text-sm">الاسم الكامل *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="أدخل اسمك الكامل"
//                 className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-white/70 mb-1 text-sm">رقم الهاتف *</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 placeholder="أدخل رقم هاتفك"
//                 className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
//                 required
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* Address Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-bold text-white flex items-center gap-2">
//               <MapPin className="w-5 h-5 text-[#C49A6C]" />
//               عنوان التوصيل
//             </h2>
            
//             {!showAddressForm && (
//               <button
//                 onClick={() => setShowAddressForm(true)}
//                 className="text-[#C49A6C] hover:text-[#B08A5C] text-sm transition-all flex items-center gap-1"
//               >
//                 <Plus className="w-4 h-4" />
//                 إضافة عنوان جديد
//               </button>
//             )}
//           </div>

//           {/* Saved Addresses */}
//           {!showAddressForm ? (
//             <div className="space-y-3">
//               {addresses.length > 0 ? (
//                 <>
//                   <p className="text-white/60 text-sm mb-2">اختر من العناوين المحفوظة:</p>
                  
//                   {addresses.map((address) => (
//                     <div
//                       key={address.id}
//                       className={`p-3 rounded-lg border cursor-pointer transition-all ${
//                         selectedAddress === address.id
//                           ? "border-[#C49A6C] bg-[#C49A6C]/10"
//                           : "border-zinc-700 bg-zinc-800 hover:border-[#C49A6C]/50"
//                       }`}
//                       onClick={() => handleAddressSelect(address)}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="font-medium text-white text-sm">
//                               {address.title}
//                             </span>
//                             {address.isDefault && (
//                               <span className="bg-[#C49A6C]/20 text-[#C49A6C] text-xs px-2 py-1 rounded-full">
//                                 افتراضي
//                               </span>
//                             )}
//                             {address.type === "home" && <Home className="w-4 h-4 text-blue-400" />}
//                             {address.type === "work" && <Briefcase className="w-4 h-4 text-green-400" />}
//                           </div>
//                           <p className="text-white/80 text-sm">{address.address}</p>
//                         </div>
//                         <div className="flex gap-2">
//                           {!address.isDefault && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setAsDefaultAddress(address.id);
//                               }}
//                               className="p-1 text-green-400 hover:text-green-300 transition-all"
//                               title="تعيين كافتراضي"
//                             >
//                               <Star className="w-4 h-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={(e) => deleteAddress(address.id, e)}
//                             className="p-1 text-red-400 hover:text-red-300 transition-all"
//                             title="حذف العنوان"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                           <div className="w-4 h-4 rounded-full border-2 border-white/30 flex items-center justify-center">
//                             {selectedAddress === address.id && (
//                               <div className="w-2 h-2 bg-[#C49A6C] rounded-full"></div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               ) : (
//                 <div className="text-center py-4">
//                   <MapPin className="w-12 h-12 text-white/30 mx-auto mb-3" />
//                   <p className="text-white/60 mb-2">لا توجد عناوين محفوظة</p>
//                   <button
//                     onClick={() => setShowAddressForm(true)}
//                     className="text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm"
//                   >
//                     أضف أول عنوان لك
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* Address Type Selection */}
//               <div>
//                 <p className="text-white/70 mb-2 text-sm">نوع العنوان</p>
//                 <div className="grid grid-cols-3 gap-2">
//                   {[
//                     { type: "home", icon: Home, label: "المنزل" },
//                     { type: "work", icon: Briefcase, label: "العمل" },
//                     { type: "other", icon: MapPin, label: "آخر" },
//                   ].map((type) => (
//                     <button
//                       key={type.type}
//                       type="button"
//                       onClick={() => handleAddressTypeSelect(type.type)}
//                       className={`p-3 rounded-lg border transition-all ${
//                         newAddress.type === type.type
//                           ? "border-[#C49A6C] bg-[#C49A6C]/10"
//                           : "border-zinc-700 bg-zinc-800 hover:border-[#C49A6C]/50"
//                       }`}
//                     >
//                       <type.icon className={`w-5 h-5 mx-auto mb-1 ${
//                         newAddress.type === type.type ? "text-[#C49A6C]" : "text-white/60"
//                       }`} />
//                       <span className={`text-xs ${
//                         newAddress.type === type.type ? "text-[#C49A6C]" : "text-white/60"
//                       }`}>
//                         {type.label}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Custom Title if other */}
//               {newAddress.type === "other" && (
//                 <div>
//                   <label className="block text-white/70 mb-1 text-sm">اسم العنوان المخصص</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={newAddress.title}
//                     onChange={handleNewAddressChange}
//                     placeholder="مثال: منزل الأهل، الشقة الثانية..."
//                     className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
//                   />
//                 </div>
//               )}

//               {/* Address Details */}
//               <div>
//                 <label className="block text-white/70 mb-1 text-sm">العنوان التفصيلي *</label>
//                 <textarea
//                   name="details"
//                   value={newAddress.details}
//                   onChange={handleNewAddressChange}
//                   placeholder="أدخل العنوان بالتفصيل: المنطقة، الشارع، رقم المبني، الشقة..."
//                   rows="3"
//                   className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none text-sm"
//                   required
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={saveNewAddress}
//                   disabled={isSavingAddress || !newAddress.details.trim()}
//                   className="flex-1 bg-[#C49A6C] hover:bg-[#B08A5C] text-black py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
//                 >
//                   {isSavingAddress ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                       جاري الحفظ...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4" />
//                       حفظ العنوان
//                     </>
//                   )}
//                 </button>
                
//                 <button
//                   onClick={() => {
//                     setShowAddressForm(false);
//                     setNewAddress({ title: "", details: "", type: "home" });
//                   }}
//                   className="px-4 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg font-medium transition-all text-sm"
//                 >
//                   إلغاء
//                 </button>
//               </div>
//             </div>
//           )}
//         </motion.div>

//         {/* Payment Method */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
//         >
//           <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//             <CreditCard className="w-5 h-5 text-[#C49A6C]" />
//             طريقة الدفع
//           </h2>
          
//           <div className="grid grid-cols-2 gap-3">
//             <button
//               type="button"
//               onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "cash" }))}
//               className={`p-4 rounded-lg border transition-all ${
//                 formData.paymentMethod === "cash"
//                   ? "border-green-500 bg-green-900/20"
//                   : "border-zinc-700 bg-zinc-800 hover:border-green-500/50"
//               }`}
//             >
//               <div className="flex flex-col items-center gap-2">
//                 <span className="text-2xl">💵</span>
//                 <span className="text-white font-medium">نقدي</span>
//                 <span className="text-white/60 text-xs">عند الاستلام</span>
//               </div>
//             </button>

//             <button
//               type="button"
//               onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "card" }))}
//               className={`p-4 rounded-lg border transition-all ${
//                 formData.paymentMethod === "card"
//                   ? "border-blue-500 bg-blue-900/20"
//                   : "border-zinc-700 bg-zinc-800 hover:border-blue-500/50"
//               }`}
//             >
//               <div className="flex flex-col items-center gap-2">
//                 <CreditCard className="w-6 h-6 text-blue-400" />
//                 <span className="text-white font-medium">بطاقة</span>
//                 <span className="text-white/60 text-xs">ائتمان/مدين</span>
//               </div>
//             </button>
//           </div>
//         </motion.div>

//         {/* Chef Notes */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
//         >
//           <label className="block text-white font-semibold mb-2 text-sm flex items-center gap-2">
//             <ChefHat className="w-5 h-5 text-[#C49A6C]" />
//             ملاحظات للشيف (اختياري)
//           </label>
//           <textarea
//             name="chefNotes"
//             value={formData.chefNotes}
//             onChange={handleInputChange}
//             placeholder="أي ملاحظات خاصة للشيف حول طريقة التحضير أو التغليف..."
//             rows="2"
//             className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none text-sm"
//           />
//         </motion.div>

//         {/* Order Summary */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
//         >
//           <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//             <Package className="w-5 h-5 text-[#C49A6C]" />
//             ملخص الطلب
//           </h2>
          
//           <div className="space-y-3">
//             <div className="max-h-48 overflow-y-auto">
//               {cart.map((item) => (
//                 <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10">
//                   <div className="flex-1">
//                     <p className="text-white text-sm font-medium">{item.name}</p>
//                     <p className="text-white/60 text-xs">{formatQuantity(item)}</p>
//                   </div>
//                   <p className="text-[#C49A6C] font-medium text-sm">
//                     {item.calculatedPrice || item.price} ج.م
//                   </p>
//                 </div>
//               ))}
//             </div>
            
//             <div className="pt-3 border-t border-white/20">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-white">المجموع</span>
//                 <span className="text-[#C49A6C] font-bold text-xl">
//                   {getTotalPrice()} ج.م
//                 </span>
//               </div>
              
//               {estimatedTime && (
//                 <div className="flex items-center gap-2 text-blue-300 text-sm">
//                   <Clock className="w-4 h-4" />
//                   <span>وقت التوصيل المتوقع: {estimatedTime}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </motion.div>

//         {/* Info Box */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg mb-4"
//         >
//           <div className="flex items-start gap-2">
//             <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="text-blue-300 text-sm font-medium mb-1">💡 معلومات هامة</p>
//               <ul className="text-blue-200/80 text-xs space-y-1">
//                 <li>• أول عنوان تضيفه سيتم تعيينه كافتراضي تلقائياً</li>
//                 <li>• يمكنك تغيير العنوان الافتراضي بالنقر على نجمة ⭐</li>
//                 <li>• سيتم حفظ بياناتك للطلبات القادمة</li>
//                 <li>• يمكنك إدارة عناوينك من صفحة حسابي</li>
//               </ul>
//             </div>
//           </div>
//         </motion.div>

//         {/* Action Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="flex flex-col gap-3"
//         >
//           <button
//             onClick={createOrder}
//             disabled={isLoading || !formData.name || !formData.phone || (!selectedAddress && !showAddressForm)}
//             className="w-full bg-[#C49A6C] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#B08A5C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                 جاري إنشاء الطلب...
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="w-5 h-5" />
//                 <span>تأكيد الطلب ودفع {getTotalPrice()} ج.م</span>
//               </>
//             )}
//           </button>

//           <Link
//             href="/cart"
//             className="w-full bg-zinc-700 text-white py-3 rounded-lg font-semibold hover:bg-zinc-600 transition-all text-center text-sm"
//           >
//             العودة للسلة
//           </Link>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// ملف: app/checkout/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  User,
  Phone,
  MapPin,
  ChefHat,
  Home,
  Briefcase,
  Star,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  Package,
  Clock,
  Plus,
  Trash2
} from "lucide-react";
import { useApp } from "../layout-client";
import { customerApi } from "../_services/customerApi";
import { paymentService } from "../_services/paymentService";

export default function CheckoutPage() {
  const { cart, getTotalPrice, setCart } = useApp();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    paymentMethod: "cash",
    chefNotes: "",
  });
  
  const [newAddress, setNewAddress] = useState({
    title: "",
    details: "",
    type: "home"
  });

  useEffect(() => {
    loadUserData();
    
    // إذا كانت السلة فارغة، توجيه إلى القائمة
    if (cart.length === 0) {
      const pendingCart = localStorage.getItem("pendingCart");
      if (pendingCart) {
        try {
          const parsedCart = JSON.parse(pendingCart);
          if (parsedCart.length > 0) {
            setCart(parsedCart);
            localStorage.removeItem("pendingCart");
          } else {
            router.push("/menu");
          }
        } catch {
          router.push("/menu");
        }
      } else {
        router.push("/menu");
      }
    }
  }, []);

  const loadUserData = async () => {
    try {
      const isAuth = customerApi.isAuthenticated();
      if (!isAuth) {
        localStorage.setItem("pendingCart", JSON.stringify(cart));
        localStorage.setItem("redirectAfterAuth", "/checkout");
        router.push("/auth/signin");
        return;
      }

      // تحميل بيانات المستخدم
      const user = await customerApi.getCurrentCustomer();
      if (user) {
        setUserData(user);
        setAddresses(user.addresses || []);
        
        // الحصول على البيانات المحفوظة
        const lastOrderInfo = customerApi.getLastOrderInfo();
        const defaultAddress = customerApi.getDefaultAddress();
        
        // تعيين البيانات في النموذج
        setFormData({
          name: lastOrderInfo.name || user.name || "",
          phone: lastOrderInfo.phone || user.phone || "",
          paymentMethod: lastOrderInfo.paymentMethod || "cash",
          chefNotes: lastOrderInfo.chefNotes || "",
        });

        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressTypeSelect = (type) => {
    setNewAddress(prev => ({
      ...prev,
      type,
      title: type === "home" ? "المنزل" : type === "work" ? "العمل" : "عنوان آخر"
    }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address.id);
    setShowAddressForm(false);
  };

  const saveNewAddress = async () => {
    if (!newAddress.details.trim()) {
      toast.error("الرجاء إدخال العنوان التفصيلي");
      return;
    }

    try {
      setIsSavingAddress(true);
      
      const addressData = {
        title: newAddress.title || (newAddress.type === "home" ? "المنزل" : newAddress.type === "work" ? "العمل" : "عنوان آخر"),
        address: newAddress.details,
        type: newAddress.type,
        isDefault: addresses.length === 0 // أول عنوان يصبح افتراضي
      };

      const savedAddress = await customerApi.upsertAddress(addressData);
      
      toast.success("تم حفظ العنوان بنجاح");
      setShowAddressForm(false);
      setNewAddress({ title: "", details: "", type: "home" });
      
      // تحديث قائمة العناوين
      const updatedUser = await customerApi.getCurrentCustomer();
      setAddresses(updatedUser?.addresses || []);
      
      if (savedAddress) {
        setSelectedAddress(savedAddress.id);
      }
      
      return savedAddress;
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("حدث خطأ في حفظ العنوان");
      return null;
    } finally {
      setIsSavingAddress(false);
    }
  };

  const setAsDefaultAddress = async (addressId) => {
    try {
      await customerApi.setDefaultAddress(addressId);
      
      toast.success("تم تعيين العنوان كافتراضي");
      
      // تحديث العناوين المحلية
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("حدث خطأ في تعيين العنوان");
    }
  };

  const deleteAddress = async (addressId, e) => {
    e.stopPropagation();
    
    if (!confirm("هل أنت متأكد من حذف هذا العنوان؟")) {
      return;
    }

    try {
      await customerApi.deleteAddress(addressId);
      
      toast.success("تم حذف العنوان");
      
      // تحديث قائمة العناوين
      const updatedUser = await customerApi.getCurrentCustomer();
      setAddresses(updatedUser?.addresses || []);
      
      // إذا كان العنوان المحذوف هو المحدد، حدد العنوان الأول
      if (selectedAddress === addressId) {
        const newAddresses = updatedUser?.addresses || [];
        if (newAddresses.length > 0) {
          setSelectedAddress(newAddresses[0].id);
        } else {
          setSelectedAddress(null);
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("حدث خطأ في حذف العنوان");
    }
  };

  const createOrder = async () => {
    // التحقق من البيانات
    if (!formData.name.trim()) {
      toast.error("الرجاء إدخال الاسم");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("الرجاء إدخال رقم الهاتف");
      return;
    }

    // الحصول على العنوان المختار
    const selected = addresses.find(addr => addr.id === selectedAddress);
    if (!selected && !showAddressForm) {
      toast.error("الرجاء اختيار عنوان التوصيل");
      return;
    }

    // إذا كان هناك عنوان جديد، احفظه أولاً
    let deliveryAddress = "";
    if (showAddressForm && newAddress.details.trim()) {
      const savedAddress = await saveNewAddress();
      if (savedAddress) {
        deliveryAddress = savedAddress.address;
      } else {
        return;
      }
    } else if (selected) {
      deliveryAddress = selected.address;
    }

    if (!deliveryAddress.trim()) {
      toast.error("الرجاء إدخال العنوان");
      return;
    }

    setIsLoading(true);

    try {
      const { supabase } = await import("../_services/supabase");
      
      // حفظ بيانات الطلب للمرة القادمة
      customerApi.saveLastOrderInfo({
        name: formData.name,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        chefNotes: formData.chefNotes
      });

      const customerId = customerApi.getCustomerId();
      
      // تحضير بيانات الطلب
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: deliveryAddress,
        notes: formData.chefNotes,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.calculatedPrice || item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.image,
        })),
        total_amount: getTotalPrice(),
        payment_method: formData.paymentMethod,
        chef_notes: formData.chefNotes,
        customer_id: customerId,
        customer_id: customerId,
        status: "pending",
      };

      // إرسال الطلب
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error("خطأ في إنشاء الطلب:", error);
        throw error;
      }

      // إذا كانت طريقة الدفع Paymob
      if (formData.paymentMethod === "paymob") {
        try {
          const billingData = {
            first_name: formData.name.split(' ')[0],
            last_name: formData.name.split(' ').slice(1).join(' ') || formData.name,
            email: userData.email,
            phone_number: formData.phone
          };

          const returnUrl = `${window.location.origin}/order-confirmation/${data.id}`;
          // إنشاء دفعة Paymob
          const paymentResult = await paymentService.createPaymobPayment(
            data.id,
            getTotalPrice(),
            billingData,
            returnUrl 
          );

          // حفظ معرف طلب Paymob
          await supabase
            .from("orders")
            .update({ 
              paymob_order_id: paymentResult.paymob_order_id,
              payment_status: 'pending'
            })
            .eq('id', data.id);

          // إعادة تعيين السلة
          setCart([]);

          // توجيه إلى Paymob iframe
          paymentService.redirectToPaymobIframe(
            paymentResult.payment_key,
            paymentResult.iframe_id
          );

          return; // Exit early for Paymob payment
          
        } catch (paymobError) {
          console.error("خطأ في Paymob:", paymobError);
          toast.error("حدث خطأ في بدء عملية الدفع الإلكتروني");
          
          // تحديث حالة الطلب إلى فشل
          await supabase
            .from("orders")
            .update({ payment_status: 'failed' })
            .eq('id', data.id);
            
          setIsLoading(false);
          return;
        }
      }

      // للدفع النقدي أو البطاقة (الكود القديم)
      toast.success("تم إنشاء الطلب بنجاح! سيتم تجهيزه قريباً");

      // إعادة تعيين السلة
      setCart([]);

      // توجيه إلى صفحة تأكيد الطلب
      router.push(`/order-confirmation/${data.id}`);
      
    } catch (error) {
      console.error("Create order error:", error);
      toast.error(error.message || "حدث خطأ في إنشاء الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  const formatQuantity = (item) => {
    if (item.selectedSize) {
      const sizeLabels = {
        0.25: "ربع كيلو",
        0.33: "تلت كيلو",
        0.5: "نص كيلو",
      };
      const sizeLabel = sizeLabels[item.selectedSize] || `${item.selectedSize} `;
      return `${sizeLabel} × ${item.quantity}`;
    } else {
      return item.quantity === 1 ? "1 " : `${item.quantity} `;
    }
  };

  const calculateEstimatedTime = () => {
    if (cart.length === 0) return "";

    let totalTime = 0;
    cart.forEach(item => {
      let itemTime = 15;
      if (item.category === "grill" || item.name.includes("شواية")) {
        itemTime = 25;
      }
      if (item.quantity > 2) {
        itemTime += 5 * (item.quantity - 2);
      }
      totalTime += itemTime;
    });

    totalTime += 30;
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + totalTime * 60000);

    return deliveryTime.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estimatedTime = calculateEstimatedTime();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 className="text-lg text-white/60 mb-3">السلة فارغة</h2>
          <Link
            href="/menu"
            className="bg-[#C49A6C] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all text-sm inline-block"
          >
            تصفح القائمة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-12 px-4">
      <Toaster position="top-center" />
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm"
          >
            <ArrowLeft size={20} />
            <span>رجوع للسلة</span>
          </Link>
          <h1 className="text-xl font-bold text-[#C49A6C] text-center">تأكيد الطلب</h1>
          <div className="w-10"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center">
            <div className="w-8 h-8 bg-[#C49A6C] text-black rounded-full flex items-center justify-center mx-auto mb-1 text-sm font-bold">1</div>
            <p className="text-[#C49A6C] text-xs">السلة</p>
          </div>
          <div className="flex-1 h-1 bg-[#C49A6C] mx-2"></div>
          <div className="text-center">
            <div className="w-8 h-8 bg-[#C49A6C] text-black rounded-full flex items-center justify-center mx-auto mb-1 text-sm font-bold">2</div>
            <p className="text-[#C49A6C] text-xs">التفاصيل</p>
          </div>
          <div className="flex-1 h-1 bg-zinc-700 mx-2"></div>
          <div className="text-center">
            <div className="w-8 h-8 bg-zinc-700 text-white rounded-full flex items-center justify-center mx-auto mb-1 text-sm font-bold">3</div>
            <p className="text-white/60 text-xs">التأكيد</p>
          </div>
        </div>

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#C49A6C]" />
            معلومات العميل
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-white/70 mb-1 text-sm">الاسم الكامل *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسمك الكامل"
                className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1 text-sm">رقم الهاتف *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="أدخل رقم هاتفك"
                className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Address Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C49A6C]" />
              عنوان التوصيل
            </h2>
            
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-[#C49A6C] hover:text-[#B08A5C] text-sm transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                إضافة عنوان جديد
              </button>
            )}
          </div>

          {/* Saved Addresses */}
          {!showAddressForm ? (
            <div className="space-y-3">
              {addresses.length > 0 ? (
                <>
                  <p className="text-white/60 text-sm mb-2">اختر من العناوين المحفوظة:</p>
                  
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? "border-[#C49A6C] bg-[#C49A6C]/10"
                          : "border-zinc-700 bg-zinc-800 hover:border-[#C49A6C]/50"
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              {address.title}
                            </span>
                            {address.isDefault && (
                              <span className="bg-[#C49A6C]/20 text-[#C49A6C] text-xs px-2 py-1 rounded-full">
                                افتراضي
                              </span>
                            )}
                            {address.type === "home" && <Home className="w-4 h-4 text-blue-400" />}
                            {address.type === "work" && <Briefcase className="w-4 h-4 text-green-400" />}
                          </div>
                          <p className="text-white/80 text-sm">{address.address}</p>
                        </div>
                        <div className="flex gap-2">
                          {!address.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAsDefaultAddress(address.id);
                              }}
                              className="p-1 text-green-400 hover:text-green-300 transition-all"
                              title="تعيين كافتراضي"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteAddress(address.id, e)}
                            className="p-1 text-red-400 hover:text-red-300 transition-all"
                            title="حذف العنوان"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 flex items-center justify-center">
                            {selectedAddress === address.id && (
                              <div className="w-2 h-2 bg-[#C49A6C] rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-4">
                  <MapPin className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60 mb-2">لا توجد عناوين محفوظة</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm"
                  >
                    أضف أول عنوان لك
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Address Type Selection */}
              <div>
                <p className="text-white/70 mb-2 text-sm">نوع العنوان</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "home", icon: Home, label: "المنزل" },
                    { type: "work", icon: Briefcase, label: "العمل" },
                    { type: "other", icon: MapPin, label: "آخر" },
                  ].map((type) => (
                    <button
                      key={type.type}
                      type="button"
                      onClick={() => handleAddressTypeSelect(type.type)}
                      className={`p-3 rounded-lg border transition-all ${
                        newAddress.type === type.type
                          ? "border-[#C49A6C] bg-[#C49A6C]/10"
                          : "border-zinc-700 bg-zinc-800 hover:border-[#C49A6C]/50"
                      }`}
                    >
                      <type.icon className={`w-5 h-5 mx-auto mb-1 ${
                        newAddress.type === type.type ? "text-[#C49A6C]" : "text-white/60"
                      }`} />
                      <span className={`text-xs ${
                        newAddress.type === type.type ? "text-[#C49A6C]" : "text-white/60"
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Title if other */}
              {newAddress.type === "other" && (
                <div>
                  <label className="block text-white/70 mb-1 text-sm">اسم العنوان المخصص</label>
                  <input
                    type="text"
                    name="title"
                    value={newAddress.title}
                    onChange={handleNewAddressChange}
                    placeholder="مثال: منزل الأهل، الشقة الثانية..."
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
                  />
                </div>
              )}

              {/* Address Details */}
              <div>
                <label className="block text-white/70 mb-1 text-sm">العنوان التفصيلي *</label>
                <textarea
                  name="details"
                  value={newAddress.details}
                  onChange={handleNewAddressChange}
                  placeholder="أدخل العنوان بالتفصيل: المنطقة، الشارع، رقم المبني، الشقة..."
                  rows="3"
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none text-sm"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveNewAddress}
                  disabled={isSavingAddress || !newAddress.details.trim()}
                  className="flex-1 bg-[#C49A6C] hover:bg-[#B08A5C] text-black py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {isSavingAddress ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ العنوان
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowAddressForm(false);
                    setNewAddress({ title: "", details: "", type: "home" });
                  }}
                  className="px-4 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg font-medium transition-all text-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#C49A6C]" />
            طريقة الدفع
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "cash" }))}
              className={`p-4 rounded-lg border transition-all ${
                formData.paymentMethod === "cash"
                  ? "border-green-500 bg-green-900/20"
                  : "border-zinc-700 bg-zinc-800 hover:border-green-500/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">💵</span>
                <span className="text-white font-medium">نقدي</span>
                <span className="text-white/60 text-xs">عند الاستلام</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "paymob" }))}
              className={`p-4 rounded-lg border transition-all ${
                formData.paymentMethod === "paymob"
                  ? "border-purple-500 bg-purple-900/20"
                  : "border-zinc-700 bg-zinc-800 hover:border-purple-500/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="w-6 h-6 text-purple-400" />
                <span className="text-white font-medium">بطاقة</span>
                <span className="text-white/60 text-xs">Paymob</span>
              </div>
            </button>
          </div>
          
          {formData.paymentMethod === "paymob" && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <p className="text-purple-300 text-sm">
                💳 سيتم توجيهك لصفحة آمنة لإتمام الدفع عبر بطاقتك الائتمانية
              </p>
            </div>
          )}
        </motion.div>

        {/* Chef Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
        >
          <label className="block text-white font-semibold mb-2 text-sm flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#C49A6C]" />
            ملاحظات للشيف (اختياري)
          </label>
          <textarea
            name="chefNotes"
            value={formData.chefNotes}
            onChange={handleInputChange}
            placeholder="أي ملاحظات خاصة للشيف حول طريقة التحضير أو التغليف..."
            rows="2"
            className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none text-sm"
          />
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-4"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#C49A6C]" />
            ملخص الطلب
          </h2>
          
          <div className="space-y-3">
            <div className="max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-white/60 text-xs">{formatQuantity(item)}</p>
                  </div>
                  <p className="text-[#C49A6C] font-medium text-sm">
                    {item.calculatedPrice || item.price} ج.م
                  </p>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-white/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">المجموع</span>
                <span className="text-[#C49A6C] font-bold text-xl">
                  {getTotalPrice()} ج.م
                </span>
              </div>
              
              {estimatedTime && (
                <div className="flex items-center gap-2 text-blue-300 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>وقت التوصيل المتوقع: {estimatedTime}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg mb-4"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-300 text-sm font-medium mb-1">💡 معلومات هامة</p>
              <ul className="text-blue-200/80 text-xs space-y-1">
                <li>• أول عنوان تضيفه سيتم تعيينه كافتراضي تلقائياً</li>
                <li>• يمكنك تغيير العنوان الافتراضي بالنقر على نجمة ⭐</li>
                <li>• سيتم حفظ بياناتك للطلبات القادمة</li>
                <li>• يمكنك إدارة عناوينك من صفحة حسابي</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={createOrder}
            disabled={isLoading || !formData.name || !formData.phone || (!selectedAddress && !showAddressForm)}
            className="w-full bg-[#C49A6C] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#B08A5C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                {formData.paymentMethod === "paymob" ? "جاري تحويلك للدفع..." : "جاري إنشاء الطلب..."}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>
                  {formData.paymentMethod === "paymob" 
                    ? `دفع ${getTotalPrice()} ج.م عبر Paymob`
                    : `تأكيد الطلب ودفع ${getTotalPrice()} ج.م`
                  }
                </span>
              </>
            )}
          </button>

          <Link
            href="/cart"
            className="w-full bg-zinc-700 text-white py-3 rounded-lg font-semibold hover:bg-zinc-600 transition-all text-center text-sm"
          >
            العودة للسلة
          </Link>
        </motion.div>
      </div>
    </div>
  );
}