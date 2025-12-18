// ملف: app/middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // تحميل الكوكيز
  const adminAuth = request.cookies.get("adminAuthenticated")?.value;
  const userRole = request.cookies.get("userRole")?.value;
  const customerAuth = request.cookies.get("customerAuthenticated")?.value;

  // تحديد إذا كان المستخدم موظفاً
  const isEmployee =
    adminAuth && ["admin", "cashier", "chief"].includes(userRole);
  const isCustomer = customerAuth === "true";

  // صفحات الإدارة (للموظفين فقط)
  const adminPaths = [
    "/admin",
    "/admin/",
    "/admin/home",
    "/admin/menu",
    "/admin/users",
    "/admin/stats",
    "/admin/settings",
  ];
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  // صفحات المطبخ (للموظفين فقط)
  const kitchenPaths = ["/kitchen"];
  const isKitchenPath = kitchenPaths.some((path) => pathname.startsWith(path));

  // صفحات الطلبات (للكاشير والمدير فقط)
  const orderPaths = ["/orders", "/orders/new"];
  const isOrderPath = orderPaths.some((path) => pathname.startsWith(path));

  // صفحات العميل (للعملاء فقط، ليس للموظفين)
  const customerPaths = ["/profile", "/auth/signin", "/auth/callback"];
  const isCustomerPath = customerPaths.some((path) =>
    pathname.startsWith(path)
  );

  // إذا كان يحاول الوصول لصفحات الإدارة وهو ليس موظفاً
  if (isAdminPath && !isEmployee) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // إذا كان يحاول الوصول للمطبخ وهو ليس شيفاً أو مديراً
  if (
    isKitchenPath &&
    (!isEmployee || (userRole !== "chief" && userRole !== "admin"))
  ) {
    if (isEmployee) {
      if (userRole === "cashier") {
        const ordersUrl = new URL("/orders", request.url);
        return NextResponse.redirect(ordersUrl);
      } else {
        const adminUrl = new URL("/admin/", request.url);
        return NextResponse.redirect(adminUrl);
      }
    } else {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // إذا كان يحاول الوصول لصفحات الطلبات وهو ليس كاشيراً أو مديراً
  if (
    isOrderPath &&
    (!isEmployee || (userRole !== "cashier" && userRole !== "admin"))
  ) {
    if (isEmployee) {
      if (userRole === "chief") {
        const kitchenUrl = new URL("/kitchen", request.url);
        return NextResponse.redirect(kitchenUrl);
      } else {
        const adminUrl = new URL("/admin/", request.url);
        return NextResponse.redirect(adminUrl);
      }
    } else {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // إذا كان موظفاً ويحاول الوصول لصفحات العميل
  if (isCustomerPath && isEmployee) {
    if (userRole === "admin") {
      const adminUrl = new URL("/admin/", request.url);
      return NextResponse.redirect(adminUrl);
    } else if (userRole === "cashier") {
      const ordersUrl = new URL("/orders", request.url);
      return NextResponse.redirect(ordersUrl);
    } else if (userRole === "chief") {
      const kitchenUrl = new URL("/kitchen", request.url);
      return NextResponse.redirect(kitchenUrl);
    }
  }

  // السماح لجميع الطلبات الأخرى بالمرور
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/kitchen/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
