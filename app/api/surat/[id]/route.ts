import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Menggunakan tipe "any" sementara untuk parameter agar aman di berbagai versi Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, context: any) {
  try {
    // Trik aman: Kita 'await' params-nya karena Next.js versi terbaru mewajibkannya
    const params = await context.params;
    const id = params.id;

    console.log("Mencoba menghapus surat dengan ID:", id);

    // Langsung hajar pakai id bawaan
    await prisma.surat.delete({
      where: { id: id }, 
    });

    console.log("Surat dengan ID", id, "berhasil dihapus!");
    return NextResponse.json({ message: "Surat berhasil dihapus!" });

  } catch (error) {
    // Ini akan mencetak alasan ASLI errornya ke Terminal VS Code
    console.error(">>> GAGAL MENGHAPUS SURAT. DETAIL ERROR:", error);
    return NextResponse.json({ error: "Gagal menghapus surat" }, { status: 500 });
  }
}