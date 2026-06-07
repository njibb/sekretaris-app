import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  // Gembok Keamanan API
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Dilarang akses! Silakan login." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { judul, tanggal, pic, keputusan } = body;

    const rapatBaru = await prisma.rapat.create({
      data: {
        judul: judul,
        tanggal: new Date(tanggal),
        pic: pic,
        keputusan: keputusan,
      },
    });

    return NextResponse.json({ message: "Notulensi rapat berhasil disimpan!", data: rapatBaru });
  } catch (error) {
    console.error("Gagal simpan rapat:", error);
    return NextResponse.json({ error: "Gagal menyimpan ke database" }, { status: 500 });
  }
}