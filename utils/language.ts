export type LanguageCode = 'en' | 'ta' | 'hi' | 'ml';

let currentLanguage: LanguageCode = 'en';

export const setLanguage = (lang: LanguageCode) => {
    currentLanguage = lang;
};

export const getLanguage = (): LanguageCode => {
    return currentLanguage;
};

export const LANGUAGES = [
    { code: 'en', label: 'English', sub: 'Universal support' },
    { code: 'ta', label: 'Tamil', sub: 'Tamil Nadu' },
    { code: 'hi', label: 'Hindi', sub: 'North India' },
    { code: 'ml', label: 'Malayalam', sub: 'Kerala' },
] as const;
