'use client';

import React, { useState } from 'react';
import { SyllabusSuggestion } from '@/lib/types';
import { X, Check, Plus, Trash2, Edit3, Sparkles, BookOpen } from 'lucide-react';

interface ManualEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: SyllabusSuggestion[];
  onSave: (updated: SyllabusSuggestion[]) => void;
}

export const ManualEditorModal: React.FC<ManualEditorModalProps> = ({
  isOpen,
  onClose,
  suggestions: initialSuggestions,
  onSave,
}) => {
  const [items, setItems] = useState<SyllabusSuggestion[]>(initialSuggestions);
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!isOpen) return null;

  const handleUpdateField = (index: number, field: keyof SyllabusSuggestion, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAddItem = () => {
    const newItem: SyllabusSuggestion = {
      section: 'قسم جديد في توصيف المقرر',
      before: 'الصياغة الحالية في الخطة الدراسية...',
      after: 'الصياغة الحديثة المقترحة المتوافقة مع متطلبات السوق...',
      rationale: 'المبرر الأكاديمي والمهني لإضافة هذا التعديل...',
    };
    setItems([...items, newItem]);
    setActiveTab(items.length);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (activeTab >= updated.length) {
      setActiveTab(Math.max(0, updated.length - 1));
    }
  };

  const handleApply = () => {
    onSave(items);
    onClose();
  };

  const currentItem = items[activeTab] || items[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-[#E2DDD4] w-full max-w-4xl rounded-2xl shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#E2DDD4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F3EF] text-[#0F6E56] flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#085041] font-arabic">
                التعديل اليدوي والتخصيص الأكاديمي
              </h3>
              <p className="text-xs text-[#5F5E5A]">
                يمكنك تعديل نصوص المقترحات أو إعادة صياغتها لتلائم متطلبات قسمك العلمي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5F5E5A] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Sub-tabs for suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#E2DDD4]">
            {items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === idx
                    ? 'bg-[#0F6E56] text-white shadow-subtle'
                    : 'bg-white text-[#5F5E5A] border border-[#E2DDD4] hover:border-[#0F6E56]'
                }`}
              >
                <span>تعديل #{idx + 1}:</span>
                <span className="max-w-[120px] truncate">{item.section}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-2 rounded-xl text-xs font-bold text-[#0F6E56] bg-[#E6F3EF] hover:bg-[#0F6E56] hover:text-white transition-all shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة تعديل</span>
            </button>
          </div>

          {/* Form Fields for Selected Suggestion */}
          {currentItem && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#085041]">
                  القسم المستهدف في الخطة الدراسية:
                </label>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(activeTab)}
                    className="text-xs text-[#D85A30] hover:text-red-700 font-semibold inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف هذا التعديل</span>
                  </button>
                )}
              </div>

              <input
                type="text"
                value={currentItem.section}
                onChange={(e) => handleUpdateField(activeTab, 'section', e.target.value)}
                className="w-full bg-white border border-[#E2DDD4] rounded-xl px-4 py-2.5 text-sm text-[#085041] font-semibold focus:outline-none focus:border-[#0F6E56]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#5F5E5A] mb-1.5 block">
                    النص الحالي في خطة المقرر:
                  </label>
                  <textarea
                    rows={4}
                    value={currentItem.before}
                    onChange={(e) => handleUpdateField(activeTab, 'before', e.target.value)}
                    className="w-full bg-white border border-[#E2DDD4] rounded-xl p-3 text-xs text-[#5F5E5A] leading-relaxed focus:outline-none focus:border-[#0F6E56]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F6E56] mb-1.5 block">
                    النص المقترح المحدث:
                  </label>
                  <textarea
                    rows={4}
                    value={currentItem.after}
                    onChange={(e) => handleUpdateField(activeTab, 'after', e.target.value)}
                    className="w-full bg-[#E6F3EF]/40 border border-[#0F6E56]/30 rounded-xl p-3 text-xs text-[#085041] font-medium leading-relaxed focus:outline-none focus:border-[#0F6E56]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5F5E5A] mb-1.5 block">
                  المبرر الأكاديمي والمهني للتعديل:
                </label>
                <textarea
                  rows={2}
                  value={currentItem.rationale}
                  onChange={(e) => handleUpdateField(activeTab, 'rationale', e.target.value)}
                  className="w-full bg-white border border-[#E2DDD4] rounded-xl p-3 text-xs text-[#5F5E5A] leading-relaxed focus:outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-white px-6 py-4 border-t border-[#E2DDD4] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#5F5E5A] hover:bg-slate-100 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0F6E56] hover:bg-[#0C5A46] shadow-subtle transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>حفظ واعتماد التعديلات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
