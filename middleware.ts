import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Arahkan ke sini kalau belum login
  },
});

// Tentukan halaman mana saja yang HARUS login (dilindungi)
export const config = {
  matcher: [
    "/surat/:path*",      // Kunci semua yang ada di dalam /surat
    "/anggota/:path*",    // Kunci semua yang ada di dalam /anggota
    "/notulensi/:path*",  // Kunci semua yang ada di dalam /notulensi
    "/dashboard/:path*",  // Kunci dashboard admin
  ],
};