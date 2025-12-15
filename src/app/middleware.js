// ملف: app/middleware.js
import { NextResponse } from "next/server";
import { supabase } from "./_services/supabase";

export async function middleware(request) {
  // السماح لجميع الطلبات بالمرور، هذا فقط للتحقق
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
