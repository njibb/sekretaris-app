'use client';
import { useTransition } from "react";

export default function DeleteKalenderButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => {
        if (confirm("Yakin mau hapus agenda ini?")) {
          startTransition(() => { action(); });
        }
      }}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 font-bold bg-red-50 px-4 py-2 rounded-xl transition-colors text-sm"
    >
      {isPending ? "Menghapus..." : "Hapus Agenda"}
    </button>
  );
}