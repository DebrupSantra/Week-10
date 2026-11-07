import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { dashboard: 'Dashboard', users: 'Users', orders: 'Orders', analytics: 'Analytics', settings: 'Settings' } },
    hi: { translation: { dashboard: 'डैशबोर्ड', users: 'उपयोगकर्ता', orders: 'ऑर्डर', analytics: 'विश्लेषण', settings: 'सेटिंग्स' } },
    bn: { translation: { dashboard: 'ড্যাশবোর্ড', users: 'ব্যবহারকারী', orders: 'অর্ডার', analytics: 'বিশ্লেষণ', settings: 'সেটিংস' } }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
