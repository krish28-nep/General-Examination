import { NextRequest, NextResponse } from "next/server";
import {jwtDecode} from "jwt-decode";

interface DecodedData {
  userId: number;
  name: string;
  role: string; // "Admin" or "Student"
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const token = req.cookies.get("auth_token")?.value;

  let decoded: DecodedData | null = null;

  if (token) {
    try {
      decoded = jwtDecode<DecodedData>(token);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const role = decoded?.role;
  const isAdmin = role === "Admin";
  const isStudent = role === "Student";



  const isAdminRoute = url.startsWith("/admin") && url !== "/admin";
  const isStudentRoute = url.startsWith("/student") && url !== "/student";
  const isAuthRoute = url==="/student" || url === "/admin";

  // Protect Admin routes
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect Student routes
  if (isStudentRoute && !isStudent) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect logged-in users away from auth pages
  if (token && isAuthRoute) {
    if (isAdmin) return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    if (isStudent) return NextResponse.redirect(new URL("/student/dashboard", req.url));
  }

  // Redirect not-logged-in users trying to access protected routes
  if (!token && (isAdminRoute || isStudentRoute)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
