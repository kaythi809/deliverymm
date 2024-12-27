// src/context/LanguageContext.js
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Simple translation function
  const t = (key) => {
    const translations = {
      en: {
        'Dashboard': 'Dashboard',
        'Way Management': 'Way Management',
        'Create Ways': 'Create Ways',
        'Parcel In/Out': 'Parcel In/Out',
        'Online Shops': 'Online Shops',
        'Add Online Shop': 'Add Online Shop',
        'Online Shops List': 'Online Shops List',
        'Riders': 'Riders',
        'Add Rider': 'Add Rider',
        'Rider List': 'Rider List',
        'Settings': 'Settings',
        'Add User': 'Add User',
        'User List': 'User List',
        'Logout': 'Logout'
      },
      my: {
        // Add Myanmar translations here
        'Dashboard': 'ဒက်ရှ်ဘုတ်',
        'Way Management': 'လမ်းကြောင်းစီမံခန့်ခွဲမှု',
        'Create Ways': 'လမ်းကြောင်းအသစ်ဖန်တီးရန်',
        'Parcel In/Out': 'ပါဆယ်ဝင်/ထွက်',
        'Online Shops': 'အွန်လိုင်းဆိုင်များ',
        'Add Online Shop': 'အွန်လိုင်းဆိုင်အသစ်ထည့်ရန်',
        'Online Shops List': 'အွန်လိုင်းဆိုင်စာရင်း',
        'Riders': 'ပို့ဆောင်သူများ',
        'Add Rider': 'ပို့ဆောင်သူအသစ်ထည့်ရန်',
        'Rider List': 'ပို့ဆောင်သူစာရင်း',
        'Settings': 'ဆက်တင်များ',
        'Add User': 'အသုံးပြုသူအသစ်ထည့်ရန်',
        'User List': 'အသုံးပြုသူစာရင်း',
        'Logout': 'ထွက်ရန်'
      }
    };

    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'my' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;