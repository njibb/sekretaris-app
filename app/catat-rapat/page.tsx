import { getServerSession } from "next-auth/next";
import Link from "next/link";
import FormRapat from "./formrapat";

export default async function CatatRapatPage() {
  const session = await getServerSession();

  // Kalau BELUM LOGIN, tampilkan halaman blokir ini
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-500 mb-6 text-sm">Hanya pengurus yang memiliki hak akses untuk mencatat notulensi rapat Karang Taruna.</p>
          <Link href="/login" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors w-full block">
            Login Sistem
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-emerald-600 mt-4 block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Kalau SUDAH LOGIN, jalankan formnya
  return <FormRapat />;
}