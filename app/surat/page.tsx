import Link from "next/link";
import { getServerSession } from "next-auth/next";
// 1. IMPORT AUTH OPTIONS (Pastikan path folder ini sesuai dengan letak file route.ts lu)
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import NavbarUser from "../components/navbaruser";
import DeleteSuratButton from "../components/deletesuratbutton"; 
import { prisma } from "@/lib/prisma";

export default async function ArsipSuratPage() {
  // 2. MASUKIN AUTH OPTIONS KE DALAM KURUNG
  const session = await getServerSession(authOptions);

  const semuaSurat = await prisma.surat.findMany({
    orderBy: {
      tanggal: 'desc',
    },
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Arsip <span className="text-emerald-600">Surat</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Daftar lengkap seluruh rekam jejak surat masuk dan keluar.</p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/surat/tambah" className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Buat Surat Baru
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase rounded-lg">
                <tr>
                  <th className="px-6 py-4 rounded-l-lg font-bold">Perihal & Nomor Surat</th>
                  <th className="px-6 py-4 font-bold">Tipe</th>
                  <th className="px-6 py-4 font-bold">Tujuan / Asal</th>
                  <th className="px-6 py-4 font-bold">Tanggal</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 rounded-r-lg font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {semuaSurat.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Belum ada arsip surat yang tersimpan di database.
                    </td>
                  </tr>
                ) : (
                  semuaSurat.map((surat) => (
                    <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-base">{surat.perihal}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">{surat.nomor_surat}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${surat.tipe === 'KELUAR' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                          {surat.tipe === 'KELUAR' ? 'Surat Keluar' : 'Surat Masuk'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 font-medium">{surat.tujuan_asal}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {formatDate(surat.tanggal)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          Tersimpan
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <DeleteSuratButton id={surat.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}