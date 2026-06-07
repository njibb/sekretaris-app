import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nomorSurat, perihal, tujuan } = body;

    // Simpan data surat ke database Prisma
    const suratBaru = await prisma.surat.create({
      data: {
        tipe: "KELUAR", // Karena form ini untuk bikin surat, otomatis statusnya "KELUAR"
        nomor_surat: nomorSurat,
        perihal: perihal,
        tujuan_asal: tujuan,
        tanggal: new Date(), // Set tanggal masuk database menggunakan waktu saat ini
        keterangan: "Dibuat via Generator Otomatis",
      },
    });

    return NextResponse.json({ message: "Surat berhasil diarsipkan!", data: suratBaru });
  } catch (error) {
    console.error("Gagal simpan surat:", error);
    return NextResponse.json({ error: "Gagal menyimpan ke database" }, { status: 500 });
  }
}