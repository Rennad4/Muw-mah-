'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { BookOpen, Calendar, ChevronLeft, Loader2, Target, PlusCircle } from 'lucide-react';

interface AnalysisSummary {
  id: string;
  courseName: string;
  fieldOfStudy: string;
  matchScore: number;
  createdAt: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthChecking(false);
        fetchAnalyses(user.uid);
      } else {
        // Not logged in
        router.push('/auth?mode=login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAnalyses = async (userId: string) => {
    try {
      const q = query(
        collection(db, 'analyses'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const data: AnalysisSummary[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as AnalysisSummary);
      });
      setAnalyses(data);
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'غير محدد';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (isAuthChecking || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0F6E56] animate-spin mb-4" />
        <p className="text-[#085041] font-bold">جاري تحميل سجل المقررات...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#085041] mb-2 font-arabic">لوحة التحكم</h1>
          <p className="text-[#5F5E5A] font-medium text-sm">سجل المقررات التي قمت بمواءمتها مسبقاً</p>
        </div>
        
        <Link 
          href="/analyze" 
          className="inline-flex items-center justify-center gap-2 bg-[#0F6E56] hover:bg-[#0C5A46] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-subtle transition-transform active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span>مواءمة مقرر جديد</span>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E2DDD4] p-12 text-center flex flex-col items-center shadow-card">
          <div className="w-20 h-20 bg-[#F1EFE8] rounded-full flex items-center justify-center mb-6 text-[#5F5E5A]">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-[#085041] mb-3 font-arabic">لا يوجد مقررات محللة بعد</h3>
          <p className="text-[#5F5E5A] mb-8 max-w-md mx-auto leading-relaxed">
            لم تقم بإجراء أي عملية مواءمة حتى الآن. ابدأ الآن بتحليل أول مقرر لك لمعرفة مدى مواءمته مع متطلبات سوق العمل.
          </p>
          <Link 
            href="/analyze" 
            className="inline-flex items-center gap-2 bg-[#0F6E56] text-white px-6 py-3 rounded-xl font-bold shadow-subtle hover:bg-[#0C5A46] transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>ابدأ التحليل الآن</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((analysis) => (
            <Link 
              key={analysis.id} 
              href={`/dashboard/${analysis.id}`}
              className="bg-white rounded-2xl border border-[#E2DDD4] p-6 hover:shadow-elevated transition-all hover:-translate-y-1 group flex flex-col h-full cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#F1EFE8] text-[#085041] rounded-xl group-hover:bg-[#E6F3EF] group-hover:text-[#0F6E56] transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className={`px-3 py-1.5 rounded-lg border font-bold text-sm flex items-center gap-1.5 ${getScoreColor(analysis.matchScore)}`}>
                  <Target className="w-4 h-4" />
                  <span>{analysis.matchScore}%</span>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-black text-[#085041] text-lg mb-2 font-arabic line-clamp-2">
                  {analysis.courseName}
                </h3>
                <p className="text-[#5F5E5A] text-sm mb-4 line-clamp-1">
                  {analysis.fieldOfStudy}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2DDD4] flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-xs text-[#5F5E5A] font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(analysis.createdAt)}</span>
                </div>
                <div className="text-[#0F6E56] group-hover:translate-x-1 transition-transform">
                  <ChevronLeft className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
