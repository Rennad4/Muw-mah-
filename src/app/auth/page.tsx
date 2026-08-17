'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import {
  User,
  Building2,
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  X,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [tab, setTab] = useState<'login' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setTab('signup');
    } else if (searchParams.get('mode') === 'login') {
      setTab('login');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      setIsLoading(false);
      return;
    }

    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/analyze');
      } catch (error: any) {
        console.error("Firebase Login Error:", error);
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback for when Firebase is not configured yet
      const profile = {
        id: 'usr_' + Date.now(),
        fullName: email.split('@')[0] || 'عضو هيئة التدريس',
        university: 'جامعة الملك سعود / كلية علوم الحاسب',
        email: email,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('muwamah_user', JSON.stringify(profile));
      window.dispatchEvent(new Event('muwamah_auth_change'));
      router.push('/analyze');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!fullName || !university || !email || !password || !confirmPassword) {
      setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين، يرجى إعادة التحقق.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('يجب أن تتكون كلمة المرور من ٦ خانات على الأقل.');
      setIsLoading(false);
      return;
    }

    if (auth && db) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with full name
        await updateProfile(user, { displayName: fullName });

        // Save additional user info to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          fullName,
          university,
          email,
          createdAt: new Date().toISOString()
        });

        setSuccessMsg('تم إنشاء الحساب بنجاح! جاري تحويلك...');
        setTimeout(() => {
          router.push('/analyze');
        }, 1000);
      } catch (error: any) {
        console.error("Firebase Signup Error:", error);
        if (error.code === 'auth/email-already-in-use') {
          setErrorMsg('هذا البريد الإلكتروني مسجل مسبقاً.');
        } else {
          setErrorMsg('حدث خطأ أثناء إنشاء الحساب. تأكد من صحة البيانات واتصالك بالإنترنت.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback
      const profile = {
        id: 'usr_' + Date.now(),
        fullName,
        university,
        email,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('muwamah_user', JSON.stringify(profile));
      window.dispatchEvent(new Event('muwamah_auth_change'));
      setSuccessMsg('تم إنشاء الحساب بنجاح! جاري تحويلك...');
      setTimeout(() => {
        router.push('/analyze');
      }, 1000);
    }
  };

  const handleQuickDemoLogin = () => {
    const demoProfile = {
      id: 'usr_demo_1',
      fullName: 'د. عبد الله القرني',
      university: 'جامعة الملك فهد للبترول والمعادن',
      email: 'dr.al-qarni@university.edu.sa',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('muwamah_user', JSON.stringify(demoProfile));
    window.dispatchEvent(new Event('muwamah_auth_change'));
    router.push('/analyze');
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    
    if (auth) {
      try {
        await sendPasswordResetEmail(auth, forgotEmail);
        setForgotSent(true);
      } catch (error: any) {
        console.error("Firebase Reset Password Error:", error);
        // Even if error, show success to prevent email enumeration, or show generic error
        setForgotSent(true);
      }
    } else {
      setForgotSent(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <BrandLogo size="lg" />
        </div>
        <p className="text-xs text-[#5F5E5A] font-medium">
          بوابة أساتذة الجامعات والقيادات الأكاديمية
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DDD4] shadow-card">
        <div className="grid grid-cols-2 bg-[#F1EFE8] p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 text-sm font-bold rounded-xl transition-all font-arabic ${
              tab === 'login'
                ? 'bg-white text-[#0F6E56] shadow-subtle'
                : 'text-[#5F5E5A] hover:text-[#085041]'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 text-sm font-bold rounded-xl transition-all font-arabic ${
              tab === 'signup'
                ? 'bg-white text-[#0F6E56] shadow-subtle'
                : 'text-[#5F5E5A] hover:text-[#085041]'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-[#E6F3EF] border border-[#0F6E56]/30 text-[#0F6E56] text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0F6E56]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#085041] mb-1.5 block">
                البريد الإلكتروني الجامعي أو المهني
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu.sa"
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] placeholder:text-[#5F5E5A]/40 focus:bg-white focus:outline-none focus:border-[#0F6E56] transition-colors"
                />
                <Mail className="w-4 h-4 text-[#5F5E5A]/50 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#085041]">
                  كلمة المرور
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotSent(false);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-[#D85A30] hover:underline font-semibold"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] placeholder:text-[#5F5E5A]/40 focus:bg-white focus:outline-none focus:border-[#0F6E56] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#5F5E5A]/50 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#0F6E56] rounded cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-[#5F5E5A] cursor-pointer">
                تذكرني على هذا الجهاز
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0F6E56] hover:bg-[#0C5A46] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-subtle transition-all transform active:scale-98 text-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>{isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
              {!isLoading && <ArrowLeft className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#085041] mb-1.5 block">
                الاسم الكامل (مع اللقب العلمي)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="د. سارة بنت محمد العتيبي"
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] placeholder:text-[#5F5E5A]/40 focus:bg-white focus:outline-none focus:border-[#0F6E56] transition-colors"
                />
                <User className="w-4 h-4 text-[#5F5E5A]/50 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#085041] mb-1.5 block">
                اسم الجامعة أو الجهة الأكاديمية
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="جامعة الملك عبد العزيز / كلية الهندسة"
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] placeholder:text-[#5F5E5A]/40 focus:bg-white focus:outline-none focus:border-[#0F6E56] transition-colors"
                />
                <Building2 className="w-4 h-4 text-[#5F5E5A]/50 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#085041] mb-1.5 block">
                البريد الإلكتروني الأكاديمي
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sara@kau.edu.sa"
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] placeholder:text-[#5F5E5A]/40 focus:bg-white focus:outline-none focus:border-[#0F6E56] transition-colors"
                />
                <Mail className="w-4 h-4 text-[#5F5E5A]/50 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#085041] mb-1.5 block">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] placeholder:text-[#5F5E5A]/40 focus:bg-white focus:outline-none focus:border-[#0F6E56] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#5F5E5A]/50 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#085041] mb-1.5 block">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] placeholder:text-[#5F5E5A]/40 focus:bg-white focus:outline-none focus:border-[#0F6E56] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#5F5E5A]/50 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0F6E56] hover:bg-[#0C5A46] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-subtle transition-all transform active:scale-98 text-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>{isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب جديد'}</span>
              {!isLoading && <ArrowLeft className="w-4 h-4" />}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-[#E2DDD4] text-center">
          <p className="text-[11px] text-[#5F5E5A] mb-3">
            للتجربة السريعة والمباشرة بدون إدخال بيانات:
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-[#E6F3EF] text-[#0F6E56] text-xs font-bold py-2.5 px-4 rounded-xl border border-[#0F6E56]/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D85A30]" />
            <span>الدخول السريع كأستاذ جامعي تجريبي</span>
          </button>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E2DDD4] shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FBECE7] text-[#D85A30] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#085041] text-base font-arabic">
                  استعادة كلمة المرور
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-[#5F5E5A] hover:text-[#085041] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSent ? (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-[#E6F3EF] rounded-2xl border border-[#0F6E56]/20 text-[#085041] text-xs leading-relaxed">
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح (إن كان مسجلاً لدينا). يرجى فحص صندوق الوارد.
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full bg-[#0F6E56] text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-[#5F5E5A] leading-relaxed">
                  أدخل بريدك الإلكتروني الأكاديمي وسنرسل لك تعليمات استعادة الوصول إلى حسابك:
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@university.edu.sa"
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-2.5 text-sm text-[#085041] focus:outline-none focus:border-[#0F6E56]"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#5F5E5A] hover:bg-slate-100 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#0F6E56] hover:bg-[#0C5A46] rounded-xl shadow-subtle"
                  >
                    إرسال الرابط
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-[#0F6E56]">جاري التحميل...</div>}>
      <AuthContent />
    </Suspense>
  );
}
