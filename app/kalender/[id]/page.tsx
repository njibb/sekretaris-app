import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import DeleteKalenderButton from "../../components/DeleteKalenderButton";

export default async function DetailKalenderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  const resolvedParams = await params;
  
  const agenda = await prisma.kalenderKerja.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!agenda) notFound();

  async function hapusAgenda() {
    "use server";
    await prisma.kalenderKerja.delete({ where: { id: resolvedParams.id } });
    redirect("/kalender");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/kalender" className="text-sm font-bold text-gray-400 hover:text-emerald-600 mb-6 block">&larr; Kembali</Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <span className="text-emerald-600 font-bold text-sm">Agenda Kegiatan</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-6">{agenda.judul}</h1>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase">Tanggal</h3>
            <p className="text-lg font-semibold text-gray-900">{agenda.tanggal.toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase">Detail Kegiatan</h3>
            <p className="text-gray-700 mt-2 whitespace-pre-wrap">{agenda.deskripsi || "Tidak ada detail tambahan."}</p>
          </div>

          {session && (
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <DeleteKalenderButton action={hapusAgenda} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}