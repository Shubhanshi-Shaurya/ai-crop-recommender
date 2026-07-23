import React from 'react';

export default function DashboardTab({ translatedResults, darkMode }) {
  return (
    <div className="animate-fade" style={{ width: '100%', maxWidth: '800px' }}>
      {!translatedResults ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem', fontWeight: 'bold' }}>
          No telemetry calculations loaded yet. Please configure the input form structure first.
        </div>
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
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Net Profits</span>
                  <span style={{ fontWeight: 900, color: 'var(--primary)' }}>₹{item.estimated_profit_inr?.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Sustainability</span>
                  <span style={{ fontWeight: 'bold', color: item.sustainability_score > 70 ? 'var(--primary)' : '#f59e0b' }}>{item.sustainability_score}/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}