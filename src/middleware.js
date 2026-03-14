import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const PUBLIC_PATHS = ["/login", "/admin"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // If user is on /login and already has a valid session, redirect to /expenses
  if (pathname.startsWith("/login")) {
    const token = request.cookies.get("split-session")?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.redirect(new URL("/expenses", request.url));
      } catch {
        // Invalid token — let them stay on login
      }
    }
    return NextResponse.next();
  }

  // Allow other public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("split-session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
