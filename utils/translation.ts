import { LanguageCode } from './language';

export const TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
    // Phrases
    it_looks_like: {
        en: "It looks like",
        ta: "இது போல் தெரிகிறது",
        hi: "यह जैसा दिखता है",
        ml: "ഇതുപോലെ തോന്നുന്നു",
    },
    the_text_says: {
        en: "The text says",
        ta: "உரை சொல்கிறது",
        hi: "पाठ कहता है",
        ml: "വാചകം പറയുന്നു",
    },
    no_text_detected: {
        en: "No text detected",
        ta: "உரை எதுவும் கண்டறியப்படவில்லை",
        hi: "कोई पाठ नहीं मिला",
        ml: "വാചകമൊന്നും കണ്ടെത്തിയില്ല",
    },
    matches_well_with: {
        en: "matches well with",
        ta: "நன்றாகப் பொருந்துகிறது",
        hi: "के साथ अच्छी तरह मेल खाता है",
        ml: "ഇതുമായി നന്നായി യോജിക്കുന്നു",
    },

    // Colors
    Red: { en: "Red", ta: "சிவப்பு", hi: "लाल", ml: "ചുവപ്പ്" },
    DarkRed: { en: "Dark Red", ta: "அடர் சிவப்பு", hi: "गहरा लाल", ml: "കടും ചുവപ്പ്" },
    Green: { en: "Green", ta: "பச்சை", hi: "हरा", ml: "പച്ച" },
    DarkGreen: { en: "Dark Green", ta: "அடர் பச்சை", hi: "गहरा हरा", ml: "കടും പച്ച" },
    Blue: { en: "Blue", ta: "நீலம்", hi: "नीला", ml: "നീലം" },
    DarkBlue: { en: "Dark Blue", ta: "அடர் நீலம்", hi: "गहरा नीला", ml: "കടും നീലം" },
    Yellow: { en: "Yellow", ta: "மஞ்சள்", hi: "पीला", ml: "മഞ്ഞ" },
    Orange: { en: "Orange", ta: "ஆரஞ்சு", hi: "नारंगी", ml: "ഓറഞ്ച്" },
    Purple: { en: "Purple", ta: "ஊதா", hi: "बैंगनी", ml: "പർപ്പിൾ" },
    Violet: { en: "Violet", ta: "ஊதா", hi: "बैंगनी", ml: "വയലറ്റ്" },
    Pink: { en: "Pink", ta: "இளஞ்சிவப்பு", hi: "गुलाबी", ml: "പിങ്ക്" },
    HotPink: { en: "Hot Pink", ta: "அடர் இளஞ்சிவப்பு", hi: "गहरा गुलाबी", ml: "ഹോട്ട് പിങ്ക്" },
    Brown: { en: "Brown", ta: "பழுப்பு", hi: "भूरा", ml: "തവിട്ട്" },
    Black: { en: "Black", ta: "கருப்பு", hi: "काला", ml: "കറുപ്പ്" },
    White: { en: "White", ta: "வெள்ளை", hi: "सफेद", ml: "വെള്ള" },
    Gray: { en: "Gray", ta: "சாம்பல்", hi: "धूसर", ml: "ചാരനിറം" },
    LightGray: { en: "Light Gray", ta: "மெல்லிய சாம்பல்", hi: "हल्का धूसर", ml: "ഇളം ചാരനിറം" },
    Cyan: { en: "Cyan", ta: "நீலப்பச்சை", hi: "स्यान", ml: "സിയാൻ" },
    Teal: { en: "Teal", ta: "டீல்", hi: "टील", ml: "ടീൽ" },
    Magenta: { en: "Magenta", ta: "மெஜந்தா", hi: "मैजेंटा", ml: "മജന്ത" },
    Lime: { en: "Lime", ta: "எலுமிச்சை பச்சை", hi: "लाइम", ml: "ലൈം" },
    Gold: { en: "Gold", ta: "தங்கம்", hi: "सुनहरा", ml: "സ്വർണ്ണനിറം" },
    Silver: { en: "Silver", ta: "வெள்ளி", hi: "चांदी", ml: "വെള്ളി" },
    Navy: { en: "Navy", ta: "கடற்படை நீலம்", hi: "नेवी ब्लू", ml: "നേവി ബ്ലൂ" },
    Maroon: { en: "Maroon", ta: "மெரூன்", hi: "मरून", ml: "മെറൂൺ" },
    Olive: { en: "Olive", ta: "ஆலிவ்", hi: "जैतून", ml: "ഒലിവ്" },
    Coral: { en: "Coral", ta: "பவளம்", hi: "मूँगा", ml: "പവിഴം" },
    Indigo: { en: "Indigo", ta: "இண்டிகோ", hi: "इंडिगो", ml: "ഇൻഡിഗോ" },
    Turquoise: { en: "Turquoise", ta: "டர்க்கைஸ்", hi: "फ़िरोज़ा", ml: "ടർക്കോയ്സ്" },
    SkyBlue: { en: "Sky Blue", ta: "வானம் நீலம்", hi: "आसमानी नीला", ml: "ആകാശ നീലം" },
    Chocolate: { en: "Chocolate", ta: "சாக்லேட்", hi: "चॉकलेट", ml: "ചോക്ലേറ്റ്" },
    Crimson: { en: "Crimson", ta: "கருஞ்சிவப்பு", hi: "क्रिमसन", ml: "കടും ചുവപ്പ്" },
    Lavender: { en: "Lavender", ta: "லாவெண்டர்", hi: "लवेन्डर", ml: "ലാവെൻഡർ" },
    Beige: { en: "Beige", ta: "பழுப்பு", hi: "बेज", ml: "ബീജ്" },
};

export const getTranslated = (key: string, lang: LanguageCode): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
        return TRANSLATIONS[key][lang];
    }
    // Fallback: If not found, check if it's a known color key even if not explicitly in the list above
    // or return key itself (English fallback)
    return key;
};
