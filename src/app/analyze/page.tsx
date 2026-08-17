'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { StepIndicator } from '@/components/StepIndicator';
import { ManualEditorModal } from '@/components/ManualEditorModal';
import { SEED_JOB_FIELDS } from '@/lib/market-seed';
import { AnalysisResult, SyllabusSuggestion, UserProfile } from '@/lib/types';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  UploadCloud,
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Download,
  Edit3,
  RefreshCw,
  Info,
  Check,
  BookOpen,
  Code,
  GraduationCap,
  Layers,
  ChevronDown,
  Building,
  HelpCircle,
} from 'lucide-react';

export default function AnalyzeWorkflowPage() {
  const router = useRouter();

  // Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Workflow step state (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1 STATE: Course info & syllabus upload
  const [courseName, setCourseName] = useState('تطوير تطبيقات الويب وقواعد البيانات');
  const [fieldOfStudy, setFieldOfStudy] = useState('هندسة البرمجيات وعلوم الحاسب');
  const [courseCode, setCourseCode] = useState('CS312');
  const [useDirectPaste, setUseDirectPaste] = useState(true);
  const [syllabusText, setSyllabusText] = useState(
    `توصيف المقرر:
يهدف هذا المقرر إلى تعريف الطالب بأساسيات تصميم وتطوير صفحات الويب الثابتة والمبادئ الأولية لربط قواعد البيانات.

مخرجات التعلم:
١. فهم بنية لغة HTML وخصائص CSS الأساسية.
٢. كتابة نصوص برمجية بسيطة بلغة JavaScript داخل المتصفح.
٣. تصميم جداول قاعدة البيانات ومفاهيم الربط العلائقي التقليدي.

الموضوعات الأسبوعية:
- الأسبوع ١-٣: مقدمة إلى شبكة الإنترنت، بروتوكول HTTP، ومحررات النصوص.
- الأسبوع ٤-٦: وسوم HTML4/HTML5 وتنسيقات CSS الأساسية.
- الأسبوع ٧-٩: المتغيرات والدوال في لغة جافا سكريبت البسيطة.
- الأسبوع ١٠-١٢: مقدمة في لغة PHP والاتصال بقاعدة بيانات MySQL محلية.
- الأسبوع ١٣-١٤: مراجعة عامة للمفاهيم النظرية ونماذج اختبارات سابقة.

طرق التقييم:
- اختبار فصلي أول: ٢٠٪
- اختبار فصلي ثانٍ: ٢٠٪
- واجبات وتمارين أسبوعية: ١٠٪
- الاختبار النهائي: ٥٠٪`
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // STEP 2 STATE: Job Market Input
  const [marketInputTab, setMarketInputTab] = useState<'seed' | 'custom'>('seed');
  const [selectedSeedFieldId, setSelectedSeedFieldId] = useState<string>('software-engineering');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    SEED_JOB_FIELDS[0].skills
  );
  const [customJobPostings, setCustomJobPostings] = useState<string[]>([
    'مطلوب مهندس برمجيات واجهات أمامية: خبرة في React, Next.js, TypeScript, Tailwind CSS، إتقان التعامل مع REST APIs و Git، وتطبيق مبادئ Clean Code و TDD.',
  ]);

  // STEP 3 & 4 STATE: AI Analysis & Results
  const [analysisStage, setAnalysisStage] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Manual Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Printable Report Ref
  const reportRef = useRef<HTMLDivElement>(null);

  // Load auth state
  useEffect(() => {
    const stored = localStorage.getItem('muwamah_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        setCurrentUser(null);
      }
    }
    setAuthChecked(true);
  }, []);

  // Update selected skills when seed field changes
  const handleSeedFieldChange = (fieldId: string) => {
    setSelectedSeedFieldId(fieldId);
    const field = SEED_JOB_FIELDS.find((f) => f.id === fieldId);
    if (field) {
      setSelectedSkills([...field.skills]);
    }
  };

  const toggleSkillSelection = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Custom Job Postings Handlers
  const handleAddJobPosting = () => {
    setCustomJobPostings([...customJobPostings, '']);
  };

  const handleUpdateJobPosting = (index: number, val: string) => {
    const updated = [...customJobPostings];
    updated[index] = val;
    setCustomJobPostings(updated);
  };

  const handleRemoveJobPosting = (index: number) => {
    if (customJobPostings.length <= 1) return;
    setCustomJobPostings(customJobPostings.filter((_, i) => i !== index));
  };

  // File Upload Handler
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر استخراج النص من الملف');
      }

      setSyllabusText(data.text);
      setUploadedFileName(file.name);
      setUseDirectPaste(false);
    } catch (err: any) {
      setUploadError(err.message || 'حدث خطأ أثناء رفع الملف');
    } finally {
      setIsUploading(false);
    }
  };

  // Load sample syllabus helper
  const handleLoadSample = (type: 'cs' | 'ai' | 'marketing') => {
    if (type === 'cs') {
      setCourseName('تطوير تطبيقات الويب وقواعد البيانات');
      setFieldOfStudy('هندسة البرمجيات وعلوم الحاسب');
      setCourseCode('CS312');
      setSelectedSeedFieldId('software-engineering');
      const f = SEED_JOB_FIELDS.find((x) => x.id === 'software-engineering');
      if (f) setSelectedSkills([...f.skills]);
      setSyllabusText(`توصيف المقرر:
يهدف المقرر إلى تعريف الطالب بأساسيات صفحات الويب الثابتة واستعلامات قواعد البيانات العلائقية.

مخرجات التعلم:
١. فهم عناصر لغة HTML وتنسيقات CSS التقليدية.
٢. كتابة دوال بسيطة بلغة JavaScript داخل المتصفح.
٣. الربط مع قاعدة بيانات MySQL باستخدام استعلامات SQL أساسية.

الموضوعات الأسبوعية:
- الأسبوع ١-٣: مقدمة في الويب ومحررات الأكواد.
- الأسبوع ٤-٦: تصميم النماذج والجداول باستخدام HTML/CSS.
- الأسبوع ٧-٩: العمليات الحسابية والشرطية في JavaScript.
- الأسبوع ١٠-١٢: التعامل مع لغة PHP وقواعد البيانات.
- الأسبوع ١٣-١٤: اختبارات المراجعة والمشروع الفردي.

طرق التقييم:
- اختبارات فصلية: ٤٠٪
- اختبار نهائي: ٥٠٪
- تمارين: ١٠٪`);
    } else if (type === 'ai') {
      setCourseName('مقدمة في علم البيانات والذكاء الاصطناعي');
      setFieldOfStudy('علوم الحاسب والذكاء الاصطناعي');
      setCourseCode('AI201');
      setSelectedSeedFieldId('data-ai');
      const f = SEED_JOB_FIELDS.find((x) => x.id === 'data-ai');
      if (f) setSelectedSkills([...f.skills]);
      setSyllabusText(`توصيف المقرر:
دراسة المفاهيم الرياضية والإحصائية الأساسية للتعامل مع البيانات وبناء الخوارزميات.

مخرجات التعلم:
١. حساب المتوسطات والانحراف المعياري والمفاهيم الإحصائية.
٢. كتابة برامج بلغة C++ أو بايثون لحساب المعادلات.
٣. التعرف على مبادئ شجرة القرار وخوارزميات التصنيف الكلاسيكية.

الموضوعات:
- الأسبوع ١-٤: الجبر الخطي والمصفوفات.
- الأسبوع ٥-٨: الاحتمالات والتوزيعات الإحصائية.
- الأسبوع ٩-١٢: خوارزميات التصنيف والتعلم الخاضع للإشراف.
- الأسبوع ١٣-١٤: مراجعة وحل المسائل النظرية.`);
    } else {
      setCourseName('مبادئ وأساسيات التسويق الحديث');
      setFieldOfStudy('إدارة الأعمال والتسويق');
      setCourseCode('MKT101');
      setSelectedSeedFieldId('digital-marketing');
      const f = SEED_JOB_FIELDS.find((x) => x.id === 'digital-marketing');
      if (f) setSelectedSkills([...f.skills]);
      setSyllabusText(`توصيف المقرر:
التعريف بالمفاهيم العامة للتسويق والمزيج التسويقي التقليدي (4Ps) وسلوك المستهلك.

مخرجات التعلم:
١. فهم عناصر المزيج التسويقي: المنتج، السعر، المكان، والترويج.
٢. تحليل البيئة التسويقية وسلوك المستهلك في السوق المحلي.
٣. إعداد خطة تسويقية ورقية مصغرة لمنتج تقليدي.`);
    }
    setUseDirectPaste(true);
    setUploadedFileName(null);
  };

  // Submit Step 2 to Start Analysis (Transitions to Step 3 then Step 4)
  const handleStartAnalysis = async () => {
    // Validate
    if (!syllabusText.trim()) {
      alert('يرجى التأكد من إدخال أو رفع خطة المقرر أولاً');
      setCurrentStep(1);
      return;
    }

    let targetMarketSkills = selectedSkills;
    if (marketInputTab === 'custom') {
      const combinedPostings = customJobPostings.filter((p) => p.trim().length > 0);
      if (combinedPostings.length === 0) {
        alert('يرجى لصق إعلان وظيفة واحد على الأقل للمقارنة');
        return;
      }
      targetMarketSkills = combinedPostings;
    }

    if (targetMarketSkills.length === 0) {
      alert('يرجى تحديد مهارة واحدة على الأقل من متطلبات السوق');
      return;
    }

    // Switch to step 3 (Loading screen)
    setCurrentStep(3);
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisStage(1);

    // Progressive stage animations
    const timer1 = setTimeout(() => setAnalysisStage(2), 1200);
    const timer2 = setTimeout(() => setAnalysisStage(3), 2600);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName,
          fieldOfStudy,
          syllabusText,
          marketSkills: targetMarketSkills,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'فشل في استلام نتائج التحليل');
      }

      const resultData = resData.data;

      // Save to Firestore if authenticated
      if (auth && auth.currentUser && db) {
        try {
          await addDoc(collection(db, 'analyses'), {
            userId: auth.currentUser.uid,
            courseName: resultData.courseName,
            fieldOfStudy: resultData.fieldOfStudy,
            matchScore: resultData.matchScore,
            gaps: resultData.gaps,
            suggestions: resultData.suggestions,
            marketSkillsUsed: resultData.marketSkillsUsed,
            createdAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Failed to save analysis to Firestore:", e);
        }
      }

      // Wait slightly so user sees stage 3 completion
      setTimeout(() => {
        setAnalysisResult(resultData);
        setIsAnalyzing(false);
        setCurrentStep(4);
      }, 3400);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsAnalyzing(false);
      setAnalysisError(err.message || 'حدث خطأ أثناء إجراء التحليل بالذكاء الاصطناعي');
    }
  };

  // Save manual modifications back to result
  const handleSaveManualEdits = (updatedSuggestions: SyllabusSuggestion[]) => {
    if (analysisResult) {
      setAnalysisResult({
        ...analysisResult,
        suggestions: updatedSuggestions,
      });
    }
  };

  // Print PDF Trigger
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Progress Bar */}
      <StepIndicator
        currentStep={currentStep}
        onStepClick={(step) => {
          if (!isAnalyzing) setCurrentStep(step);
        }}
      />

      {/* Guest Notice Banner if not logged in */}
      {authChecked && !currentUser && (
        <div className="bg-[#FAF8F5] border border-[#E2DDD4] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-subtle no-print">
          <div className="flex items-center gap-2 text-[#085041]">
            <Info className="w-4 h-4 text-[#0F6E56] shrink-0" />
            <span>
              أنت تستخدم المنصة كضيف تجريبي. للحفظ التلقائي لسجل المقررات ومشاركتها مع لجان الكلية، يفضل تسجيل الدخول.
            </span>
          </div>
          <Link
            href="/auth?mode=login"
            className="text-xs font-bold text-[#0F6E56] hover:underline shrink-0 bg-white px-3 py-1.5 rounded-xl border border-[#E2DDD4]"
          >
            تسجيل الدخول / إنشاء حساب
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: UPLOAD COURSE PLAN (STEP 1)                                     */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2DDD4] shadow-card space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD4] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E6F3EF] px-3 py-1 rounded-full text-xs font-bold text-[#0F6E56] mb-2">
                <span>الخطوة ١ من ٤</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#085041] font-arabic">
                رفع خطة وتوصيف المقرر الدراسي
              </h1>
              <p className="text-xs sm:text-sm text-[#5F5E5A] mt-1">
                أدخل البيانات الأساسية للمقرر وارفع الملف بصيغة PDF أو Word أو الصق النص مباشرة
              </p>
            </div>

            {/* Fast Sample Loader */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#5F5E5A]">نماذج جاهزة:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('cs')}
                className="text-xs font-bold bg-[#FAF8F5] hover:bg-[#E6F3EF] text-[#0F6E56] px-3 py-1.5 rounded-xl border border-[#E2DDD4] transition-colors"
              >
                تطوير الويب
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('ai')}
                className="text-xs font-bold bg-[#FAF8F5] hover:bg-[#E6F3EF] text-[#0F6E56] px-3 py-1.5 rounded-xl border border-[#E2DDD4] transition-colors"
              >
                علم البيانات
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('marketing')}
                className="text-xs font-bold bg-[#FAF8F5] hover:bg-[#E6F3EF] text-[#0F6E56] px-3 py-1.5 rounded-xl border border-[#E2DDD4] transition-colors"
              >
                التسويق
              </button>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Course Name */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#085041] mb-2 block">
                اسم المقرر الدراسي *
              </label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="مثال: هندسة البرمجيات المتقدمة"
                className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] font-semibold focus:bg-white focus:outline-none focus:border-[#0F6E56]"
              />
            </div>

            {/* Course Code */}
            <div>
              <label className="text-xs font-bold text-[#085041] mb-2 block">
                رمز المقرر (اختياري)
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="CS312"
                className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] font-semibold focus:bg-white focus:outline-none focus:border-[#0F6E56]"
              />
            </div>

            {/* Field of Study Dropdown */}
            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-[#085041] mb-2 block">
                التخصص الأكاديمي / القسم العلمي *
              </label>
              <select
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl px-4 py-3 text-sm text-[#085041] font-semibold focus:bg-white focus:outline-none focus:border-[#0F6E56] cursor-pointer"
              >
                <option value="هندسة البرمجيات وعلوم الحاسب">هندسة البرمجيات وعلوم الحاسب</option>
                <option value="علوم البيانات والذكاء الاصطناعي">علوم البيانات والذكاء الاصطناعي</option>
                <option value="الأمن السيبراني والشبكات">الأمن السيبراني والشبكات</option>
                <option value="نظم المعلومات الإدارية">نظم المعلومات الإدارية</option>
                <option value="التسويق الرقمي وإدارة الأعمال">التسويق الرقمي وإدارة الأعمال</option>
                <option value="إدارة المشاريع والعمليات">إدارة المشاريع والعمليات</option>
                <option value="الهندسة الكهربائية والتحكم">الهندسة الكهربائية والتحكم</option>
                <option value="أخرى">تخصص أكاديمي آخر</option>
              </select>
            </div>
          </div>

          {/* Toggle between File Upload & Direct Text Paste */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#085041]">
                محتوى الخطة الدراسية وتوصيف المقرر *
              </label>
              <button
                type="button"
                onClick={() => setUseDirectPaste(!useDirectPaste)}
                className="text-xs font-bold text-[#0F6E56] hover:text-[#0C5A46] bg-[#E6F3EF] px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>{useDirectPaste ? 'رفع ملف (PDF / Word)' : 'أو الصق النص مباشرة'}</span>
              </button>
            </div>

            {/* Direct Paste Textarea */}
            {useDirectPaste ? (
              <div>
                <textarea
                  rows={10}
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  placeholder="الصق هنا توصيف المقرر متضمناً: الأهداف، مخرجات التعلم (CLOs)، الموضوعات الأسبوعية، توزيع الدرجات والمراجع..."
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD4] rounded-2xl p-4 text-xs sm:text-sm text-[#085041] leading-relaxed focus:bg-white focus:outline-none focus:border-[#0F6E56] transition-colors"
                />
                <div className="flex justify-between items-center text-[11px] text-[#5F5E5A] px-1 mt-1">
                  <span>يرجى تضمين مخرجات التعلم والموضوعات الأسبوعية لأفضل نتائج تحليل</span>
                  <span>عدد الكلمات: {syllabusText.trim().split(/\s+/).filter(Boolean).length}</span>
                </div>
              </div>
            ) : (
              /* Drag and Drop Zone */
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-[#0F6E56]/40 hover:border-[#0F6E56] bg-[#FAF8F5] hover:bg-[#E6F3EF]/30 rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#E6F3EF] text-[#0F6E56] flex items-center justify-center">
                      <UploadCloud className="w-8 h-8" />
                    </div>

                    <div>
                      <p className="text-base font-bold text-[#085041] font-arabic">
                        اسحب ملف الخطة وأفلته هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-[#5F5E5A] mt-1">
                        يدعم ملفات PDF و Word (DOCX) حتى حجم 15 ميجابايت
                      </p>
                    </div>

                    {isUploading && (
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0F6E56] pt-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري استخراج وقراءة محتوى الملف...</span>
                      </div>
                    )}

                    {uploadedFileName && !isUploading && (
                      <div className="inline-flex items-center gap-2 bg-[#E6F3EF] text-[#0F6E56] px-4 py-2 rounded-xl text-xs font-bold border border-[#0F6E56]/20">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم استخراج النص بنجاح من: {uploadedFileName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {uploadError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Button */}
          <div className="pt-6 border-t border-[#E2DDD4] flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!courseName.trim()) {
                  alert('يرجى إدخال اسم المقرر أولاً');
                  return;
                }
                if (!syllabusText.trim()) {
                  alert('يرجى كتابة أو رفع خطة المقرر');
                  return;
                }
                setCurrentStep(2);
              }}
              className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0C5A46] text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-xl shadow-subtle transition-all transform active:scale-98"
            >
              <span>التالي: متطلبات سوق العمل</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 5: JOB MARKET INPUT (STEP 2)                                       */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2DDD4] shadow-card space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD4] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E6F3EF] px-3 py-1 rounded-full text-xs font-bold text-[#0F6E56] mb-2">
                <span>الخطوة ٢ من ٤</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#085041] font-arabic">
                تحديد متطلبات ومهارات سوق العمل
              </h1>
              <p className="text-xs sm:text-sm text-[#5F5E5A] mt-1">
                اختر مساراً مهنياً معتمداً من القوائم الجاهزة أو الصق إعلانات التوظيف الفعلية
              </p>
            </div>

            <div className="text-xs bg-[#FAF8F5] px-3 py-2 rounded-xl border border-[#E2DDD4] text-[#5F5E5A]">
              المقرر المستهدف: <strong className="text-[#085041]">{courseName}</strong>
            </div>
          </div>

          {/* Official Integration Note (Required in spec) */}
          <div className="bg-[#FAF8F5] border border-[#D85A30]/30 p-4 sm:p-5 rounded-2xl flex items-start gap-3 shadow-subtle">
            <div className="w-8 h-8 rounded-xl bg-[#FBECE7] text-[#D85A30] flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[#D85A30] font-arabic">
                ملاحظة تطويرية هامة:
              </h3>
              <p className="text-xs text-[#5F5E5A] leading-relaxed">
                الربط المباشر مع منصات التوظيف الرسمية قادم في مرحلة قادمة. نعتمد حالياً على
                قواعد بيانات مهارية معيارية محدثة دورياً مع إمكانية لصق إعلانات التوظيف المباشرة.
              </p>
            </div>
          </div>

          {/* Tabs: Predefined Seed List vs Custom Job Postings */}
          <div className="grid grid-cols-2 bg-[#F1EFE8] p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setMarketInputTab('seed')}
              className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition-all font-arabic flex items-center justify-center gap-2 ${
                marketInputTab === 'seed'
                  ? 'bg-white text-[#0F6E56] shadow-subtle'
                  : 'text-[#5F5E5A] hover:text-[#085041]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>اختيار من قائمة جاهزة</span>
            </button>
            <button
              type="button"
              onClick={() => setMarketInputTab('custom')}
              className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition-all font-arabic flex items-center justify-center gap-2 ${
                marketInputTab === 'custom'
                  ? 'bg-white text-[#0F6E56] shadow-subtle'
                  : 'text-[#5F5E5A] hover:text-[#085041]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>لصق إعلانات وظائف</span>
            </button>
          </div>

          {/* TAB 1: PREDEFINED SEED TRACKS */}
          {marketInputTab === 'seed' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#085041] mb-2 block">
                  اختر المسار المهني المرتبط بالمقرر:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SEED_JOB_FIELDS.map((field) => {
                    const isSelected = selectedSeedFieldId === field.id;
                    return (
                      <button
                        key={field.id}
                        type="button"
                        onClick={() => handleSeedFieldChange(field.id)}
                        className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#E6F3EF] border-[#0F6E56] ring-2 ring-[#0F6E56]/20'
                            : 'bg-[#FAF8F5] border-[#E2DDD4] hover:border-[#0F6E56]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs sm:text-sm text-[#085041] font-arabic">
                            {field.title}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#0F6E56] text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5F5E5A] line-clamp-2">
                          {field.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Checklist for the chosen track */}
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E2DDD4] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#085041] font-arabic">
                      المهارات والتقنيات المشمولة في التحليل ({selectedSkills.length} مهارة محددة)
                    </h3>
                    <p className="text-[11px] text-[#5F5E5A]">
                      انقر على أي مهارة لإضافتها أو استبعادها من عملية المقارنة
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentField = SEED_JOB_FIELDS.find((f) => f.id === selectedSeedFieldId);
                        if (currentField) setSelectedSkills([...currentField.skills]);
                      }}
                      className="text-[11px] font-bold text-[#0F6E56] hover:underline"
                    >
                      تحديد الكل
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {SEED_JOB_FIELDS.find((f) => f.id === selectedSeedFieldId)?.skills.map((skill) => {
                    const isChecked = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkillSelection(skill)}
                        className={`text-xs px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                          isChecked
                            ? 'bg-[#0F6E56] text-white shadow-subtle'
                            : 'bg-white text-[#5F5E5A] border border-[#E2DDD4] hover:border-[#0F6E56]'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                            isChecked ? 'bg-white/20 text-white' : 'border border-[#5F5E5A]/40'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM JOB POSTINGS (Repeatable textareas) */}
          {marketInputTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#085041]">
                  إعلانات الوظائف المستهدفة (انسخ متطلبات الوظيفة من منصات التوظيف):
                </label>
                <button
                  type="button"
                  onClick={handleAddJobPosting}
                  className="text-xs font-bold text-[#0F6E56] bg-[#E6F3EF] hover:bg-[#0F6E56] hover:text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة إعلان وظيفة آخر</span>
                </button>
              </div>

              <div className="space-y-3">
                {customJobPostings.map((posting, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DDD4] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#5F5E5A]">
                      <span>إعلان الوظيفة #{idx + 1}</span>
                      {customJobPostings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveJobPosting(idx)}
                          className="text-[#D85A30] hover:text-red-700 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف الإعلان</span>
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={4}
                      value={posting}
                      onChange={(e) => handleUpdateJobPosting(idx, e.target.value)}
                      placeholder="الصق نص إعلان التوظيف أو متطلبات الوظيفة هنا (المسؤوليات، المهارات المطلوبة، والتقنيات)..."
                      className="w-full bg-white border border-[#E2DDD4] rounded-xl p-3 text-xs sm:text-sm text-[#085041] leading-relaxed focus:outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-[#E2DDD4] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5F5E5A] hover:text-[#085041] px-5 py-3 rounded-xl border border-[#E2DDD4] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق: خطة المقرر</span>
            </button>

            <button
              type="button"
              onClick={handleStartAnalysis}
              className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0C5A46] text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-xl shadow-subtle transition-all transform active:scale-98"
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>تحليل المقرر</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 6: ANALYSIS LOADING PAGE (STEP 3)                                  */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-8 sm:p-16 border border-[#E2DDD4] shadow-card text-center space-y-8 animate-in fade-in duration-300">
          <div className="max-w-md mx-auto space-y-6">
            {/* Animated Pulsing & Glowing Logo */}
            <div className="relative flex justify-center items-center py-6">
              <div className="absolute w-32 h-32 rounded-full bg-[#0F6E56]/10 animate-ping" />
              <div className="absolute w-24 h-24 rounded-full bg-[#D85A30]/15 animate-pulse" />
              <div className="relative z-10">
                <BrandLogo size="xl" hideText={true} pulseAnimation={true} />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#085041] mb-2 font-arabic">
                جاري تحليل ومواءمة المقرر بالذكاء الاصطناعي
              </h2>
              <p className="text-xs sm:text-sm text-[#5F5E5A]">
                نظام الذكاء الاصطناعي يقوم بمطابقة كل بند دراسي مع الكفاءات المهارية المطلوبة
              </p>
            </div>

            {/* Sequential Arabic Progress Stages (Required in spec) */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E2DDD4] text-right space-y-4">
              {/* Stage 1 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    analysisStage > 1
                      ? 'bg-[#0F6E56] text-white'
                      : analysisStage === 1
                      ? 'bg-[#0F6E56] text-white animate-pulse'
                      : 'bg-white border border-[#E2DDD4] text-[#5F5E5A]'
                  }`}
                >
                  {analysisStage > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '١'}
                </div>
                <span
                  className={`text-xs font-bold font-arabic ${
                    analysisStage === 1
                      ? 'text-[#0F6E56]'
                      : analysisStage > 1
                      ? 'text-[#085041]'
                      : 'text-[#5F5E5A]/50'
                  }`}
                >
                  جاري استخراج محتوى المقرر
                </span>
              </div>

              {/* Stage 2 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    analysisStage > 2
                      ? 'bg-[#0F6E56] text-white'
                      : analysisStage === 2
                      ? 'bg-[#0F6E56] text-white animate-pulse'
                      : 'bg-white border border-[#E2DDD4] text-[#5F5E5A]'
                  }`}
                >
                  {analysisStage > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '٢'}
                </div>
                <span
                  className={`text-xs font-bold font-arabic ${
                    analysisStage === 2
                      ? 'text-[#0F6E56]'
                      : analysisStage > 2
                      ? 'text-[#085041]'
                      : 'text-[#5F5E5A]/50'
                  }`}
                >
                  جاري تحليل متطلبات السوق
                </span>
              </div>

              {/* Stage 3 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    analysisStage === 3
                      ? 'bg-[#0F6E56] text-white animate-pulse'
                      : 'bg-white border border-[#E2DDD4] text-[#5F5E5A]'
                  }`}
                >
                  <span>٣</span>
                </div>
                <span
                  className={`text-xs font-bold font-arabic ${
                    analysisStage === 3 ? 'text-[#0F6E56]' : 'text-[#5F5E5A]/50'
                  }`}
                >
                  جاري إعداد التوصيات
                </span>
              </div>
            </div>

            {analysisError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl">
                <p>{analysisError}</p>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="mt-2 text-xs underline font-bold"
                >
                  العودة والمحاولة ثانية
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 7: RESULTS & SUGGESTIONS PAGE (STEP 4)                             */}
      {/* ========================================================================= */}
      {currentStep === 4 && analysisResult && (
        <div ref={reportRef} className="space-y-8 animate-in fade-in duration-300">
          {/* Printable Header (Visible only on print) */}
          <div className="hidden print:block text-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-[#085041]">
              تقرير مواءمة المقرر الدراسي مع متطلبات سوق العمل
            </h1>
            <p className="text-xs text-[#5F5E5A]">
              صادر عن منصة مواءمة الأكاديمية الذكية • {new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>

          {/* Action Header & Course Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DDD4] shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#E6F3EF] px-3 py-1 rounded-full text-xs font-bold text-[#0F6E56]">
                <span>الخطوة ٤ من ٤: النتائج والتوصيات</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#085041] font-arabic">
                {analysisResult.courseName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5F5E5A]">
                <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E2DDD4]">
                  التخصص: <strong>{analysisResult.fieldOfStudy}</strong>
                </span>
                <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E2DDD4]">
                  رمز المقرر: <strong>{courseCode || 'CS312'}</strong>
                </span>
                <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E2DDD4]">
                  تاريخ التحليل: <strong>{new Date().toLocaleDateString('ar-SA')}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons: PDF Download & Manual Edit */}
            <div className="flex flex-wrap items-center gap-3 no-print w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#085041] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl border border-[#085041] shadow-subtle transition-all"
              >
                <Edit3 className="w-4 h-4 text-[#0F6E56]" />
                <span>تعديل يدوي</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPdf}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#0F6E56] hover:bg-[#0C5A46] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-card transition-all"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل التقرير PDF</span>
              </button>
            </div>
          </div>

          {/* Metrics & Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CIRCULAR MATCH SCORE CARD (Required in spec) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DDD4] shadow-card flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-[#5F5E5A] mb-4">
                مؤشر المواءمة التوافقي
              </span>

              {/* Circular Gauge */}
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#E2DDD4"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#0F6E56"
                    strokeWidth="10"
                    strokeDasharray={314.15}
                    strokeDashoffset={314.15 - (314.15 * analysisResult.matchScore) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-[#0F6E56] font-arabic">
                    ٪{analysisResult.matchScore}
                  </span>
                  <span className="text-xs font-bold text-[#085041]">
                    توافق
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-[#E6F3EF] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0F6E56]">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {analysisResult.matchScore >= 80
                    ? 'توافق ممتاز مع متطلبات السوق'
                    : analysisResult.matchScore >= 65
                    ? 'توافق جيد مع فجوات قابلة للتحسين'
                    : 'فجوة مهارية ملموسة تتطلب التحديث'}
                </span>
              </div>
            </div>

            {/* Assessment Bio */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DDD4] shadow-card flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E6F3EF] text-[#0F6E56] flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#085041] font-arabic">
                    التقييم الأكاديمي الشامل لخطة المقرر
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#5F5E5A] leading-relaxed">
                  {analysisResult.overallAssessment}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E2DDD4]">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E2DDD4]">
                  <span className="text-[11px] text-[#5F5E5A] block">المهارات المفحوصة</span>
                  <span className="text-sm font-bold text-[#085041]">{analysisResult.marketSkillsUsed.length} مهارة</span>
                </div>
                <div className="bg-[#FBECE7] p-3 rounded-xl border border-[#D85A30]/20">
                  <span className="text-[11px] text-[#D85A30] block">الفجوات المرصودة</span>
                  <span className="text-sm font-bold text-[#D85A30]">{analysisResult.gaps.length} فجوة رئيسية</span>
                </div>
                <div className="bg-[#E6F3EF] p-3 rounded-xl border border-[#0F6E56]/20 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-[#0F6E56] block">التعديلات المقترحة</span>
                  <span className="text-sm font-bold text-[#0F6E56]">{analysisResult.suggestions.length} صياغات بديلة</span>
                </div>
              </div>
            </div>
          </div>

          {/* SKILL GAPS COMPARISON CARD (Coral tags as required in spec) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DDD4] shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FBECE7] text-[#D85A30] flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#085041] font-arabic">
                    المهارات المطلوبة وغير موجودة بالمقرر
                  </h3>
                  <p className="text-xs text-[#5F5E5A]">
                    تم تحديد هذه المهارات والتقنيات كأولوية في إعلانات التوظيف مع غيابها عن الخطة الحالية
                  </p>
                </div>
              </div>
            </div>

            {/* Coral Skill Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysisResult.gaps.map((gap, i) => (
                <div
                  key={i}
                  className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DDD4] hover:border-[#D85A30] transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#D85A30] text-white text-xs font-bold px-3 py-1 rounded-xl shadow-subtle">
                      <span>{gap.skill}</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#D85A30] bg-[#FBECE7] px-2 py-0.5 rounded-md">
                      {gap.importance}
                    </span>
                  </div>
                  {gap.description && (
                    <p className="text-[11px] text-[#5F5E5A] leading-relaxed pt-1">
                      {gap.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUGGESTIONS LIST (Numbered Cards with Section, Before, After, Rationale) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DDD4] shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2DDD4] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3EF] text-[#0F6E56] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#085041] font-arabic">
                    التعديلات المقترحة على توصيف المقرر
                  </h3>
                  <p className="text-xs text-[#5F5E5A]">
                    صياغات أكاديمية محكمة ومباشرة لسد الفجوات المهارية دون الإخلال بالمحتوى الأساسي
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold bg-[#E6F3EF] text-[#0F6E56] px-3 py-1.5 rounded-xl">
                {analysisResult.suggestions.length} تعديلات معتمدة
              </span>
            </div>

            {/* Numbered Cards List */}
            <div className="space-y-6">
              {analysisResult.suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border border-[#E2DDD4] space-y-4 hover:border-[#0F6E56] transition-all"
                >
                  {/* Card Title & Target Section */}
                  <div className="flex items-center justify-between border-b border-[#E2DDD4] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#0F6E56] text-white font-bold text-sm flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#085041] font-arabic">
                        القسم المقترح تعديله: <span className="text-[#0F6E56]">{sug.section}</span>
                      </h4>
                    </div>
                  </div>

                  {/* Before & After Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Before */}
                    <div className="bg-white p-4 rounded-xl border border-red-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-red-700 block">
                        النص الحالي في الخطة:
                      </span>
                      <p className="text-xs text-[#5F5E5A] leading-relaxed">
                        {sug.before}
                      </p>
                    </div>

                    {/* After */}
                    <div className="bg-[#E6F3EF]/60 p-4 rounded-xl border border-[#0F6E56]/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-[#0F6E56] block">
                        النص المقترح المحدث:
                      </span>
                      <p className="text-xs text-[#085041] font-semibold leading-relaxed">
                        {sug.after}
                      </p>
                    </div>
                  </div>

                  {/* Rationale */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#E2DDD4] text-xs space-y-1">
                    <span className="font-bold text-[#5F5E5A] text-[11px] block">
                      المبرر الأكاديمي والمهني للتعديل:
                    </span>
                    <p className="text-[#5F5E5A] leading-relaxed text-[11px]">
                      {sug.rationale}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 no-print">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setAnalysisResult(null);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-[#5F5E5A] hover:text-[#085041] bg-white px-6 py-3.5 rounded-xl border border-[#E2DDD4] shadow-subtle transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>مواءمة مقرر دراسي جديد</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#085041] text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl border border-[#085041] shadow-subtle transition-all"
              >
                <Edit3 className="w-4 h-4 text-[#0F6E56]" />
                <span>تعديل يدوي</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPdf}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#0F6E56] hover:bg-[#0C5A46] text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-xl shadow-card transition-all"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل التقرير PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Edit Modal */}
      {analysisResult && (
        <ManualEditorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          suggestions={analysisResult.suggestions}
          onSave={handleSaveManualEdits}
        />
      )}
    </div>
  );
}
