'use client';

import { useState } from 'react';
import Link from 'next/link';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export default function BuatSuratPage() {
  const [formData, setFormData] = useState({
    nomorSurat: '',
    perihal: '',
    tujuan: '',
    tanggal: '',
    isiSurat: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // 1. Ambil file template dari folder public
      const response = await fetch('/template-surat.docx');
      if (!response.ok) throw new Error('Template tidak ditemukan!');
      
      const blob = await response.blob();
      const reader = new FileReader();

      // Tambahkan async di sini agar bisa pakai await fetch ke database
      reader.onload = async function (event) {
        try {
          const content = event.target?.result;
          
          // 2. Masukkan ke dalam mesin PizZip
          const zip = new PizZip(content as ArrayBuffer);
          
          // 3. Inisialisasi Docxtemplater
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true, // Biar enter di textarea kebaca di Word
          });

          // 4. Masukkan data dari form ke dalam kurung kurawal
          doc.render({
            nomorSurat: formData.nomorSurat,
            tanggal: formData.tanggal,
            perihal: formData.perihal,
            tujuan: formData.tujuan,
            isiSurat: formData.isiSurat,
          });

          // 5. Generate file Word baru
          const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });

          // 6. Otomatis Download
          saveAs(out, `Surat_${formData.perihal.replace(/\s+/g, '_')}.docx`);
          
          // 7. Simpan Data ke Database Prisma
          try {
            await fetch('/api/surat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nomorSurat: formData.nomorSurat,
                perihal: formData.perihal,
                tujuan: formData.tujuan,
              })
            });
            alert('Surat berhasil dibuat dan diarsipkan ke database!');
          } catch (dbError) {
            console.error("Gagal menyimpan ke database:", dbError);
            alert('Surat berhasil di-download, tapi gagal diarsipkan ke sistem.');
          }
          
          setIsGenerating(false);
          
        } catch (error) {
          console.error("Error generating doc:", error);
          alert('Gagal memproses dokumen.');
          setIsGenerating(false);
        }
      };

      reader.readAsArrayBuffer(blob);

    } catch (error) {
      console.error(error);
      alert('Gagal mengambil template Word. Pastikan file template-surat.docx ada di folder public.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-emerald-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <h1 className="text-xl font-bold text-emerald-700">Buat Surat Baru</h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold">Formulir Penyuratan</h2>
            <p className="text-emerald-100 text-sm mt-1">Isi data di bawah ini untuk men-generate file dokumen Word secara otomatis.</p>
          </div>

          <form onSubmit={generateDocument} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Surat</label>
                <input
                  type="text"
                  name="nomorSurat"
                  required
                  value={formData.nomorSurat}
                  onChange={handleChange}
                  placeholder="034/PGR/GEMA RAMADHAN/I/2026"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Surat</label>
                <input
                  type="text"
                  name="tanggal"
                  required
                  value={formData.tanggal}
                  onChange={handleChange}
                  placeholder="16 Januari 2026"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Perihal</label>
              <input
                type="text"
                name="perihal"
                required
                value={formData.perihal}
                onChange={handleChange}
                placeholder="Proposal Gema Ramadhan"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tujuan (Kepada Yth.)</label>
              <input
                type="text"
                name="tujuan"
                required
                value={formData.tujuan}
                onChange={handleChange}
                placeholder="Bapak Taat (Ketua RW 01)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Isi Paragraf Utama</label>
              <textarea
                name="isiSurat"
                required
                rows={7}
                value={formData.isiSurat}
                onChange={handleChange}
                placeholder="Tuliskan isi inti dari surat di sini..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 resize-none whitespace-pre-wrap"
              ></textarea>
              <p className="text-xs text-gray-400 mt-2">*Kop surat, salam pembuka, penutup, dan tanda tangan akan terisi otomatis di file Word.</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-sm hover:shadow-md flex justify-center items-center gap-2 text-lg"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Memproses Dokumen...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Simpan & Download Word
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}