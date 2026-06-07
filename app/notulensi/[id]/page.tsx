import Link from "next/link";
import { getServerSession } from "next-auth/next";
import NavbarUser from "../../components/navbaruser";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import DeleteRapatButton from "@/app/components/DeleteRapatButto";

export default async function DetailNotulensiPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  const resolvedParams = await params;
  const idRapat = resolvedParams.id;

  const rapat = await prisma.rapat.findUnique({
    where: { id: idRapat },
  });

  if (!rapat) {
    notFound(); 
  }

  // Fungsi Hapus (Server Action)
  async function hapusRapat() {
    "use server";
    await prisma.rapat.delete({
      where: { id: idRapat },
    });
    redirect("/notulensi"); 
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
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

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <Link href="/notulensi" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-emerald-600 mb-6 transition-colors">
          &larr; Kembali ke Katalog
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          {/* HEADER DOKUMEN */}
          <div className="text-center border-b border-gray-100 pb-8 mb-8">
            <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest inline-block mb-4">
              Dokumen Notulensi
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {rapat.judul}
            </h1>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {formatDate(rapat.tanggal)}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Dicatat oleh: <span className="font-bold text-gray-700">{rapat.pic}</span>
              </div>
            </div>
          </div>

          {/* ISI KEPUTUSAN */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Poin Keputusan:
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                {rapat.keputusan}
              </p>
            </div>
          </div>

          {/* TOMBOL HAPUS (Cuma muncul kalau Login) */}
        {session && (
            <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
              {/* Panggil komponen yang baru kita buat */}
              <DeleteRapatButton action={hapusRapat} />
            </div>
          )}
          
        </div>
      </div>
    </main>
  );
}