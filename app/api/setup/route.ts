import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: "sekretaris@irmala.com" },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Akun sekretaris sudah ada di database!" });
    }

    const hashedPassword = await bcrypt.hash("irmala123", 10);

    const newUser = await prisma.user.create({
      data: {
        name: "Admin Sekretaris",
        email: "sekretaris@irmala.com",
        password: hashedPassword,
        role: "SEKRETARIS",
      },
    });

    return NextResponse.json({ 
      message: "Sukses! Akun berhasil disuntikkan ke database.", 
      email: newUser.email 
    });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}