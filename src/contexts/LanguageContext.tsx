import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const LANGUAGE_KEY = "pymaster_language";

export const LANGUAGE_OPTIONS = [
  { value: "english", label: "Default (English)" },
  { value: "tamil", label: "Tamil" },
  { value: "kannada", label: "Kannada" },
  { value: "telugu", label: "Telugu" },
  { value: "hindi", label: "Hindi" },
] as const;

export type LanguageValue = (typeof LANGUAGE_OPTIONS)[number]["value"];
type TranslationKey = keyof typeof translations.english;

const translations = {
  english: {
    "language.title": "Language",
    "language.defaultEnglish": "Default (English)",
    "language.tamil": "Tamil",
    "language.kannada": "Kannada",
    "language.telugu": "Telugu",
    "language.hindi": "Hindi",
    "common.menu": "Menu",
    "common.morePages": "More pages here",
    "common.support": "Support",
    "common.signIn": "Sign In",
    "common.signOut": "Sign Out",
    "common.profileDashboard": "Profile & Dashboard",
    "common.lightMode": "Light Mode",
    "common.darkMode": "Dark Mode",
    "menu.content": "Content",
    "menu.practice": "Practice",
    "menu.career": "Career",
    "menu.support": "Support",
    "nav.home": "Home",
    "nav.learnPython": "Learn Python",
    "nav.problems": "Problems",
    "nav.dsaMastery": "DSA Mastery",
    "nav.dashboard": "Dashboard",
    "nav.blog": "Blog",
    "nav.projects": "Projects",
    "nav.compiler": "Compiler",
    "nav.aptitude": "Aptitude",
    "nav.quickPrep": "Quick Prep",
    "nav.pythonGame": "Python Game",
    "nav.pythonQuiz": "Python Quiz",
    "nav.jobs": "Jobs",
    "nav.leaderboard": "Leaderboard",
    "nav.careerRoadmap": "Career Roadmap",
    "nav.linuxMastery": "Linux Mastery",
    "nav.certificate": "Certificate",
    "nav.donate": "Donate",
    "nav.aboutUs": "About Us",
    "nav.contact": "Contact",
  },
  tamil: {
    "language.title": "மொழி",
    "language.defaultEnglish": "இயல்புநிலை (ஆங்கிலம்)",
    "language.tamil": "தமிழ்",
    "language.kannada": "கன்னடம்",
    "language.telugu": "தெலுங்கு",
    "language.hindi": "இந்தி",
    "common.menu": "மெனு",
    "common.morePages": "மேலும் பக்கங்கள்",
    "common.support": "ஆதரவு",
    "common.signIn": "உள்நுழை",
    "common.signOut": "வெளியேறு",
    "common.profileDashboard": "சுயவிவரம் & டாஷ்போர்டு",
    "common.lightMode": "ஒளி நிலை",
    "common.darkMode": "இருள் நிலை",
    "menu.content": "உள்ளடக்கம்",
    "menu.practice": "பயிற்சி",
    "menu.career": "தொழில்",
    "menu.support": "ஆதரவு",
    "nav.home": "முகப்பு",
    "nav.learnPython": "பைதான் கற்போம்",
    "nav.problems": "பிரச்சினைகள்",
    "nav.dsaMastery": "DSA நிபுணத்துவம்",
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.blog": "வலைப்பதிவு",
    "nav.projects": "திட்டங்கள்",
    "nav.compiler": "கம்பைலர்",
    "nav.aptitude": "திறன் தேர்வு",
    "nav.quickPrep": "விரைவு தயார்",
    "nav.pythonGame": "பைதான் விளையாட்டு",
    "nav.pythonQuiz": "பைதான் வினாடி வினா",
    "nav.jobs": "வேலைகள்",
    "nav.leaderboard": "தரவரிசை",
    "nav.careerRoadmap": "தொழில் சாலைவரைபடம்",
    "nav.linuxMastery": "லினக்ஸ் நிபுணத்துவம்",
    "nav.certificate": "சான்றிதழ்",
    "nav.donate": "நன்கொடை",
    "nav.aboutUs": "எங்களை பற்றி",
    "nav.contact": "தொடர்பு",
  },
  kannada: {
    "language.title": "ಭಾಷೆ",
    "language.defaultEnglish": "ಡೀಫಾಲ್ಟ್ (ಇಂಗ್ಲಿಷ್)",
    "language.tamil": "ತಮಿಳು",
    "language.kannada": "ಕನ್ನಡ",
    "language.telugu": "ತೆಲುಗು",
    "language.hindi": "ಹಿಂದಿ",
    "common.menu": "ಮೆನು",
    "common.morePages": "ಇನ್ನಷ್ಟು ಪುಟಗಳು",
    "common.support": "ಸಹಾಯ",
    "common.signIn": "ಲಾಗಿನ್",
    "common.signOut": "ಲಾಗೌಟ್",
    "common.profileDashboard": "ಪ್ರೊಫೈಲ್ & ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "common.lightMode": "ಲೈಟ್ ಮೋಡ್",
    "common.darkMode": "ಡಾರ್ಕ್ ಮೋಡ್",
    "menu.content": "ವಿಷಯಗಳು",
    "menu.practice": "ಅಭ್ಯಾಸ",
    "menu.career": "ವೃತ್ತಿ",
    "menu.support": "ಸಹಾಯ",
    "nav.home": "ಮುಖಪುಟ",
    "nav.learnPython": "ಪೈಥಾನ್ ಕಲಿಯಿರಿ",
    "nav.problems": "ಪ್ರಶ್ನೆಗಳು",
    "nav.dsaMastery": "DSA ಪರಿಣತಿ",
    "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "nav.blog": "ಬ್ಲಾಗ್",
    "nav.projects": "ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು",
    "nav.compiler": "ಕಂಪೈಲರ್",
    "nav.aptitude": "ಆಪ್ಟಿಟ್ಯೂಡ್",
    "nav.quickPrep": "ವೇಗದ ತಯಾರಿ",
    "nav.pythonGame": "ಪೈಥಾನ್ ಆಟ",
    "nav.pythonQuiz": "ಪೈಥಾನ್ ಕ್ವಿಜ್",
    "nav.jobs": "ಉದ್ಯೋಗಗಳು",
    "nav.leaderboard": "ಲೀಡರ್‌ಬೋರ್ಡ್",
    "nav.careerRoadmap": "ವೃತ್ತಿ ನಕ್ಷೆ",
    "nav.linuxMastery": "ಲಿನಕ್ಸ್ ಪರಿಣತಿ",
    "nav.certificate": "ಪ್ರಮಾಣಪತ್ರ",
    "nav.donate": "ದಾನ",
    "nav.aboutUs": "ನಮ್ಮ ಬಗ್ಗೆ",
    "nav.contact": "ಸಂಪರ್ಕ",
  },
  telugu: {
    "language.title": "భాష",
    "language.defaultEnglish": "డిఫాల్ట్ (ఇంగ్లీష్)",
    "language.tamil": "తమిళం",
    "language.kannada": "కన్నడ",
    "language.telugu": "తెలుగు",
    "language.hindi": "హిందీ",
    "common.menu": "మెను",
    "common.morePages": "మరిన్ని పేజీలు",
    "common.support": "సహాయం",
    "common.signIn": "సైన్ ఇన్",
    "common.signOut": "సైన్ అవుట్",
    "common.profileDashboard": "ప్రొఫైల్ & డాష్‌బోర్డ్",
    "common.lightMode": "లైట్ మోడ్",
    "common.darkMode": "డార్క్ మోడ్",
    "menu.content": "కంటెంట్",
    "menu.practice": "ప్రాక్టీస్",
    "menu.career": "కెరీర్",
    "menu.support": "సహాయం",
    "nav.home": "హోమ్",
    "nav.learnPython": "పైథాన్ నేర్చుకోండి",
    "nav.problems": "సమస్యలు",
    "nav.dsaMastery": "DSA నైపుణ్యం",
    "nav.dashboard": "డాష్‌బోర్డ్",
    "nav.blog": "బ్లాగ్",
    "nav.projects": "ప్రాజెక్టులు",
    "nav.compiler": "కంపైలర్",
    "nav.aptitude": "ఆప్టిట్యూడ్",
    "nav.quickPrep": "త్వరిత సిద్ధత",
    "nav.pythonGame": "పైథాన్ గేమ్",
    "nav.pythonQuiz": "పైథాన్ క్విజ్",
    "nav.jobs": "ఉద్యోగాలు",
    "nav.leaderboard": "లీడర్‌బోర్డ్",
    "nav.careerRoadmap": "కెరీర్ రోడ్‌మ్యాప్",
    "nav.linuxMastery": "లినక్స్ నైపుణ్యం",
    "nav.certificate": "సర్టిఫికేట్",
    "nav.donate": "దానం",
    "nav.aboutUs": "మా గురించి",
    "nav.contact": "సంప్రదించండి",
  },
  hindi: {
    "language.title": "भाषा",
    "language.defaultEnglish": "डिफॉल्ट (अंग्रेज़ी)",
    "language.tamil": "तमिल",
    "language.kannada": "कन्नड़",
    "language.telugu": "तेलुगु",
    "language.hindi": "हिंदी",
    "common.menu": "मेनू",
    "common.morePages": "और पेज यहां",
    "common.support": "सहायता",
    "common.signIn": "साइन इन",
    "common.signOut": "साइन आउट",
    "common.profileDashboard": "प्रोफाइल और डैशबोर्ड",
    "common.lightMode": "लाइट मोड",
    "common.darkMode": "डार्क मोड",
    "menu.content": "सामग्री",
    "menu.practice": "अभ्यास",
    "menu.career": "कैरियर",
    "menu.support": "सहायता",
    "nav.home": "होम",
    "nav.learnPython": "पायथन सीखें",
    "nav.problems": "समस्याएं",
    "nav.dsaMastery": "DSA महारत",
    "nav.dashboard": "डैशबोर्ड",
    "nav.blog": "ब्लॉग",
    "nav.projects": "प्रोजेक्ट्स",
    "nav.compiler": "कंपाइलर",
    "nav.aptitude": "एप्टीट्यूड",
    "nav.quickPrep": "क्विक प्रेप",
    "nav.pythonGame": "पायथन गेम",
    "nav.pythonQuiz": "पायथन क्विज",
    "nav.jobs": "नौकरियां",
    "nav.leaderboard": "लीडरबोर्ड",
    "nav.careerRoadmap": "कैरियर रोडमैप",
    "nav.linuxMastery": "लिनक्स महारत",
    "nav.certificate": "प्रमाणपत्र",
    "nav.donate": "दान",
    "nav.aboutUs": "हमारे बारे में",
    "nav.contact": "संपर्क",
  },
} as const;

type LanguageContextValue = {
  language: LanguageValue;
  setLanguage: (value: LanguageValue) => void;
  t: (key: TranslationKey) => string;
  languageOptions: typeof LANGUAGE_OPTIONS;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageValue>("english");

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && LANGUAGE_OPTIONS.some((option) => option.value === savedLanguage)) {
        setLanguageState(savedLanguage as LanguageValue);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (value: LanguageValue) => {
    setLanguageState(value);
    try {
      localStorage.setItem(LANGUAGE_KEY, value);
    } catch {
      // ignore
    }
  };

  const value = useMemo<LanguageContextValue>(() => {
    // Keep global UI text fixed in English.
    // Selected language is used by LearnPage content only.
    const t = (key: TranslationKey) => translations.english[key] ?? key;
    return {
      language,
      setLanguage,
      t,
      languageOptions: LANGUAGE_OPTIONS,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
