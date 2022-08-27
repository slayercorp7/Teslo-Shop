import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  
  if (req.nextUrl.pathname.startsWith("/checkout/")) {
    if (!session) {
      const requestedPage = req.nextUrl.pathname;
      const url = req.nextUrl.clone();
      url.pathname = `/auth/login`;
      url.search = `p=${requestedPage}`;
      return NextResponse.redirect(url);
    }
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      const requestedPage = req.nextUrl.pathname;
      const url = req.nextUrl.clone();
      url.pathname = `/auth/login`;
      url.search = `p=${requestedPage}`;
      return NextResponse.redirect(url);
    }
    const roles = ["admin", "super-user", "SEO"];
    //@ts-ignore
    if (!roles.includes(session.user.role)) {
      const url = req.nextUrl.clone();
      url.pathname = `/`;
      return NextResponse.redirect(url);
    }
  }
  
  if (req.nextUrl.pathname.startsWith("/api/admin/dashboard")) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = `/api/auth/unauthorized`;
      return NextResponse.redirect(url);
    }
    const roles = ["admin", "super-user", "SEO"];
    //@ts-ignore
    if (!roles.includes(session.user.role)) {
      const url = req.nextUrl.clone();
      url.pathname = `/api/auth/unauthorized`;
      return NextResponse.redirect(url);
    }
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/admin/:path*", "/api/admin/dashboard/:path*"],
};
