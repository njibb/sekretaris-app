import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const userBaru = await prisma.user.create({
      data: {
        name: "Admin Sekretaris",
        email: "sekretaris@irmala.com",
        password: hashedPassword,
        role: "SEKRETARIS",
      },
    });

    return NextResponse.json({ 
      pesan: "Mantap Jib! Akun berhasil dibikin lagi.", 
      user: userBaru 
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // NAH INI YANG KITA UBAH BIAR KELIATAN PENYEBAB ASLINYA
    return NextResponse.json({ 
      pesan: "Gagal bikin akun", 
      penyebab_asli: error.message, // <--- Ini kuncinya bre!
      nama_error: error.name
    });
  }
}