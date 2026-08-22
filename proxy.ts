import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const privatePath = (process.env.STUDIO_PATH || "/studio-pulse-7k4m9x").replace(/\/$/, "");
  const pathname = request.nextUrl.pathname;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return new NextResponse("Page introuvable", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" } });
  if (pathname === privatePath || pathname.startsWith(`${privatePath}/`)) {
    const url = request.nextUrl.clone(); url.pathname = `/admin${pathname.slice(privatePath.length)}`;
    const response = NextResponse.rewrite(url); response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive"); response.headers.set("Cache-Control", "private, no-store"); return response;
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|manifest.webmanifest).*)"] };
