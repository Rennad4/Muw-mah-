import { JobMarketField } from './types';

export const SEED_JOB_FIELDS: JobMarketField[] = [
  {
    id: 'software-engineering',
    title: 'تطوير البرمجيات وهندسة الويب',
    iconName: 'Code2',
    description: 'بناء التطبيقات الحديثة والأنظمة السحابية والخدمات المصغرة وفق أحدث الممارسات الهندسية.',
    skills: [
      'التحكم في الإصدارات (Git & GitHub)',
      'تطوير واجهات المستخدم المتقدمة (React & Next.js)',
      'تطوير الواجهات الخلفية (Node.js & Express / NestJS)',
      'تصميم واجهات برمجة التطبيقات (RESTful APIs & GraphQL)',
      'لغة تايب سكريبت (TypeScript)',
      'إدارة وتصميم قواعد البيانات (PostgreSQL & MongoDB)',
      'أتمتة النشر والتكامل المستمر (CI/CD Pipelines)',
      'الحوسبة السحابية (AWS / Azure Cloud Fundamentals)',
      'اختبار البرمجيات والتطوير الموجه بالاختبار (TDD & Jest)',
      'معمارية الخدمات المصغرة (Microservices Architecture)',
      'الحاويات وتنسيقها (Docker & Containers)',
      'مبادئ التصميم النظيف ومراجعة الشيفرة (Clean Code & SOLID)',
      'معايير الأمان البرمجي وتأمين البيانات (Web Security & OWASP)'
    ]
  },
  {
    id: 'data-ai',
    title: 'تحليل البيانات والذكاء الاصطناعي',
    iconName: 'BrainCircuit',
    description: 'استخراج الأنماط وبناء النماذج التنبؤية وحلول الذكاء الاصطناعي التوليدي ولوحات التحكم.',
    skills: [
      'لغة بايثون لمعالجة البيانات (Python, Pandas, NumPy)',
      'استعلام وهندسة البيانات المتقدمة (Advanced SQL)',
      'لوحات القيادة وتصور البيانات (Power BI & Tableau)',
      'أساسيات تعلم الآلة والنماذج التنبؤية (Machine Learning & Scikit-Learn)',
      'النمذجة الإحصائية والاستدلالية (Statistical Modeling)',
      'أطر التعلم العميق والشبكات العصبية (PyTorch / TensorFlow)',
      'الذكاء الاصطناعي التوليدي وهندسة الأوامر (GenAI & LLM Integration)',
      'خطوط تدفق وهندسة البيانات (ETL & Data Pipelines)',
      'تنظيف وتجهيز البيانات المعقدة (Data Cleaning & Wrangling)',
      'تحليلات الأعمال ودعم اتخاذ القرار (Business Intelligence & Storytelling)',
      'مستودعات البيانات السحابية (BigQuery / Snowflake)',
      'نشر نماذج الذكاء الاصطناعي (MLOps Fundamentals)'
    ]
  },
  {
    id: 'digital-marketing',
    title: 'التسويق الرقمي ونمو الأعمال',
    iconName: 'TrendingUp',
    description: 'تخطيط وتنفيذ الحملات الإعلانية المدفوعة وتحسين محركات البحث والتحليلات التسويقية.',
    skills: [
      'تحسين محركات البحث (SEO & Technical SEO)',
      'إدارة الإعلانات الممولة (Google Ads & PPC Campaigns)',
      'تحليلات الويب وسلوك المستخدم (Google Analytics 4 & Tag Manager)',
      'استراتيجيات التسويق بالمحتوى والقصص التسويقية (Content Strategy)',
      'إدارة الحملات على وسائل التواصل (Meta, TikTok & LinkedIn Ads)',
      'التسويق عبر البريد الإلكتروني وأتمتة التسويق (Email Marketing & Automation)',
      'تحسين معدلات التحويل (Conversion Rate Optimization - CRO)',
      'أنظمة إدارة علاقات العملاء (HubSpot & CRM Management)',
      'تحليل السوق ومراقبة المنافسين (Market Research & Benchmarking)',
      'كتابة النصوص الإعلانية الجذابة (Copywriting & Persuasive Writing)',
      'تحليل العائد على الإنفاق الإعلاني (ROAS & ROI Measurement)',
      'التسويق القائم على البيانات والتجارب الرقمية (A/B Testing)'
    ]
  },
  {
    id: 'project-management',
    title: 'إدارة المشاريع الرقمية والرشاقة',
    iconName: 'KanbanSquare',
    description: 'قيادة فرق العمل وتنفيذ المبادرات التقنية وفق منهجيات الرشاقة وأطر التسليم الحديثة.',
    skills: [
      'منهجيات العمل الرشيقة (Agile, Scrum & Kanban Frameworks)',
      'إدارة الأدوات الرقمية للمشاريع (Jira, Asana, Trello & ClickUp)',
      'إدارة المخاطر وخطط الاستجابة (Risk Management & Mitigation)',
      'إدارة توقعات أصحاب المصلحة والتواصل الفعال (Stakeholder Management)',
      'تخطيط جولات العمل وإدارة قائمة المهام (Sprint Planning & Backlog Grooming)',
      'تحديد وقياس مؤشرات الأداء والأهداف (KPIs & OKRs Alignment)',
      'إدارة الميزانيات وتخصيص الموارد (Budgeting & Resource Allocation)',
      'إدارة دورة حياة المنتج الرقمي (Product Lifecycle Management)',
      'التوثيق التقني والإجرائي (Technical Documentation & SOPs)',
      'حل النزاعات والقيادة التمكينية (Servant Leadership & Team Facilitation)',
      'ضمان الجودة ومعايير التسليم النهائي (QA & Delivery Standards)'
    ]
  },
  {
    id: 'cybersecurity',
    title: 'الأمن السيبراني وحماية النظم',
    iconName: 'ShieldAlert',
    description: 'تقييم الثغرات وحماية الشبكات وتطبيق سياسات الامتثال والاستجابة للحوادث الأمنية.',
    skills: [
      'أمن الشبكات وجدران الحماية (Network Security, Firewalls & VPNs)',
      'تقييم الثغرات واختبار الاختراق الأخلاقي (Vulnerability Assessment & Pen Testing)',
      'إدارة الاستجابة للحوادث والتحليل الجنائي الرقمي (Incident Response & Forensics)',
      'معايير الامتثال والحوكمة الأمنية (ISO 27001, NIST, NCA Standards)',
      'إدارة الهوية والوصول المميز (Identity & Access Management - IAM)',
      'التشفير وحماية البيانات الحساسة (Cryptography & SSL/TLS & Key Management)',
      'مراقبة وتحليل السجلات الأمنية (SIEM Tools: Splunk, Wazuh & Microsoft Sentinel)',
      'أمن البنية التحتية السحابية (Cloud Security: AWS / Azure Security Controls)',
      'الممارسات الآمنة في التطوير (DevSecOps & Secure Coding Guidelines)',
      'الهندسة الاجتماعية والتوعية الأمنية (Social Engineering & Awareness)',
      'إدارة ومراجعة سياسات الأمان التنظيمية (Security Policy Architecture)'
    ]
  }
];
