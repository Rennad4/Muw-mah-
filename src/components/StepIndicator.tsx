import React from 'react';
import { Check, UploadCloud, Briefcase, Sparkles, FileCheck } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number; // 1 to 4
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, label: 'رفع خطة المقرر', icon: UploadCloud, arabicNum: '١' },
    { number: 2, label: 'متطلبات سوق العمل', icon: Briefcase, arabicNum: '٢' },
    { number: 3, label: 'التحليل الذكي', icon: Sparkles, arabicNum: '٣' },
    { number: 4, label: 'نتائج التوصيات', icon: FileCheck, arabicNum: '٤' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-4">
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E2DDD4] -translate-y-1/2 z-0" />

        {/* Active Filled Progress Line */}
        <div
          className="absolute top-1/2 right-0 h-1 bg-[#0F6E56] -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Step Nodes */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isPending = currentStep < step.number;
          const Icon = step.icon;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={isPending || step.number === 3}
                onClick={() => onStepClick && isCompleted && onStepClick(step.number)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#0F6E56] text-white shadow-subtle hover:bg-[#0C5A46] cursor-pointer'
                    : isCurrent
                    ? 'bg-white text-[#0F6E56] border-3 border-[#0F6E56] shadow-card ring-4 ring-[#E6F3EF]'
                    : 'bg-white text-[#5F5E5A] border-2 border-[#E2DDD4] cursor-default'
                }`}
                aria-label={`الخطوة ${step.arabicNum}: ${step.label}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span className="font-arabic text-base">{step.arabicNum}</span>
                )}
              </button>

              <div className="absolute top-14 whitespace-nowrap text-center">
                <span
                  className={`text-xs font-bold font-arabic block ${
                    isCurrent
                      ? 'text-[#085041]'
                      : isCompleted
                      ? 'text-[#0F6E56]'
                      : 'text-[#5F5E5A]/70'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-[#5F5E5A]/60 hidden sm:block">
                  الخطوة {step.arabicNum} من ٤
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
