// // ملف: app/profile/page.jsx
// "use client";
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   User,
//   Mail,
//   Phone,
//   Home,
//   ShoppingBag,
//   Clock,
//   MapPin,
//   Edit,
//   Save,
//   LogOut,
//   Package,
//   CheckCircle,
//   AlertCircle,
//   ChevronLeft,
//   Plus,
//   Trash2
// } from "lucide-react";
// import { customerApi } from "../_services/customerApi";
// import Image from "next/image";

// export default function ProfilePage() {
//   const [userData, setUserData] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [addresses, setAddresses] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("profile"); // profile, orders, addresses
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//   });
//   const router = useRouter();

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     try {
//       setIsLoading(true);
      
//       if (!customerApi.isAuthenticated()) {
//         router.push("/auth/signin?redirect=/profile");
//         return;
//       }

//       const user = await customerApi.getCurrentCustomer();
//       if (user) {
//         setUserData(user);
//         setFormData({
//           name: user.name || "",
//           phone: user.phone || "",
//         });
//         setAddresses(user.addresses || []);
//       }

//       const userOrders = await customerApi.getCustomerOrders();
//       setOrders(userOrders || []);
//     } catch (error) {
//       console.error("Error loading user data:", error);
//       toast.error("حدث خطأ في تحميل البيانات");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSaveProfile = async () => {
//     try {
//       setIsLoading(true);
//       await customerApi.updateProfile(formData);
//       await loadUserData();
//       setIsEditing(false);
//       toast.success("تم تحديث الملف الشخصي بنجاح");
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       toast.error("حدث خطأ في حفظ التغييرات");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await customerApi.signOut();
//       router.push("/");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   const getStatusConfig = (status) => {
//     const configs = {
//       pending: { color: "bg-yellow-500/20 text-yellow-400", label: "قيد الانتظار" },
//       preparing: { color: "bg-blue-500/20 text-blue-400", label: "قيد التجهيز" },
//       ready: { color: "bg-green-500/20 text-green-400", label: "جاهز للتسليم" },
//       completed: { color: "bg-green-500/20 text-green-400", label: "مكتمل" },
//       cancelled: { color: "bg-red-500/20 text-red-400", label: "ملغي" },
//     };
//     return configs[status] || { color: "bg-gray-500/20 text-gray-400", label: status };
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("ar-EG", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-[#C49A6C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[#C49A6C]">جاري تحميل البيانات...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-4">
//         <div className="text-center">
//           <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
//           <p className="text-white/60 mb-4">لم يتم العثور على بيانات المستخدم</p>
//           <Link
//             href="/auth/signin"
//             className="bg-[#C49A6C] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all inline-block"
//           >
//             تسجيل الدخول
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white pt-16 pb-12 px-4">
//       <Toaster position="top-center" />
      
//       {/* Header */}
//       <div className="sticky top-16 bg-black/95 backdrop-blur-sm z-40 -mx-4 px-4 py-4 border-b border-white/10 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <Link
//             href="/"
//             className="flex items-center gap-2 text-white/60 hover:text-white transition-all"
//           >
//             <ChevronLeft className="w-5 h-5" />
//             <span className="text-sm">العودة</span>
//           </Link>
//           <h1 className="text-xl font-bold text-[#C49A6C] text-center">حسابي</h1>
//           <button
//             onClick={handleLogout}
//             className="text-red-400 hover:text-red-300 transition-all text-sm"
//           >
//             <LogOut className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-white/10">
//           <button
//             onClick={() => setActiveTab("profile")}
//             className={`flex-1 py-2 text-sm font-medium transition-all ${
//               activeTab === "profile"
//                 ? "text-[#C49A6C] border-b-2 border-[#C49A6C]"
//                 : "text-white/60 hover:text-white"
//             }`}
//           >
//             <User className="inline w-4 h-4 ml-1" />
//             الملف الشخصي
//           </button>
//           <button
//             onClick={() => setActiveTab("orders")}
//             className={`flex-1 py-2 text-sm font-medium transition-all ${
//               activeTab === "orders"
//                 ? "text-[#C49A6C] border-b-2 border-[#C49A6C]"
//                 : "text-white/60 hover:text-white"
//             }`}
//           >
//             <ShoppingBag className="inline w-4 h-4 ml-1" />
//             طلباتي ({orders.length})
//           </button>
//           <button
//             onClick={() => setActiveTab("addresses")}
//             className={`flex-1 py-2 text-sm font-medium transition-all ${
//               activeTab === "addresses"
//                 ? "text-[#C49A6C] border-b-2 border-[#C49A6C]"
//                 : "text-white/60 hover:text-white"
//             }`}
//           >
//             <MapPin className="inline w-4 h-4 ml-1" />
//             العناوين
//           </button>
//         </div>
//       </div>

//       {/* Profile Tab */}
//       {activeTab === "profile" && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="space-y-6"
//         >
//           {/* User Info Card */}
//           <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-bold text-white">معلوماتي</h2>
//               <button
//                 onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
//                 disabled={isLoading}
//                 className="text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm"
//               >
//                 {isEditing ? "حفظ" : "تعديل"}
//               </button>
//             </div>

//             <div className="space-y-4">
//               {/* Name */}
//               <div>
//                 <label className="block text-white/70 mb-1 text-sm">
//                   <User className="inline w-4 h-4 ml-1" />
//                   الاسم
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
//                   />
//                 ) : (
//                   <p className="text-white font-medium">{userData.name}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-white/70 mb-1 text-sm">
//                   <Mail className="inline w-4 h-4 ml-1" />
//                   البريد الإلكتروني
//                 </label>
//                 <p className="text-white font-medium">{userData.email}</p>
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="block text-white/70 mb-1 text-sm">
//                   <Phone className="inline w-4 h-4 ml-1" />
//                   رقم الهاتف
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="أدخل رقم هاتفك"
//                     className="w-full px-3 py-2 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
//                   />
//                 ) : (
//                   <p className="text-white font-medium">
//                     {userData.phone || "لم يتم إضافة رقم هاتف"}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Order Stats */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-zinc-900 rounded-xl border border-white/10 p-4 text-center">
//               <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <Clock className="w-5 h-5 text-blue-400" />
//               </div>
//               <p className="text-white/60 text-sm">قيد الانتظار</p>
//               <p className="text-2xl font-bold text-blue-400">
//                 {orders.filter(o => o.status === "pending").length}
//               </p>
//             </div>

//             <div className="bg-zinc-900 rounded-xl border border-white/10 p-4 text-center">
//               <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <CheckCircle className="w-5 h-5 text-green-400" />
//               </div>
//               <p className="text-white/60 text-sm">مكتملة</p>
//               <p className="text-2xl font-bold text-green-400">
//                 {orders.filter(o => o.status === "completed").length}
//               </p>
//             </div>
//           </div>

//           {/* Member Since */}
//           <div className="bg-zinc-900 rounded-xl border border-white/10 p-4">
//             <p className="text-white/60 text-sm">عضو منذ</p>
//             <p className="text-white font-medium">
//               {formatDate(userData.created_at)}
//             </p>
//           </div>
//         </motion.div>
//       )}

//       {/* Orders Tab */}
//       {activeTab === "orders" && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="space-y-4"
//         >
//           {orders.length === 0 ? (
//             <div className="text-center py-8">
//               <ShoppingBag className="w-12 h-12 text-white/30 mx-auto mb-3" />
//               <p className="text-white/60">لا توجد طلبات سابقة</p>
//               <Link
//                 href="/menu"
//                 className="inline-block mt-3 text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm"
//               >
//                 تصفح القائمة واطلب الآن
//               </Link>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {orders.map((order) => (
//                 <Link
//                   key={order.id}
//                   href={`/order-confirmation/${order.id}`}
//                   className="block bg-zinc-900 rounded-xl border border-white/10 hover:border-[#C49A6C]/30 transition-all p-4"
//                 >
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <p className="text-white font-bold mb-1">طلب #{order.id.slice(0, 8)}</p>
//                       <p className="text-white/60 text-sm">
//                         {formatDate(order.created_at)}
//                       </p>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs ${getStatusConfig(order.status).color}`}>
//                       {getStatusConfig(order.status).label}
//                     </span>
//                   </div>
                  
//                   <div className="space-y-2">
//                     {order.items && order.items.slice(0, 2).map((item, index) => (
//                       <div key={index} className="flex items-center justify-between">
//                         <span className="text-white/80 text-sm truncate mr-2">
//                           {item.quantity} × {item.name}
//                         </span>
//                         <span className="text-[#C49A6C] text-sm whitespace-nowrap">
//                           {item.price} ج.م
//                         </span>
//                       </div>
//                     ))}
                    
//                     {order.items && order.items.length > 2 && (
//                       <p className="text-white/60 text-xs text-center">
//                         +{order.items.length - 2} عناصر أخرى
//                       </p>
//                     )}
//                   </div>
                  
//                   <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
//                     <span className="text-white/60 text-sm">المجموع</span>
//                     <span className="text-[#C49A6C] font-bold">
//                       {order.total_amount} ج.م
//                     </span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       )}

//       {/* Addresses Tab */}
//       {activeTab === "addresses" && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="space-y-4"
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-bold text-white">عناويني</h2>
//             <button
//               onClick={() => router.push("/profile/add-address")}
//               className="bg-[#C49A6C] hover:bg-[#B08A5C] text-black px-4 py-2 rounded-lg text-sm font-medium transition-all"
//             >
//               <Plus className="inline w-4 h-4 ml-1" />
//               إضافة عنوان
//             </button>
//           </div>

//           {addresses.length === 0 ? (
//             <div className="text-center py-8">
//               <MapPin className="w-12 h-12 text-white/30 mx-auto mb-3" />
//               <p className="text-white/60">لا توجد عناوين محفوظة</p>
//               <p className="text-white/40 text-sm mt-1">
//                 أضف عناوينك لتسهيل عملية الطلب
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {addresses.map((address) => (
//                 <div
//                   key={address.id}
//                   className="bg-zinc-900 rounded-xl border border-white/10 p-4"
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <h3 className="font-bold text-white">{address.title}</h3>
//                         {address.isDefault && (
//                           <span className="bg-[#C49A6C]/20 text-[#C49A6C] text-xs px-2 py-1 rounded-full">
//                             افتراضي
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-white/80 text-sm">{address.address}</p>
//                     </div>
//                     <button
//                       onClick={() => handleDeleteAddress(address.id)}
//                       className="text-red-400 hover:text-red-300 transition-all"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
                  
//                   <div className="flex gap-2 mt-3">
//                     {!address.isDefault && (
//                       <button
//                         onClick={() => handleSetDefaultAddress(address.id)}
//                         className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm py-2 rounded-lg transition-all"
//                       >
//                         تعيين كافتراضي
//                       </button>
//                     )}
//                     <button
//                       onClick={() => router.push(`/profile/edit-address/${address.id}`)}
//                       className="flex-1 bg-[#C49A6C] hover:bg-[#B08A5C] text-black text-sm py-2 rounded-lg transition-all"
//                     >
//                       تعديل
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       )}
//     </div>
//   );
// }

// ملف: app/profile/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Home,
  ShoppingBag,
  Clock,
  MapPin,
  Edit,
  Save,
  LogOut,
  Package,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Plus,
  Trash2
} from "lucide-react";
import { customerApi } from "../_services/customerApi";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      if (!customerApi.isAuthenticated()) {
        router.push("/auth/signin?redirect=/profile");
        return;
      }

      const user = await customerApi.getCurrentCustomer();
      if (user) {
        setUserData(user);
        setFormData({
          name: user.name || "",
          phone: user.phone || "",
        });
        setAddresses(user.addresses || []);
      }

      const userOrders = await customerApi.getCustomerOrders();
      setOrders(userOrders || []);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await customerApi.updateProfile(formData);
      await loadUserData();
      setIsEditing(false);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("حدث خطأ في حفظ التغييرات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await customerApi.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "bg-yellow-500/20 text-yellow-400", label: "قيد الانتظار" },
      preparing: { color: "bg-blue-500/20 text-blue-400", label: "قيد التجهيز" },
      ready: { color: "bg-green-500/20 text-green-400", label: "جاهز للتسليم" },
      completed: { color: "bg-green-500/20 text-green-400", label: "مكتمل" },
      cancelled: { color: "bg-red-500/20 text-red-400", label: "ملغي" },
    };
    return configs[status] || { color: "bg-gray-500/20 text-gray-400", label: status };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C49A6C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#C49A6C]">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-4">
        <div className="text-center">
          <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/60 mb-4">لم يتم العثور على بيانات المستخدم</p>
          <Link
            href="/auth/signin"
            className="bg-[#C49A6C] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all inline-block"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-12">
      <Toaster position="top-center" />
      
      {/* Container رئيسي لجعل الشكل جميل على Desktop */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header بسيط */}
        <div className="mb-8 mt-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">العودة</span>
            </Link>
            
            <h1 className="text-xl font-bold text-[#C49A6C] text-center">حسابي</h1>
            
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "text-[#C49A6C] border-b-2 border-[#C49A6C]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <User className="inline w-4 h-4 ml-1" />
              الملف الشخصي
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === "orders"
                  ? "text-[#C49A6C] border-b-2 border-[#C49A6C]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <ShoppingBag className="inline w-4 h-4 ml-1" />
              طلباتي ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === "addresses"
                  ? "text-[#C49A6C] border-b-2 border-[#C49A6C]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <MapPin className="inline w-4 h-4 ml-1" />
              العناوين
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* User Info Card */}
            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">معلوماتي الشخصية</h2>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isEditing 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "bg-[#C49A6C] hover:bg-[#B08A5C] text-black"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      تعديل
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-white/70 mb-1 text-sm flex items-center gap-2">
                    <User className="w-4 h-4" />
                    الاسم
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white focus:outline-none focus:border-[#C49A6C] transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-zinc-800/50 rounded-lg">
                      <p className="text-white font-medium">{userData.name}</p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-white/70 mb-1 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني
                  </label>
                  <div className="px-4 py-3 bg-zinc-800/50 rounded-lg">
                    <p className="text-white font-medium">{userData.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-white/70 mb-1 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    رقم الهاتف
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="أدخل رقم هاتفك"
                      className="w-full px-4 py-3 bg-zinc-800 border border-[#C49A6C]/30 rounded-lg text-white focus:outline-none focus:border-[#C49A6C] transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-zinc-800/50 rounded-lg">
                      <p className="text-white font-medium">
                        {userData.phone || "لم يتم إضافة رقم هاتف"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <label className="block text-white/70 mb-1 text-sm">
                    عضو منذ
                  </label>
                  <div className="px-4 py-3 bg-zinc-800/50 rounded-lg">
                    <p className="text-white font-medium">
                      {formatDate(userData.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 rounded-xl border border-white/10 p-4 text-center">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-white/60 text-sm">قيد الانتظار</p>
                <p className="text-2xl font-bold text-blue-400">
                  {orders.filter(o => o.status === "pending").length}
                </p>
              </div>

              <div className="bg-zinc-900 rounded-xl border border-white/10 p-4 text-center">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-white/60 text-sm">مكتملة</p>
                <p className="text-2xl font-bold text-green-400">
                  {orders.filter(o => o.status === "completed").length}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">لا توجد طلبات سابقة</p>
                <Link
                  href="/menu"
                  className="inline-block mt-3 text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm"
                >
                  تصفح القائمة واطلب الآن
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/order-confirmation/${order.id}`}
                    className="block bg-zinc-900 rounded-xl border border-white/10 hover:border-[#C49A6C]/30 transition-all p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-bold mb-1">طلب #{order.id.slice(0, 8)}</p>
                        <p className="text-white/60 text-sm">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusConfig(order.status).color}`}>
                        {getStatusConfig(order.status).label}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items && order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/80 text-sm truncate mr-2">
                            {item.quantity} × {item.name}
                          </span>
                          <span className="text-[#C49A6C] text-sm whitespace-nowrap">
                            {item.price} ج.م
                          </span>
                        </div>
                      ))}
                      
                      {order.items && order.items.length > 2 && (
                        <p className="text-white/60 text-xs text-center">
                          +{order.items.length - 2} عناصر أخرى
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-white/60 text-sm">المجموع</span>
                      <span className="text-[#C49A6C] font-bold">
                        {order.total_amount} ج.م
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">عناويني</h2>
              <button
                onClick={() => router.push("/profile/add-address")}
                className="bg-[#C49A6C] hover:bg-[#B08A5C] text-black px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة عنوان
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">لا توجد عناوين محفوظة</p>
                <p className="text-white/40 text-sm mt-1">
                  أضف عناوينك لتسهيل عملية الطلب
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-zinc-900 rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white">{address.title}</h3>
                          {address.isDefault && (
                            <span className="bg-[#C49A6C]/20 text-[#C49A6C] text-xs px-2 py-1 rounded-full">
                              افتراضي
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 text-sm">{address.address}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm py-2 rounded-lg transition-all"
                        >
                          تعيين كافتراضي
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/profile/edit-address/${address.id}`)}
                        className="flex-1 bg-[#C49A6C] hover:bg-[#B08A5C] text-black text-sm py-2 rounded-lg transition-all"
                      >
                        تعديل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}