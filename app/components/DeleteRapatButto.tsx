'use client'; // PENTING! Ini tandanya file ini Client Component

import { useTransition } from "react";

export default function DeleteRapatButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold bg-red-50 px-4 py-2 rounded-xl transition-colors"
      onClick={() => {
        if (confirm("Yakin mau hapus notulensi ini?")) {
          startTransition(() => {
            action();
          });
        }
      }}
      disabled={isPending}
    >
      {isPending ? "Menghapus..." : "Hapus Notulensi"}
    </button>
  );
}