'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { UserProfile } from '@/lib/types';
import { Sparkles, LogOut, User, Menu, X, PlusCircle, BookOpen, Layers } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Listen to Firebase Auth state if configured
    let unsubscribe: () => void = () => {};

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Try to fetch additional profile info from Firestore
            if (db) {
              const docRef = doc(db, 'users', user.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const data = docSnap.data();
                setCurrentUser({
                  id: user.uid,
                  fullName: data.fullName || user.displayName || user.email?.split('@')[0] || 'مستخدم',
                  university: data.university || 'عضو هيئة التدريس',
                  email: user.email || '',
                  createdAt: data.createdAt || new Date().toISOString()
                });
                return;
              }
            }
            
            // Fallback if no Firestore doc exists
            setCurrentUser({
              id: user.uid,
              fullName: user.displayName || user.email?.split('@')[0] || 'مستخدم',
              university: 'عضو هيئة التدريس',
              email: user.email || '',
              createdAt: new Date().toISOString()
            });
          } catch (e) {
            console.error("Error fetching user data:", e);
          }
        } else {
          // If no Firebase user, check local fallback
          checkLocalSession();
        }
      });
    } else {
      checkLocalSession();
    }

    const checkLocalSession = () => {
      const stored = localStorage.getItem('muwamah_user');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', checkLocalSession);
    window.addEventListener('muwamah_auth_change', checkLocalSession);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', checkLocalSession);
      window.removeEventListener('muwamah_auth_change', checkLocalSession);
    };
  }, [pathname]);

  const handleLogout = async () => {
    if (auth && currentUser && !currentUser.id.startsWith('usr_')) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
    
    // Clear local fallback
    localStorage.removeItem('muwamah_user');
    window.dispatchEvent(new Event('muwamah_auth_change'));
    setCurrentUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'عن المنصة' },
    ...(currentUser ? [{ href: '/dashboard', label: 'لوحة التحكم' }] : []),
    { href: '/analyze', label: 'مواءمة مقرر جديد' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F1EFE8]/95 backdrop-blur-md border-b border-[#E2DDD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <BrandLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'text-[#0F6E56] border-[#0F6E56]'
                      : 'text-[#5F5E5A] border-transparent hover:text-[#085041] hover:border-[#E2DDD4]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0C5A46] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-subtle transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>تحليل مقرر</span>
                </Link>

                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#E2DDD4]">
                  <div className="w-8 h-8 rounded-full bg-[#E6F3EF] text-[#0F6E56] flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.slice(0, 1)}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-[#085041] line-clamp-1 max-w-[120px]">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-[#5F5E5A] line-clamp-1 max-w-[120px]">
                      {currentUser.university}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="p-2 text-[#5F5E5A] hover:text-[#D85A30] hover:bg-[#FBECE7] rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth?mode=login"
                  className="text-sm font-bold text-[#085041] hover:text-[#0F6E56] px-4 py-2 transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0C5A46] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-subtle transition-all transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>سجل الدخول وابدأ</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#085041] hover:bg-white/50 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2DDD4] px-4 pt-3 pb-6 space-y-4 shadow-elevated absolute w-full">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-semibold ${
                  pathname === link.href
                    ? 'bg-[#E6F3EF] text-[#0F6E56]'
                    : 'text-[#5F5E5A] hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#E2DDD4] space-y-3">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#E6F3EF] text-[#0F6E56] flex items-center justify-center font-bold">
                    {currentUser.fullName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-bold text-[#085041] text-sm">{currentUser.fullName}</div>
                    <div className="text-xs text-[#5F5E5A]">{currentUser.university}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-[#D85A30] bg-[#FBECE7] rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth?mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 text-sm font-bold text-[#085041] border border-[#E2DDD4] rounded-xl text-center"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 text-sm font-bold text-white bg-[#0F6E56] rounded-xl text-center"
                >
                  حساب جديد
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
