import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import FormTab from './components/FormTab';
import DashboardTab from './components/DashboardTab';
import LoginTab from './components/LoginTab';
import RegisterTab from './components/RegisterTab';
import { fetchSupportedLanguages, translateContent } from './services/api';

const baseContent = {
  navTitle: "KisanAI Portal",
  tabHome: "Home",
  tabForm: "Optimization Form",
  tabDashboard: "Analytics Dashboard",
  heroHeading: "Empowering Indian Farmers with Science-Guided AI Decision Support",
  heroSubheading: "Get real-time satellite soil analytics, hyper-localized weather risk matrices, and live scraped market price insights instantly.",
  ctaButton: "Launch Decision Engine",
  footer: "© 2026 KisanAI Decision Support System. Developed for Sustainable Agriculture."
};

function MainLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('en-IN');
  const [languagesList, setLanguagesList] = useState([]);
  const [content, setContent] = useState(baseContent);
  const [isTranslating, setIsTranslating] = useState(false);

  const [rawResults, setRawResults] = useState(null);
  const [translatedResults, setTranslatedResults] = useState(null);

  useEffect(() => {
    fetchSupportedLanguages().then(data => setLanguagesList(data || []));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const runGlobalTranslation = async () => {
      setIsTranslating(true);
      const uiTrans = await translateContent(baseContent, lang);
      setContent(uiTrans || baseContent);

      if (rawResults) {
        const resultsTrans = await translateContent(rawResults, lang);
        setTranslatedResults(resultsTrans);
      }
      setIsTranslating(false);
    };
    runGlobalTranslation();
  }, [lang, rawResults]);

  return (
    <div className="page-wrapper" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        lang={lang} 
        setLang={setLang} 
        languagesList={languagesList} 
        isTranslating={isTranslating} 
        content={content} 
      />

      <div className="main-content" style={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {activeTab === 'home' && <HomeTab content={content} setActiveTab={setActiveTab} />}
        {activeTab === 'form' && <FormTab darkMode={darkMode} setActiveTab={setActiveTab} setRawResults={setRawResults} />}
        {activeTab === 'dashboard' && <DashboardTab translatedResults={translatedResults} darkMode={darkMode} />}
        {activeTab === 'login' && <LoginTab setActiveTab={setActiveTab} darkMode={darkMode} />}
        {activeTab === 'register' && <RegisterTab setActiveTab={setActiveTab} darkMode={darkMode} />}
      </div>

      <footer className="agri-footer">
        <p>{content.footer}</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}