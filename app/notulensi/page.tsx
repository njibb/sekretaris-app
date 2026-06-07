import Link from "next/link";
import { getServerSession } from "next-auth/next";
import NavbarUser from "../components/navbaruser";
import { prisma } from "@/lib/prisma";

export default async function DaftarNotulensiPage() {
  const session = await getServerSession();

  // Tarik semua data rapat
  const semuaRapat = await prisma.rapat.findMany({
    orderBy: { tanggal: 'desc' },
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-12">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm relative z-50 mb-6">
        <Link href="/" className="text-xl font-bold text-emerald-700 hover:opacity-80 transition-opacity">
          Sekretariat Irmala
        </Link>
        <NavbarUser session={session} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Katalog <span className="text-emerald-600">Notulensi</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Arsip seluruh keputusan dan jalannya rapat Karang Taruna.</p>
          </div>
          {session && (
            <Link href="/catat-rapat" className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-700 shadow-sm">
              + Catat Rapat
            </Link>
          )}
        </div>

        {/* BENTUK KOTAK-KOTAK (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {semuaRapat.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-100">
              Belum ada arsip rapat.
            </div>
          ) : (
            semuaRapat.map((rapat) => (
              <Link href={`/notulensi/${rapat.id}`} key={rapat.id} className="block group">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                      Arsip Rapat
                    </span>
                    <span className="text-xs font-bold text-gray-400">{formatDate(rapat.tanggal)}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {rapat.judul}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {rapat.keputusan}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                    <div className="text-xs text-gray-500">
                      Notulis: <span className="font-bold text-gray-700">{rapat.pic}</span>
                    </div>
                    <span className="text-emerald-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                      Buka &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}