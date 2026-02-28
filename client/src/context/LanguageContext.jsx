import React, { createContext, useState, useContext } from 'react';

export const LanguageContext = createContext();

export const translations = {
  en: {
    findMatch: "Find Your Perfect Match",
    subtitle: "Simple, trusted matrimony service for our community. Register today to find profiles from your village and district.",
    searchBtn: "Search Profiles",
    createBtn: "Create Profile",
    step1: "1. Register",
    step1Desc: "Create an account using your mobile number.",
    step2: "2. Create Profile",
    step2Desc: "Add your details and upload photos.",
    step3: "3. Connect",
    step3Desc: "Search matches and view contact numbers directly.",
    latestProfiles: "Latest Profiles",
    viewDetails: "View Details",
    maleProfiles: "Latest Grooms",
    femaleProfiles: "Latest Brides",
    toggleLang: "Switch to Hindi",
    whyChooseUs: "Why Choose Us?",
    why1: "Trusted by Community",
    why1Desc: "Verified profiles from our own village and districts.",
    why2: "100% Free",
    why2Desc: "No subscription charges. Completely free service.",
    why3: "Privacy Focused",
    why3Desc: "Your mobile number is only shown to registered users.",
    successStories: "Success Stories",
    story1: "Ravi & Priya found each other through this platform.",
    story2: "A perfect match from the same district.",
    
    // Navbar
    home: "Home",
    allMembers: "All Members",
    myProfile: "My Profile",
    login: "Login",
    register: "Register",
    logout: "Logout",
    adminPanel: "Admin Panel",

    // Common Profile Fields
    name: "Name",
    gender: "Gender",
    age: "Age",
    height: "Height",
    maritalStatus: "Marital Status",
    religion: "Religion",
    caste: "Caste",
    education: "Education",
    occupation: "Occupation",
    disability: "Disability",
    disabilityPlaceholder: "Any disability? (e.g. None, Speech, Walking)",
    filterDisability: "Filter by Disability",
    village: "Village",
    district: "District",
    state: "State",
    mobile: "Mobile",
    aboutMe: "About Me",
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    gotra: "Gotra",
    myFamily: "My Family",
    familyDetails: "Family Details",
    
    // Search Page
    allRegisteredMembers: "All Registered Members",
    filterBtn: "Filter",
    allGenders: "All Genders",
    male: "Male",
    female: "Female",
    minAge: "Min Age",
    maxAge: "Max Age",
    byDistrict: "By District",
    byName: "By Name",
    noProfiles: "No profiles found.",

    // Profile Details
    years: "Years",
    viewContact: "View Contact Number",
    loginToView: "Login to view contact details",
    loginNow: "Login Now",
    reportFake: "Report Fake Profile",
    photoGallery: "Photo Gallery",
    addPhotos: "Add More Photos",
    noPhotos: "No Photos",
    uploading: "Uploading...",
    
    // Modals
    pleaseLoginTitle: "Login Required",
    pleaseLoginMsg: "Please login to view member's complete profile and contact details.",
    
    // Create/Edit
    basicDetails: "Basic Details",
    socialEducation: "Social & Education",
    locationContact: "Location & Contact",
    saveProfile: "Save Profile",
    updateProfile: "Update Profile",
    currentPhotos: "Current Photos",
    maxPhotos: "Max 4 Total",
    createYourProfile: "Create Your Profile",
    editProfile: "Edit Profile"
  },
  hi: {
    findMatch: "अपना जीवनसाथी खोजें",
    subtitle: "हमारे समाज की विश्वसनीय वैवाहिक सेवा। अपने गाँव और जिले के रिश्तों के लिए आज ही रजिस्टर करें।",
    searchBtn: "रिश्ते खोजें",
    createBtn: "प्रोफाइल बनाएं",
    step1: "1. रजिस्टर करें",
    step1Desc: "अपने मोबाइल नंबर से खाता बनाएं।",
    step2: "2. प्रोफाइल बनाएं",
    step2Desc: "अपनी जानकारी और फोटो अपलोड करें।",
    step3: "3. संपर्क करें",
    step3Desc: "रिश्ते खोजें और सीधे मोबाइल नंबर देखें।",
    latestProfiles: "नवीनतम प्रोफाइल",
    viewDetails: "विवरण देखें",
    maleProfiles: "नवीनतम वर (Grooms)",
    femaleProfiles: "नवीनतम वधू (Brides)",
    toggleLang: "अंग्रेजी में बदलें",
    whyChooseUs: "हमें क्यों चुनें?",
    why1: "समाज का भरोसा",
    why1Desc: "हमारे अपने गाँव और ज़िलों से सत्यापित प्रोफाइल।",
    why2: "100% मुफ़्त",
    why2Desc: "कोई शुल्क नहीं। पूरी तरह से मुफ़्त सेवा।",
    why3: "गोपनीयता",
    why3Desc: "आपका मोबाइल नंबर केवल रजिस्टर्ड लोगों को ही दिखता है।",
    successStories: "सफलता की कहानियाँ",
    story1: "रवि और प्रिया को एक-दूसरे का साथ मिला।",
    story2: "एक ही जिले से एक आदर्श जोड़ी।",

    // Navbar
    home: "होम",
    allMembers: "सभी सदस्य",
    myProfile: "मेरा प्रोफाइल",
    login: "लॉगिन",
    register: "रजिस्टर",
    logout: "लॉगआउट",
    adminPanel: "एडमिन पैनल",

    // Common Profile Fields
    name: "नाम",
    gender: "लिंग",
    age: "उम्र",
    height: "कद",
    maritalStatus: "वैवाहिक स्थिति",
    religion: "धर्म",
    caste: "जाति",
    education: "शिक्षा",
    occupation: "व्यवसाय",
    disability: "विकलांगता",
    disabilityPlaceholder: "कोई विकलांगता? (जैसे: नहीं, मूक, चलने में दिक्कत)",
    filterDisability: "विकलांगता के आधार पर",
    village: "गाँव",
    district: "ज़िला",
    state: "राज्य",
    mobile: "मोबाइल",
    aboutMe: "मेरे बारे में",
    fatherName: "पिता का नाम",
    motherName: "माता का नाम",
    gotra: "गोत्र",
    myFamily: "मेरा परिवार",
    familyDetails: "परिवार का विवरण",

    // Search Page
    allRegisteredMembers: "सभी पंजीकृत सदस्य",
    filterBtn: "फिल्टर",
    allGenders: "सभी",
    male: "पुरुष",
    female: "महिला",
    minAge: "न्यूनतम उम्र",
    maxAge: "अधिकतम उम्र",
    byDistrict: "ज़िले से खोजें",
    byName: "नाम से खोजें",
    noProfiles: "कोई प्रोफाइल नहीं मिला।",

    // Profile Details
    years: "वर्ष",
    viewContact: "मोबाइल नंबर देखें",
    loginToView: "नंबर देखने के लिए लॉगिन करें",
    loginNow: "अभी लॉगिन करें",
    reportFake: "फर्जी प्रोफाइल की रिपोर्ट करें",
    photoGallery: "फोटो गैलरी",
    addPhotos: "और फोटो जोड़ें",
    noPhotos: "कोई फोटो नहीं",
    uploading: "अपलोड हो रहा है...",

    // Modals
    pleaseLoginTitle: "लॉगिन आवश्यक है",
    pleaseLoginMsg: "सदस्य का पूरा प्रोफाइल और संपर्क विवरण देखने के लिए कृपया लॉगिन करें।",

    // Create/Edit
    basicDetails: "मूल विवरण",
    socialEducation: "सामाजिक और शिक्षा",
    locationContact: "स्थान और संपर्क",
    saveProfile: "प्रोफाइल सहेजें",
    updateProfile: "प्रोफाइल अपडेट करें",
    currentPhotos: "मौजूदा फोटो",
    maxPhotos: "अधिकतम 4",
    createYourProfile: "अपना प्रोफाइल बनाएं",
    editProfile: "प्रोफाइल संपादित करें"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
