import { NextRequest, NextResponse } from 'next/server';
import { analyzeSyllabusAlignment } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseName, fieldOfStudy, syllabusText, marketSkills } = body;

    if (!courseName || !syllabusText || !marketSkills || !Array.isArray(marketSkills) || marketSkills.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'البيانات المدخلة غير مكتملة. يرجى التأكد من إدخال اسم المقرر وخطة المنهج وتحديد مهارات سوق العمل المستهدفة.',
        },
        { status: 400 }
      );
    }

    const result = await analyzeSyllabusAlignment({
      courseName,
      fieldOfStudy: fieldOfStudy || 'عام',
      syllabusText,
      marketSkills,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('API Analyze error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث تعذر أثناء تحليل المقرر بواسطة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
      },
      { status: 500 }
    );
  }
}
