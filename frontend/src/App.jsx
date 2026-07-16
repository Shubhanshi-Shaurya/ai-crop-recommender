import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Globe, Sprout, Navigation, LayoutDashboard, 
  Home, ClipboardList, ArrowRight, BarChart3, CloudSun, ShieldAlert 
} from 'lucide-react';
import { fetchSupportedLanguages, translateContent, executeOptimization } from './services/api';

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

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('en-IN');
  const [languagesList, setLanguagesList] = useState([]);
  const [content, setContent] = useState(baseContent);
  const [isTranslating, setIsTranslating] = useState(false);

  // Field Inputs Location Telemetry States
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [soilType, setSoilType] = useState('');
  const [pastCrop, setPastCrop] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  // Submission Management States
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorLog, setErrorLog] = useState('');
  const [rawResults, setRawResults] = useState(null);
  const [translatedResults, setTranslatedResults] = useState(null);

  const availableMarketCrops = [
    'Rice', 'Wheat', 'Maize', 'Barley', 'Chickpeas', 
    'Lentils', 'Soybeans', 'Cotton', 'Sugarcane', 
    'Mustard', 'Groundnuts', 'Potatoes', 'Onions'
  ];

  useEffect(() => {
    fetchSupportedLanguages().then(data => setLanguagesList(data));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Synchronized translation layer for both Layout and async ML results
  useEffect(() => {
    const runGlobalTranslation = async () => {
      setIsTranslating(true);
      const uiTrans = await translateContent(baseContent, lang);
      setContent(uiTrans);

      if (rawResults) {
        const resultsTrans = await translateContent(rawResults, lang);
        setTranslatedResults(resultsTrans);
      }
      setIsTranslating(false);
    };
    runGlobalTranslation();
  }, [lang, rawResults]);

  const handleLiveGpsFetch = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
      },
      () => {
        setLatitude("28.5382"); setLongitude("77.2090"); // India Default Fallback
        setGpsLoading(false);
      }
    );
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude || !soilType || !pastCrop) return;
    
    setSubmitLoading(true);
    setErrorLog('');
    
    try {
      const output = await executeOptimization({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        soil_type: soilType,
        past_crop: pastCrop
      });
      
      if (output.status === 'success') {
        setRawResults(output);
        setActiveTab('dashboard'); // Redirect safely on response receipt
      } else {
        setErrorLog(output.message || "Model engine processing exception.");
      }
    } catch (err) {
      setErrorLog("Failed to target backend model loops. Ensure Flask is online.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER NAV BAR CONTAINER */}
      <nav style={{ width: '100%', borderBottom: '1px solid var(--border)', backgroundColor: darkMode ? '#0f172a' : '#ffffff', position: 'sticky', top: 0, zIndex: 100, padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 900, fontSize: '1.25rem' }} onClick={() => setActiveTab('home')}>
            <Sprout size={24} />
            <span>{content.navTitle}</span>
            {isTranslating && <span style={{ fontSize: '10px', color: '#f59e0b', marginLeft: '6px' }}>• Translating...</span>}
          </div>

          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-tint)', padding: '4px', borderRadius: '10px' }}>
            <button onClick={() => setActiveTab('home')} style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === 'home' ? (darkMode ? '#334155' : '#ffffff') : 'transparent', color: activeTab === 'home' ? 'var(--primary)' : 'var(--text-muted)' }}>{content.tabHome}</button>
            <button onClick={() => setActiveTab('form')} style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === 'form' ? (darkMode ? '#334155' : '#ffffff') : 'transparent', color: activeTab === 'form' ? 'var(--primary)' : 'var(--text-muted)' }}>{content.tabForm}</button>
            <button onClick={() => setActiveTab('dashboard')} style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === 'dashboard' ? (darkMode ? '#334155' : '#ffffff') : 'transparent', color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-muted)' }}>{content.tabDashboard}</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-tint)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <Globe size={14} style={{ color: 'var(--text-muted)', marginRight: '4px' }} />
              <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: 'transparent', border: 'none', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
                {languagesList.map(l => <option key={l.code} value={l.code} style={{ color: '#000000' }}>{l.name}</option>)}
              </select>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} style={{ border: '1px solid var(--border)', background: 'var(--bg-tint)', padding: '6px', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

        </div>
      </nav>

      {/* INNER VIEW MODULE SWITCHER */}
      <div className="main-content" style={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {activeTab === 'home' && (
          <div className="animate-fade" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', maxWidth: '800px', lineHeight: 1.15 }}>{content.heroHeading}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.6 }}>{content.heroSubheading}</p>
            <button onClick={() => setActiveTab('form')} style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{content.ctaButton}</span> <ArrowRight size={16} />
            </button>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="animate-fade" style={{ width: '100%', maxWidth: '600px', backgroundColor: darkMode ? '#0f172a' : '#ffffff', border: '1px solid var(--border)', padding: '2.5rem', borderRadius: '20px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 900, fontSize: '1.25rem' }}>Configure Agronomic Parameters</h3>
            <form onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Latitude</label><input type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', outline: 'none' }} /></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Longitude</label><input type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', outline: 'none' }} /></div>
              </div>
              <button type="button" onClick={handleLiveGpsFetch} style={{ width: '100%', padding: '10px', border: '1px dashed var(--primary)', borderRadius: '8px', color: 'var(--primary)', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}>
                {gpsLoading ? "Accessing Device Satellites..." : "Fetch Current Location Coordinates"}
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Soil Type</label><select value={soilType} onChange={e => setSoilType(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}><option value="" disabled>Choose Soil</option><option value="Clayey">Clayey</option><option value="Loamy">Loamy</option><option value="Sandy">Sandy</option></select></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Past Crop History</label><select value={pastCrop} onChange={e => setPastCrop(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}><option value="" disabled>Choose Crop</option>{availableMarketCrops.map((crop, index) => <option key={index} value={crop}>{crop}</option>)}<option value="Other">Other / Fallow Land</option></select></div>
              </div>
              {errorLog && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>{errorLog}</p>}
              <button type="submit" disabled={submitLoading} style={{ width: '100%', padding: '14px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
                {submitLoading ? "Processing XGBoost Calculations..." : "Execute Diagnostics Matrix"}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="animate-fade" style={{ width: '100%', maxWidth: '800px' }}>
            {!translatedResults ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem', fontWeight: 'bold' }}>No telemetry calculations loaded yet. Please configure the input form structure first.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Optimal Recommendation Selection:</span>
                  <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--primary)' }}>{translatedResults.most_appropriate_crop}</span>
                </div>
                {translatedResults.all_crop_rankings?.map((item, index) => (
                  <div key={index} style={{ border: '1px solid var(--border)', padding: '1.25rem 1.75rem', borderRadius: '16px', backgroundColor: darkMode ? '#0f172a' : '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow)' }}>
                    <div>
                      <h3 style={{ fontWeight: 900, fontSize: '1.1rem' }}>{item.crop}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>Yield Forecast: {item.predicted_yield_tons_per_acre} Tons/Acre</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2.5rem' }}>
                      <div style={{ textAlign: 'right' }}><span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Net Profits</span><span style={{ fontWeight: 900, color: 'var(--primary)' }}>₹{item.estimated_profit_inr.toLocaleString('en-IN')}</span></div>
                      <div style={{ textAlign: 'right' }}><span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Sustainability</span><span style={{ fontWeight: 'bold', color: item.sustainability_score > 70 ? 'var(--primary)' : '#f59e0b' }}>{item.sustainability_score}/100</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <footer className="agri-footer"><p>{content.footer}</p></footer>
    </div>
  );
}