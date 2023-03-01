import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import rootEn from './en/rootNs.json';
import rootEs from './es/rootNs.json';

export const defaultNS = 'root';

export const resources = {
  en: {
    root: rootEn,
  },
  es: {
    root: rootEs,
  }
};

i18next.use(initReactI18next).init({
  lng: 'en', // if you're using a language detector, do not define the lng option
  debug: true,
  resources,
  defaultNS,
});
