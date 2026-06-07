/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteSuratButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Munculkan pop-up konfirmasi
    const confirmed = confirm('Yakin mau menghapus arsip surat ini? Data tidak bisa dikembalikan lho.');
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/surat/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Refresh halaman otomatis biar suratnya langsung hilang dari tabel
        router.refresh();
      } else {
        alert('Gagal menghapus arsip.');
      }
    } catch (error) {
      alert('Terjadi kesalahan pada sistem.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
    >
      {isDeleting ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}