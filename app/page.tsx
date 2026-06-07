import Link from "next/link";
import { getServerSession } from "next-auth/next";
import NavbarUser from "./components/navbaruser";
import { prisma } from "@/lib/prisma";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function HomePage() {
  const session = await getServerSession();

  // TARIK DATA SURAT
  const suratTerbaru = await prisma.surat.findMany({
    orderBy: { tanggal: 'desc' },
    take: 5,
  });

  // TARIK DATA RAPAT PALING BARU
  const rapatTerbaru = await prisma.rapat.findFirst({
    orderBy: { tanggal: 'desc' },
  });

  // TARIK DATA KALENDER KERJA (Data Asli!)
  const agendaTerbaru = await prisma.kalenderKerja.findMany({
    orderBy: { tanggal: 'asc' }, // Urutkan dari yang paling dekat
    take: 3,
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(date);
  };

  // Helper buat ngambil nama bulan & tanggal buat UI Kalender
  const getMonthName = (date: Date) => date.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
  const getDay = (date: Date) => date.getDate().toString().padStart(2, '0');

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-12">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm relative z-50 mb-6">
        <Link href="/" className="text-xl font-bold text-emerald-700 hover:opacity-80 transition-opacity">
          Sekretariat Irmala
        </Link>
        <NavbarUser session={session} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Monitoring <span className="text-emerald-600">Operasional</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Pantauan real-time sirkulasi surat, agenda rapat, dan kalender kerja IRMALA.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Widget 1: Status Surat */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  Status Surat Terkini
                </h2>
                <Link href="/surat" className="text-sm font-semibold text-emerald-600 hover:underline">Lihat Semua</Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase rounded-lg">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Perihal & Nomor</th>
                      <th className="px-4 py-3">Tipe</th>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3 rounded-r-lg text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {suratTerbaru.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Belum ada arsip surat.</td>
                      </tr>
                    ) : (
                      suratTerbaru.map((surat) => (
                        <tr key={surat.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-900">{surat.perihal}</p>
                            <p className="text-xs text-gray-500">{surat.nomor_surat}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${surat.tipe === 'KELUAR' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                              {surat.tipe === 'KELUAR' ? 'Keluar' : 'Masuk'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(surat.tanggal)}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Tersimpan</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Widget 2: Kalender Kerja (Data ASLI dari DB) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Kalender Kerja Organisasi
              </h2>
              <div className="space-y-4">
                {agendaTerbaru.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Belum ada agenda terdaftar.</p>
                ) : (
                    agendaTerbaru.map((agenda: { id: Key | null | undefined; tanggal: Date; judul: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <div key={agenda.id} className="flex items-start p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors bg-gray-50 hover:bg-white">
                        <div className="flex-shrink-0 w-14 text-center mr-4">
                        <p className="text-xs font-bold text-gray-400 uppercase">{getMonthName(agenda.tanggal)}</p>
                        <p className="text-xl font-black text-emerald-600 leading-none">{getDay(agenda.tanggal)}</p>
                        </div>
                        <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{agenda.judul}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Agenda Kegiatan</p>
                        </div>
                    </div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Widget 3: Notulensi Rapat */}
            <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <svg className="w-48 h-48 transform translate-x-10 -translate-y-10" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"></circle></svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-emerald-800 bg-opacity-40 text-emerald-50 px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase">
                    Hasil Rapat Terbaru
                  </span>
                  <span className="text-sm font-medium text-emerald-100">
                    {rapatTerbaru ? formatDate(rapatTerbaru.tanggal) : '-'}
                  </span>
                </div>
                
                {rapatTerbaru ? (
                  <>
                    <h3 className="text-xl font-bold mb-2">{rapatTerbaru.judul}</h3>
                    <p className="text-emerald-50 text-sm mb-6 leading-relaxed opacity-90 line-clamp-3">
                      {rapatTerbaru.keputusan}
                    </p>
                  </>
                ) : (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Belum ada rapat</h3>
                  </div>
                )}
                
                <Link href="/notulensi" className="inline-block w-full text-center bg-white text-emerald-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
                  Baca Selengkapnya
                </Link>
              </div>
            </div>

            {!session && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm text-center">
                <h3 className="font-bold text-gray-900 mb-1">Akses Edit Tertutup</h3>
                <Link href="/login" className="block w-full bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-900 transition-colors mt-2">
                  Login Sistem
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}