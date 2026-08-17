import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Shield, Sparkles, BookOpen, GraduationCap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#085041] text-white pt-16 pb-12 border-t border-[#0F6E56]/40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" variant="inverted" />
            <p className="text-emerald-100/80 text-sm leading-relaxed max-w-md pt-2">
              منصة ذكية متخصصة لمساعدة أساتذة الجامعات والقيادات الأكاديمية على مواءمة خطط
              المقررات الدراسية مع متطلبات سوق العمل المتجددة باستخدام تقنيات الذكاء الاصطناعي.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#0F6E56]/60 px-3 py-1.5 rounded-full text-xs text-emerald-200 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-[#D85A30]" />
              <span>من قاعات الجامعة إلى احتياجات سوق العمل</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm font-arabic">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  عن المنصة ومراحل العمل
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">
                  بدء مواءمة مقرر
                </Link>
              </li>
              <li>
                <Link href="/auth?mode=signup" className="hover:text-white transition-colors">
                  إنشاء حساب أستاذ جديد
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tracks */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm font-arabic">المسارات المهنية المغطاة</h4>
            <ul className="space-y-2 text-xs text-emerald-100/70">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D85A30]"></div>
                <span>هندسة وتطوير البرمجيات</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D85A30]"></div>
                <span>تحليل البيانات والذكاء الاصطناعي</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D85A30]"></div>
                <span>التسويق الرقمي وإدارة النمو</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D85A30]"></div>
                <span>إدارة المشاريع الرقمية والرشاقة</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D85A30]"></div>
                <span>الأمن السيبراني وحماية النظم</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-100/60 gap-4">
          <div>
            جميع الحقوق محفوظة منصة مواءمة © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-6">
            <span>مدعوم بنماذج الذكاء الاصطناعي الأكاديمية المتطورة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
