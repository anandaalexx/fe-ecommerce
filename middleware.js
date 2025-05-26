import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const roleToPath = {
  4: "/admin",
  3: "/kurir",
  2: "/pengguna",
  1: "/home",
};

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const currentPath = request.nextUrl.pathname;

  // Kalau belum login, arahkan ke /login
  if (!token && currentPath !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Kalau sudah login, cek apakah sesuai dengan rolenya
  if (token && role) {
    // admin hanya boleh akses /admin
    if (role === "4" && !currentPath.startsWith("/admin")) {
      return NextResponse.redirect(new URL(roleToPath[4], request.url));
    }

    // kurir hanya boleh akses /kurir
    if (role === "3" && !currentPath.startsWith("/kurir")) {
      return NextResponse.redirect(new URL(roleToPath[3], request.url));
    }

    // penjual hanya boleh akses /penjual
    if (role === "2" && !currentPath.startsWith("/pengguna")) {
      return NextResponse.redirect(new URL(roleToPath[2], request.url));
    }

    // pembeli tidak boleh ke /admin atau /penjual atau /kurir
    if (  
      role === "1" &&
      ["/admin", "/pengguna", "/kurir"].some((p) => currentPath.startsWith(p))
    ) {
      return NextResponse.redirect(new URL(roleToPath[1], request.url));
    }
  }

  return NextResponse.next();
}

// Menentukan URL mana yang akan dicegat middleware
export const config = {
  matcher: ["/admin/:path*", "/kurir/:path*", "/pengguna/:path*", "/home", "/"],
};
