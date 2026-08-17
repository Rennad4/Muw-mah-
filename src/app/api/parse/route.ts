import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على ملف مرفق. يرجى اختيار ملف صالح.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let extractedText = '';

    if (fileName.endsWith('.pdf')) {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || '';
      } catch (pdfErr) {
        console.error('PDF parsing error:', pdfErr);
        return NextResponse.json(
          { success: false, error: 'تعذر استخراج النص من ملف PDF. يرجى التأكد من أن الملف غير محمي بكلمة مرور أو تجربة لصق النص مباشرة.' },
          { status: 422 }
        );
      }
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      try {
        const docxResult = await mammoth.extractRawText({ buffer });
        extractedText = docxResult.value || '';
      } catch (docxErr) {
        console.error('DOCX parsing error:', docxErr);
        return NextResponse.json(
          { success: false, error: 'تعذر قراءة ملف Word المرفق. يرجى التحقق من سلامة الملف أو نسخه ولصقه مباشرة.' },
          { status: 422 }
        );
      }
    } else if (fileName.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { success: false, error: 'نوع الملف غير مدعوم. يرجى رفع ملف بصيغة PDF أو Word (DOCX) أو TXT.' },
        { status: 400 }
      );
    }

    // Clean and normalize extracted text
    const cleanedText = extractedText.replace(/\r\n/g, '\n').trim();

    if (!cleanedText || cleanedText.length < 15) {
      return NextResponse.json(
        { success: false, error: 'الملف يبدو فارغاً أو يحتوي على صور ممسوحة ضوئياً بدون نصوص قابلة للاستخراج. يرجى استخدام خيار لصق النص مباشرة.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: cleanedText,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err: any) {
    console.error('File parse server error:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع أثناء معالجة الملف. يرجى المحاولة لاحقاً.' },
      { status: 500 }
    );
  }
}
