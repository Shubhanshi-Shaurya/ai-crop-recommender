import React, { useState } from 'react';
import { Lock, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { executeOptimization } from '../services/api';

export default function FormTab({ darkMode, setActiveTab, setRawResults }) {
  const { user } = useAuth();

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [soilType, setSoilType] = useState('');
  const [pastCrop, setPastCrop] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorLog, setErrorLog] = useState('');

  const availableMarketCrops = [
    'Rice', 'Wheat', 'Maize', 'Barley', 'Chickpeas', 
    'Lentils', 'Soybeans', 'Cotton', 'Sugarcane', 
    'Mustard', 'Groundnuts', 'Potatoes', 'Onions'
  ];

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
        setLatitude("28.5382"); setLongitude("77.2090");
        setGpsLoading(false);
      }
    );
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    // Route Protection Barrier
    if (!user) {
      setActiveTab('login');
      return;
    }

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
        setActiveTab('dashboard');
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
    <div className="animate-fade" style={{ width: '100%', maxWidth: '600px', backgroundColor: darkMode ? '#0f172a' : '#ffffff', border: '1px solid var(--border)', padding: '2.5rem', borderRadius: '20px', boxShadow: 'var(--shadow)' }}>
      
      {!user && (
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '12px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontSize: '12px', fontWeight: 'bold' }}>
            <Lock size={16} />
            <span>Login Required to Access Diagnostics Engine</span>
          </div>
          <button onClick={() => setActiveTab('login')} style={{ border: 'none', backgroundColor: '#f59e0b', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
            Go to Login
          </button>
        </div>
      )}

      <h3 style={{ marginBottom: '1.5rem', fontWeight: 900, fontSize: '1.25rem' }}>Configure Agronomic Parameters</h3>
      
      <form onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-tint)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Field Location Metrics</span>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Latitude</label><input type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }} /></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Longitude</label><input type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }} /></div>
          </div>
          <button type="button" onClick={handleLiveGpsFetch} style={{ width: '100%', padding: '10px', border: '1px dashed var(--primary)', borderRadius: '8px', color: 'var(--primary)', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}>
            {gpsLoading ? "Accessing Device Satellites..." : "Fetch Current Location Coordinates"}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Soil Type</label>
            <select value={soilType} onChange={e => setSoilType(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
              <option value="" disabled>Choose Soil</option>
              <option value="Clayey">Clayey</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Past Crop History</label>
            <select value={pastCrop} onChange={e => setPastCrop(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
              <option value="" disabled>Choose Crop</option>
              {availableMarketCrops.map((crop, index) => <option key={index} value={crop}>{crop}</option>)}
              <option value="Other">Other / Fallow Land</option>
            </select>
          </div>
        </div>
        
        {errorLog && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>{errorLog}</p>}
        
        <button type="submit" disabled={submitLoading} style={{ width: '100%', padding: '14px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
          {submitLoading ? "Processing XGBoost Calculations..." : user ? "Execute Diagnostics Matrix" : "Log In to Execute Optimization"}
        </button>
      </form>
    </div>
  );
}