'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NavbarUser({ session }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const name = session?.user?.name || "Admin Sekretaris";
  const role = "SEKRETARIS";
  const initial = "S";

  return (
    <>
      {/* ============================== */}
      {/* TAMPILAN DESKTOP               */}
      {/* ============================== */}
      <div className="hidden md:flex items-center space-x-6 md:space-x-8">
        
        {/* Menu & Tombol Create Khusus Pengurus Login */}
        {session && (
          <div className="flex items-center space-x-6 mr-4 border-r border-gray-200 pr-6">
            <Link href="/surat" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">Arsip Surat</Link>
            <Link href="/kalender" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">Kalender</Link>
            
            {/* Tombol Aksi Cepat */}
            <div className="flex space-x-2">
              <Link href="/surat/tambah" className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors">
                + Buat Surat
              </Link>
              <Link href="/catat-rapat" className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors">
                + Catat Rapat
              </Link>
            </div>
          </div>
        )}

        {session ? (
          <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold text-gray-800">{name}</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md self-end mt-0.5">{role}</span>
              </div>
              <div className="h-9 w-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {initial}
              </div>
            </div>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                  Keluar (Logout)
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="text-sm font-semibold text-emerald-600 hover:text-white hover:bg-emerald-600 border-2 border-emerald-600 px-5 py-2 rounded-xl transition-all shadow-sm">
            Login Pengurus
          </Link>
        )}
      </div>

      {/* ============================== */}
      {/* TAMPILAN MOBILE (Hamburger)    */}
      {/* ============================== */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-800 hover:text-emerald-600 focus:outline-none p-2">
          {isMobileMenuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          )}
        </button>
      </div>

      {/* ISI MENU MOBILE DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 shadow-lg md:hidden z-50">
          <div className="px-6 py-5 flex flex-col space-y-5">
            {session ? (
              <>
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-50">
                  <div className="h-11 w-11 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">{initial}</div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-800">{name}</span>
                    <span className="text-xs font-semibold text-emerald-600 mt-0.5">{role}</span>
                  </div>
                </div>
                
                {/* Tombol Create di Mobile */}
                <div className="grid grid-cols-2 gap-3 pb-2 border-b border-gray-50">
                  <Link href="/surat/tambah" onClick={() => setIsMobileMenuOpen(false)} className="bg-emerald-50 text-emerald-700 text-center py-2 rounded-lg text-sm font-bold">
                    + Buat Surat
                  </Link>
                  <Link href="/catat-rapat" onClick={() => setIsMobileMenuOpen(false)} className="bg-emerald-50 text-emerald-700 text-center py-2 rounded-lg text-sm font-bold">
                    + Catat Rapat
                  </Link>
                </div>

                <Link href="/surat" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-emerald-700">Arsip Surat</Link>
                <Link href="/kalender" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-emerald-700">Kalender Kerja</Link>
                
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm font-semibold text-red-600 hover:text-red-700 text-left pt-2 border-t border-gray-50">
                  Keluar (Logout)
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-emerald-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-emerald-700">
                Login Pengurus
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}