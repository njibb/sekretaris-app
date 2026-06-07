import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; // Pakai @ biar aman dari garis merah
import bcrypt from "bcrypt";

// 1. KITA BUAT VARIABEL authOptions DAN LANGSUNG DI-EXPORT
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (isMatch) {
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }
        return null;
      }
    })
  ],
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

// 2. KITA MASUKIN authOptions TADI KE DALAM SINI
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };