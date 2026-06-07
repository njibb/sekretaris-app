import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TambahKalenderPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  async function gasSimpan(formData: FormData) {
    "use server";
    const judul = formData.get("judul") as string;
    const tanggal = new Date(formData.get("tanggal") as string);

    await prisma.KalenderKerja.create({
      data: { judul, tanggal }
    });
    redirect("/kalender");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-xl mx-auto">
        
        {/* Tombol Back */}
        <Link href="/kalender" className="inline-block mb-6 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors">
          &larr; Kembali ke Kalender
        </Link>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Tambah Agenda Baru</h1>
          <p className="text-gray-500 mb-8 text-sm">Tambahkan agenda kegiatan organisasi ke dalam kalender.</p>
          
          <form action={gasSimpan} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Agenda</label>
              <input 
                name="judul" 
                placeholder="Contoh: Rapat Koordinasi..." 
                required 
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-gray-900" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal</label>
              <input 
                type="date" 
                name="tanggal" 
                required 
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-gray-900" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl transition-all mt-2 shadow-lg shadow-emerald-100"
            >
              Simpan Agenda
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}