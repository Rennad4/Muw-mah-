'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { 
  ArrowRight, 
  Loader2, 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Briefcase 
} from 'lucide-react';

interface AnalysisData {
  userId: string;
  courseName: string;
  fieldOfStudy: string;
  matchScore: number;
  gaps: string[];
  suggestions: {
    topic: string;
    rationale: string;
  }[];
  marketSkillsUsed: string[];
  createdAt: any;
}

export default function AnalysisDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.id as string;
  
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchAnalysisDetails(user.uid, analysisId);
      } else {
        router.push('/auth?mode=login');
      }
    });

    return () => unsubscribe();
  }, [router, analysisId]);

  const fetchAnalysisDetails = async (userId: string, docId: string) => {
    try {
      const docRef = doc(db, 'analyses', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const analysisData = docSnap.data() as AnalysisData;
        if (analysisData.userId !== userId) {
          setError('ليس لديك صلاحية لعرض هذا التقرير.');
        } else {
          setData(analysisData);
        }
      } else {
        setError('هذا التقرير غير موجود أو تم حذفه.');
      }
    } catch (err) {
      console.error("Error fetching doc:", err);
      setError('حدث خطأ أثناء تحميل التقرير.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0F6E56] animate-spin mb-4" />
        <p className="text-[#085041] font-bold">جاري تحميل التقرير المفصل...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#085041] mb-2">{error}</h2>
        <Link href="/dashboard" className="text-[#0F6E56] hover:underline font-bold mt-4 inline-block">
          العودة إلى لوحة التحكم
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-[#5F5E5A] hover:text-[#085041] font-bold text-sm mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للوحة التحكم</span>
      </Link>

      <div className="bg-white rounded-3xl border border-[#E2DDD4] shadow-card overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-[#E2DDD4] bg-[#FAF8F5]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F6E56] mb-3">
                <BookOpen className="w-4 h-4" />
                <span>تقرير مواءمة مقرر</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#085041] mb-2 font-arabic">
                {data.courseName}
              </h1>
              <p className="text-[#5F5E5A] font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{data.fieldOfStudy}</span>
              </p>
            </div>
            
            <div className={`shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 shadow-subtle ${getScoreColor(data.matchScore)}`}>
              <span className="text-3xl font-black">{data.matchScore}%</span>
              <span className="text-xs font-bold mt-1 opacity-80">نسبة المواءمة</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8">
          
          {/* Market Skills Used */}
          {data.marketSkillsUsed && data.marketSkillsUsed.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-[#085041] mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#D85A30]" />
                المهارات المستهدفة في التحليل
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.marketSkillsUsed.map((skill, idx) => (
                  <span key={idx} className="bg-[#E6F3EF] text-[#0F6E56] px-3 py-1.5 rounded-lg text-sm font-semibold border border-[#0F6E56]/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          <div>
            <h3 className="text-lg font-bold text-[#085041] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              الفجوات المكتشفة (ما ينقص المقرر)
            </h3>
            {data.gaps && data.gaps.length > 0 ? (
              <ul className="space-y-3">
                {data.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white border border-amber-200 p-4 rounded-xl shadow-sm">
                    <span className="shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[#085041] leading-relaxed text-sm font-medium">{gap}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#5F5E5A] bg-[#FAF8F5] p-4 rounded-xl border border-[#E2DDD4]">لم يتم العثور على فجوات جوهرية.</p>
            )}
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="text-lg font-bold text-[#085041] mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#D85A30]" />
              التوصيات ومقترحات التطوير
            </h3>
            {data.suggestions && data.suggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.suggestions.map((sug, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] border border-[#E2DDD4] rounded-2xl p-5 hover:border-[#0F6E56]/40 transition-colors">
                    <div className="font-bold text-[#085041] text-base mb-2 font-arabic line-clamp-2">
                      {sug.topic}
                    </div>
                    <div className="text-[#5F5E5A] text-sm leading-relaxed">
                      {sug.rationale}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#5F5E5A] bg-[#FAF8F5] p-4 rounded-xl border border-[#E2DDD4]">لا توجد مقترحات إضافية حالياً.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
