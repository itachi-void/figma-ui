// 'use client';

// import { createContext, useContext, useState, ReactNode } from 'react';

// type Lang = 'en' | 'ar';

// interface I18nContextType {
//   lang: Lang;
//   t: (en: string, ar: string) => string;
//   toggleLang: () => void;
// }

// const I18nContext = createContext<I18nContextType | null>(null);

// export function I18nProvider({ children }: { children: ReactNode }) {
//   const [lang, setLang] = useState<Lang>('en');
//   const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');
//   const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

//   return (
//     <I18nContext.Provider value={{ lang, t, toggleLang }}>
//       <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
//         {children}
//       </div>
//     </I18nContext.Provider>
//   );
// }

// export function useI18n() {
//   const ctx = useContext(I18nContext);
//   if (!ctx) throw new Error('useI18n must be used within I18nProvider');
//   return ctx;
// }

// // Standalone Language Toggle Button (use in header)
// export function LangToggle() {
//   const { lang, toggleLang } = useI18n();
//   return (
//     <button
//       onClick={toggleLang}
//       className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors border border-gray-200"
//       title={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
//     >
//       <span className="text-base">{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
//       <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
//     </button>
//   );
// }
