import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  GraduationCap,
  Briefcase,
  Target,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  const benefits = [
    {
      icon: Target,
      title: 'تحليل دقيق للفجوات المهارية',
      description: 'مطابقة خطة المقرر بنداً ببند مع متطلبات الوظائف الفعلية والمهارات الأكثر طلباً في السوق.',
    },
    {
      icon: Sparkles,
      title: 'توصيات أكاديمية جاهزة للتطبيق',
      description: 'اقتراحات محددة لصياغة مخرجات التعلم، موضوعات المحاضرات، وتوزيع المشروعات العملية.',
    },
    {
      icon: BarChart3,
      title: 'مؤشر مواءمة كمي معتمد',
      description: 'حساب نسبة التوافق المئوية بدقة لمساعدة لجان المناهج والاعتماد الأكاديمي على اتخاذ القرار.',
    },
    {
      icon: ShieldCheck,
      title: 'دعم المعايير الأكاديمية والوطنية',
      description: 'مساعدة الكليات في إعداد ملفات الجودة والاعتماد المؤسسي والبرامجي بسهولة وسرعة.',
    },
  ];

  const tracks = [
    { name: 'تطوير وهندسة البرمجيات', count: '١٣ مهارة معتمدة' },
    { name: 'تحليل البيانات والذكاء الاصطناعي', count: '١٢ مهارة معتمدة' },
    { name: 'التسويق الرقمي ونمو الأعمال', count: '١٢ مهارة معتمدة' },
    { name: 'إدارة المشاريع الرقمية والرشاقة', count: '١١ مهارة معتمدة' },
    { name: 'الأمن السيبراني وحماية النظم', count: '١١ مهارة معتمدة' },
  ];

  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#E2DDD4] shadow-subtle mb-8">
          <div className="w-2 h-2 rounded-full bg-[#D85A30] animate-pulse" />
          <span className="text-xs font-bold text-[#085041]">
            المنصة الذكية الأولى لمواءمة الخطط الجامعية مع سوق العمل
          </span>
        </div>

        {/* Large Logo & Headline */}
        <div className="flex justify-center mb-6">
          <BrandLogo size="xl" hideText={true} />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#085041] tracking-tight mb-4 font-arabic">
          مواءمة
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-[#0F6E56] mb-6 font-arabic max-w-3xl mx-auto">
          من قاعات الجامعة إلى احتياجات سوق العمل
        </p>

        <p className="text-base sm:text-lg text-[#5F5E5A] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          حلل خطة مقررك الدراسي في دقائق بواسطة الذكاء الاصطناعي، واكتشف المهارات الناقصة،
          واحصل على صياغات وتعديلات جاهزة للاعتماد ترفع من جاهزية خريجيك للمنافسة في السوق.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/auth?mode=login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0F6E56] hover:bg-[#0C5A46] text-white text-base font-bold px-8 py-4 rounded-2xl shadow-card hover:shadow-elevated transition-all transform active:scale-98"
          >
            <span>سجل الدخول وابدأ</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Link
            href="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#085041] text-base font-bold px-7 py-4 rounded-2xl border border-[#E2DDD4] shadow-subtle transition-all"
          >
            <span>كيف تعمل المنصة؟</span>
          </Link>
        </div>
      </section>

      {/* Visual Workflow Preview Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2DDD4] shadow-card">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#D85A30] uppercase tracking-wider mb-2 block">
              ثلاث خطوات سهلة ومباشرة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#085041]">
              كيف تضمن مواءمة مقررك الدراسي؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E2DDD4] relative hover:border-[#0F6E56] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E6F3EF] text-[#0F6E56] font-bold text-lg flex items-center justify-center mb-4">
                ١
              </div>
              <h3 className="text-lg font-bold text-[#085041] mb-2 font-arabic">
                ارفع خطة المقرر
              </h3>
              <p className="text-xs text-[#5F5E5A] leading-relaxed">
                ارفع ملف الخطة بصيغة PDF أو Word أو الصق النص مباشرة مع تحديد التخصص والمستوى الدراسي.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E2DDD4] relative hover:border-[#0F6E56] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FBECE7] text-[#D85A30] font-bold text-lg flex items-center justify-center mb-4">
                ٢
              </div>
              <h3 className="text-lg font-bold text-[#085041] mb-2 font-arabic">
                قارن مع متطلبات السوق
              </h3>
              <p className="text-xs text-[#5F5E5A] leading-relaxed">
                اختر مساراً مهنياً معتمداً من القوائم الجاهزة أو الصق إعلانات وظائف حقيقية مستهدفة.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E2DDD4] relative hover:border-[#0F6E56] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E6F3EF] text-[#0F6E56] font-bold text-lg flex items-center justify-center mb-4">
                ٣
              </div>
              <h3 className="text-lg font-bold text-[#085041] mb-2 font-arabic">
                احصل على تعديلات جاهزة
              </h3>
              <p className="text-xs text-[#5F5E5A] leading-relaxed">
                احصل على نسبة التوافق، قائمة المهارات الناقصة، وصياغات بديلة متكاملة جاهزة للاعتماد والتحميل.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-[#085041] mb-4">
            لماذا يثق أساتذة الجامعات في منصة مواءمة؟
          </h2>
          <p className="text-sm text-[#5F5E5A] leading-relaxed">
            تم تصميم مواءمة خصيصاً لتلائم السياق الأكاديمي العربي وتوفر على عضو هيئة التدريس
            عشرات الساعات في البحث والمقارنة وصياغة التوصيفات.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#E2DDD4] shadow-subtle hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E6F3EF] text-[#0F6E56] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#085041] mb-2 font-arabic">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5F5E5A] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Market Tracks Seed preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#E2DDD4]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-[#085041] mb-1 font-arabic">
                المسارات المهنية المعتمدة
              </h3>
              <p className="text-xs text-[#5F5E5A]">
                بيانات نموذجية محدثة تشمل المهارات الأساسية والمتقدمة لكل تخصص
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#E6F3EF] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0F6E56]">
              <CheckCircle2 className="w-4 h-4" />
              <span>محدثة لعام {new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {tracks.map((track, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-[#E2DDD4] flex flex-col justify-between hover:border-[#0F6E56] transition-colors"
              >
                <span className="font-bold text-xs text-[#085041] mb-2 font-arabic">
                  {track.name}
                </span>
                <span className="text-[11px] text-[#D85A30] font-semibold">
                  {track.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-center">
        <div className="bg-[#0F6E56] text-white rounded-3xl p-10 sm:p-14 shadow-elevated relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-arabic">
              جاهز لتحديث مقررك الدراسي؟
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              انضم إلى نخبة الأكاديميين الذين يقودون التغيير ويصممون مقررات تضمن جاهزية الطلاب للوظائف المستقبلية.
            </p>
            <div className="pt-2">
              <Link
                href="/auth?mode=login"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#0F6E56] text-base font-bold px-8 py-4 rounded-2xl shadow-card transition-all transform active:scale-98"
              >
                <span>سجل الدخول وابدأ</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
