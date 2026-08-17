export interface SkillGap {
  skill: string;
  importance: 'عالية الأهمية' | 'متوسطة' | 'متقدمة' | 'أساسية';
  description?: string;
  category?: string;
}

export interface SyllabusSuggestion {
  section: string;
  before: string;
  after: string;
  rationale: string;
}

export interface AnalysisResult {
  id: string;
  courseName: string;
  fieldOfStudy: string;
  matchScore: number;
  overallAssessment: string;
  gaps: SkillGap[];
  suggestions: SyllabusSuggestion[];
  marketSkillsUsed: string[];
  createdAt: string;
}

export interface JobMarketField {
  id: string;
  title: string;
  iconName: string;
  description: string;
  skills: string[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  university: string;
  email: string;
  createdAt: string;
}
