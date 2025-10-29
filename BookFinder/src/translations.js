// src/translations.js
// UI text translations (minimal set used by the app)
// Languages included: English, Hindi, Tamil, Telugu, Malayalam, (Malayalam shown as "mal")
export const TRANSLATIONS = {
  eng: {
    searchPlaceholder: "Type a book title...",
    authorPlaceholder: "Author (optional)",
    search: "Search",
    reset: "Reset",
    favorites: "Favorites",
    noFavorites: "No favorites yet. Sign in and click ☆ to save.",
    login: "Sign in / Register",
    logout: "Logout",
    pageLabel: "Page",
    signedIn: "Signed in",
    signInRegister: "Sign in / Register",
    editProfile: "Edit Profile",
  },

  hin: {
    searchPlaceholder: "कृपया किताब का शीर्षक टाइप करें...",
    authorPlaceholder: "लेखक (वैकल्पिक)",
    search: "खोजें",
    reset: "रीसेट",
    favorites: "पसंदीदा",
    noFavorites: "कोई पसंदीदा नहीं। साइन इन करें और ☆ क्लिक करें।",
    login: "साइन इन / पंजीकरण",
    logout: "लॉग आउट",
    pageLabel: "पृष्ठ",
    signedIn: "साइन इन किया हुआ",
    signInRegister: "साइन इन / रजिस्टर",
    editProfile: "प्रोफ़ाइल संपादित करें",
  },

  tam: {
    searchPlaceholder: "ஒரு புத்தகத் தலைப்பை உள்ளிடவும்...",
    authorPlaceholder: "ஆசிரியர் (விருப்பமுள்ள)",
    search: "தேடு",
    reset: "மீட்டமை",
    favorites: "பிடித்தவை",
    noFavorites: "இன்னும் எந்த பிடித்தவையுமில்லை. சேமிக்க ☆ அழுத்த உள்நுழையவும்.",
    login: "உள் நுழை / பதிவு",
    logout: "வெளியேறு",
    pageLabel: "பக்கம்",
    signedIn: "உள் நுழைந்தவர்",
    signInRegister: "உள் நுழை / பதிவு செய்",
    editProfile: "சுயவிவரத்தை தொகு",
  },

  tel: {
    searchPlaceholder: "పుస్తక శీర్షికను టైప్ చేయండి...",
    authorPlaceholder: "కర్త (ఐచ్ఛికం)",
    search: "శోధించు",
    reset: "రీసెట్",
    favorites: "ప్రియమైనవి",
    noFavorites: "ఇప్పుడే ఎలాంటి ప్రియమైనవి ఉండవు. సేవ్ చేయడానికి సైన్ ఇన్ చేసి ☆ నొక్కండి.",
    login: "సైన్ ఇన్ / రిజిస్టర్",
    logout: "లాగ్ అవుట్",
    pageLabel: "పేజీ",
    signedIn: "సైన్ ఇన్ అయింది",
    signInRegister: "సైన్ ఇన్ / నమోదు",
    editProfile: "ప్రొఫైల్ సవరించు",
  },

  mal: {
    searchPlaceholder: "ഒരു പുസ്തകത്തിന്റെ പേര് ടൈപ്പ് ചെയ്യുക...",
    authorPlaceholder: "ഏഴുത്തുകാരൻ (ഐച്ഛികം)",
    search: "തിരയുക",
    reset: "റീസെറ്റ്",
    favorites: "പ്രിയപ്പെട്ടവ",
    noFavorites: "ഇതുവരെയില്ലാത്ത പ്രിയപ്പെട്ടവകള്‍. സംരക്ഷിക്കാന്‍ സൈൻ ഇൻ ചെയ്ത് ☆ ക്ലിക് ചെയ്യുക.",
    login: "സൈൻ ഇൻ / രജിസ്റ്റർ ചെയ്യുക",
    logout: "ലോഗൗട്ട്",
    pageLabel: "പേജ്",
    signedIn: "സൈൻ ഇൻ ചെയ്തു",
    signInRegister: "സൈൻ ഇൻ / രജിസ്റ്റർ",
    editProfile: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക",
  }
};

// LANGUAGES mapping used for the language dropdown.
// Only includes the six languages above — update Header.jsx to import LANGUAGES.
export const LANGUAGES = {
  eng: "English (English)",
  hin: "हिन्दी (Hindi)",
  tam: "தமிழ் (Tamil)",
  tel: "తెలుగు (Telugu)",
  mal: "മലയാളം (Malayalam)",
};
