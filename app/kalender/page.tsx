import Link from "next/link";
import { getServerSession } from "next-auth/next";
import NavbarUser from "../components/navbaruser";
import { prisma } from "@/lib/prisma";

export default async function KalenderPage({ searchParams }: { searchParams: Promise<{ bulan?: string }> }) {
  const session = await getServerSession();
  const params = await searchParams;
  
  const bulanSekarang = new Date().getMonth() + 1;
  const bulanFilter = params.bulan ? parseInt(params.bulan) : bulanSekarang;

  const semuaAgenda = await prisma.kalenderKerja.findMany({
    orderBy: { tanggal: "asc" }
  });

  const agendaFiltrasi = semuaAgenda.filter((item: { tanggal: { getMonth: () => number; }; }) => {
    return item.tanggal.getMonth() + 1 === bulanFilter;
  });

  const daftarBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-12">
      {/* NAVBAR */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm relative z-50 mb-6">
        <Link href="/" className="text-xl font-bold text-emerald-700 hover:opacity-80 transition-opacity">
          Sekretariat Irmala
        </Link>
        <NavbarUser session={session} />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Kalender <span className="text-emerald-600">Kerja</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Pantau jadwal agenda organisasi setiap bulannya.</p>
          </div>
          {session && (
            <Link href="/kalender/tambah" className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-700 shadow-sm transition-all">
              + Tambah Agenda
            </Link>
          )}
        </div>

        {/* SELECTOR BULAN */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {daftarBulan.map((b, i) => (
            <Link 
              key={i} 
              href={`?bulan=${i + 1}`} 
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all border ${
                bulanFilter === i + 1 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
              }`}
            >
              {b}
            </Link>
          ))}
        </div>

        {/* LIST AGENDA (Klikable Card) */}
        <div className="space-y-4">
          {agendaFiltrasi.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-bold">Belum ada agenda di bulan ini.</p>
              <p className="text-sm text-gray-400">Silakan tambahkan agenda jika ada kegiatan baru.</p>
            </div>
          ) : (
            agendaFiltrasi.map((item) => (
              <Link href={`/kalender/${item.id}`} key={item.id} className="block group">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center hover:shadow-sm hover:border-emerald-100 transition-all">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {item.judul}
                    </h3>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-lg text-emerald-700 font-bold text-sm">
                    {item.tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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