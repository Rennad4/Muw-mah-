import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import {
  UploadCloud,
  Briefcase,
  FileCheck2,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export default function AboutPage() {
  const steps = [
    {
      num: '١',
      title: '١. ارفع خطة المقرر',
      desc: 'قم برفع توصيف المقرر الدراسي بصيغة PDF أو DOCX، أو انسخ والصق النص مباشرة في الحقل المخصص.',
      icon: UploadCloud,
      color: 'teal',
    },
    {
      num: '٢',
      title: '٢. قارن مع سوق العمل',
      desc: 'اختر المسار المهني المناسب من قواعد البيانات الجاهزة أو ألصق إعلانات التوظيف الفعلية التي تستهدفها.',
      icon: Briefcase,
      color: 'coral',
    },
    {
      num: '٣',
      title: '٣. احصل على تعديلات جاهزة',
      desc: 'يقوم الذكاء الاصطناعي بحساب نسبة التوافق، وتحديد المهارات الناقصة، وتقديم صياغات أكاديمية بديلة قابلة للتعديل والتحميل كملف PDF.',
      icon: FileCheck2,
      color: 'teal',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title & Introduction */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-[#E2DDD4] text-xs font-bold text-[#0F6E56] shadow-subtle">
          <Sparkles className="w-3.5 h-3.5 text-[#D85A30]" />
          <span>عن منصة مواءمة</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#085041] font-arabic">
          سد الفجوة بين التعليم الأكاديمي وسوق العمل
        </h1>

        <p className="text-base sm:text-lg text-[#5F5E5A] leading-relaxed pt-2">
          تواجه الجامعات تحدياً مستمراً في مواكبة التسارع التقني والمهني في سوق العمل. صُممت
          منصة <strong className="text-[#085041]">مواءمة</strong> لتكون الأداة الذكية المعتمدة لعضو هيئة
          التدريس لمراجعة وتحديث الخطط الدراسية بكل موثوقية وسرعة.
        </p>
      </section>

      {/* Problem vs Solution Comparison Card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Problem */}
        <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-subtle relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-red-900 mb-3 font-arabic">
            التحدي الراهن (المشكلة)
          </h2>
          <p className="text-sm text-[#5F5E5A] leading-relaxed mb-4">
            تتغير متطلبات وظائف القطاع الخاص بوتيرة شهرية وسنوية، بينما تحتاج دورات تحديث الخطط
            الأكاديمية التقليدية إلى سنوات طويلة من اللجان والمقارنات اليدوية المضنية. هذا
            يخلق فجوة مهارية بين ما يتعلمه الطالب في القاعة وما تطلبه الشركات في المقابلات الوظيفية.
          </p>
          <ul className="space-y-2 text-xs text-red-800/80 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>صعوبة تتبع جميع الأدوات البرمجية والتقنيات الناشئة يدوياً.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>استهلاك وقت وجهد كبير من الأساتذة في إعداد تقارير التطوير.</span>
            </li>
          </ul>
        </div>

        {/* Solution */}
        <div className="bg-white p-8 rounded-3xl border border-[#0F6E56]/20 shadow-subtle relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F3EF] text-[#0F6E56] flex items-center justify-center mb-6">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#085041] mb-3 font-arabic">
            حل مواءمة الذكي
          </h2>
          <p className="text-sm text-[#5F5E5A] leading-relaxed mb-4">
            توظف مواءمة نماذج لغوية متقدمة مخصصة للمجال الأكاديمي، تقوم بقراءة التوصيف ومقارنته
            بآلاف الكلمات المفتاحية والمهارات المطلوبة مهنياً، ثم تصيغ مقترحات تعديل محددة تلائم
            الأعراف الجامعية وتلبي معايير الجودة والاعتماد.
          </p>
          <ul className="space-y-2 text-xs text-[#0F6E56] font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F6E56]" />
              <span>تحليل فوري دقيق وموضوعي للخطط والمقررات.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F6E56]" />
              <span>اقتراح صياغات أكاديمية محكمة لمخرجات التعلم والمشاريع.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3-Step Visual Process (Required in spec) */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2DDD4] shadow-card">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#D85A30] uppercase tracking-wider mb-2 block">
            آلية العمل
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#085041]">
            المسار البصري في ٣ خطوات بسيطة
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCoral = s.color === 'coral';
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E2DDD4] flex flex-col justify-between hover:shadow-subtle transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                        isCoral
                          ? 'bg-[#FBECE7] text-[#D85A30]'
                          : 'bg-[#E6F3EF] text-[#0F6E56]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-[#E2DDD4] font-arabic">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#085041] mb-2 font-arabic">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#5F5E5A] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button in About Page */}
        <div className="mt-12 text-center">
          <Link
            href="/auth?mode=login"
            className="inline-flex items-center gap-3 bg-[#0F6E56] hover:bg-[#0C5A46] text-white text-base font-bold px-10 py-4 rounded-2xl shadow-card transition-all transform active:scale-98"
          >
            <span>سجل الدخول وابدأ</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
