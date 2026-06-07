'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FormRapat() {
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: '',
    pic: '',
    keputusan: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/rapat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Mantap! Notulensi rapat berhasil disimpan ke database.');
        setFormData({ judul: '', tanggal: '', pic: '', keputusan: '' });
      } else {
        alert('Gagal menyimpan notulensi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-emerald-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <h1 className="text-xl font-bold text-emerald-700">Catat Notulensi Rapat</h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold">Formulir Hasil Rapat</h2>
            <p className="text-emerald-100 text-sm mt-1">Pastikan keputusan yang dicatat sudah disepakati bersama oleh forum.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Judul Agenda Rapat</label>
              <input type="text" name="judul" required value={formData.judul} onChange={handleChange} placeholder="Rapat Rutin Awal Bulan" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Rapat</label>
                <input type="date" name="tanggal" required value={formData.tanggal} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Penanggung Jawab / Notulen</label>
                <input type="text" name="pic" required value={formData.pic} onChange={handleChange} placeholder="Nama Notulen" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Poin-poin Keputusan</label>
              <textarea name="keputusan" required rows={6} value={formData.keputusan} onChange={handleChange} placeholder="1. Iuran kas dinaikkan&#10;2. Kerja bakti diadakan hari minggu..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 resize-none whitespace-pre-wrap"></textarea>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 text-lg">
                {isSaving ? 'Menyimpan...' : 'Simpan Notulensi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}