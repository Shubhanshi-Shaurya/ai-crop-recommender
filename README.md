# Kisan AI — Precision Farming Assistant & Hyper-Localized Crop Recommendation System

An intelligent, full-stack precision agriculture platform engineered with **React.js (Vite)**, **Python Flask**, **XGBoost**, **PostgreSQL**, **Firebase**, **OpenWeatherMap**, and **Sarvam AI**. Kisan AI empowers farmers with real-time yield forecasts, net financial profit projections (INR), agronomic sustainability scores, and native vernacular language translation based on their exact field GPS coordinates.

---

## Key Features

* **Hyper-Localized GPS Telemetry:** Automatically captures hardware GPS coordinates (`Latitude`, `Longitude`) via the browser Geolocation API and fetches live ambient temperature, humidity, and rainfall data from **OpenWeatherMap**.
* **AI-Powered Yield Prediction:** Uses a serialized **XGBoost Regressor** paired with a pre-fitted `StandardScaler` to forecast crop-specific yields (tons/acre) across major Indian soil classifications (*Alluvial, Loamy, Black, Red, Clay, Sandy*).
* **Live Mandi Price Integration & Profit Modeling:** Scrapes live wholesale agricultural commodity rates to calculate gross revenue, net profit (INR), and profit margin percentages per acre.
* **Dynamic Agronomic Sustainability Index:** Evaluates each crop using a composite Suitability Index that balances net profitability (60% weight) with ecological stewardship—rewarding crop rotation diversity and penalizing water-intensive crops in low-rainfall zones.
* **Multilingual Vernacular Interface:** Integrates **Sarvam AI** with a recursive client-side JSON parser to translate UI labels and crop advisories into **7 Indian languages** (*English, Hindi, Punjabi, Telugu, Tamil, Marathi, Bengali*) while keeping numerical metrics intact.
* **Authentication & Query Audit Persistence:** Secured via **Firebase Auth** (JWT Bearer verification) and backed by **PostgreSQL** (`Flask-SQLAlchemy`) to log every diagnostic query and display historical recommendations.

---

## Project Structure

```text
crop_recommender/
├── backend/
│   ├── app/
│   │   ├── __init__.py             
│   │   ├── models.py                
│   │   ├── routes.py                
│   │   ├── models/
│   │   │   ├── model_xgboost.json   
│   │   │   ├── yield_scaler.pkl     
│   │   │   └── feature_layout.json  
│   │   └── pipeline/
│   │       ├── telemetry_fetcher.py 
│   │       └── market_scraper.py    
│   ├── .env                        
│   ├── requirements.txt             
│   └── run.py                       
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── HomeTab.jsx         
    │   │   ├── FormTab.jsx    
    │   │   ├── DashboardTab.jsx     
    │   │   ├── HistoryTab.jsx       
    │   │   ├── LoginTab.jsx         
    │   │   └── RegisterTab.jsx      
    │   ├── services/
    │   │   └── api.js 
    |   ├── firebase
    |   ├── Context              
    │   ├── supabaseClient.js       
    │   ├── App.jsx                  
    │   └── App.css                  
    ├── .env                         
    ├── package.json                
    └── vite.config.js      
```

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js 18, Vite, Modern CSS (Dark/Light Mode), Lucide Icons |
| **Backend API** | Python 3.10+, Flask, Flask-Blueprints, Flask-CORS |
| **Machine Learning** | XGBoost, Scikit-Learn, Pandas, NumPy, Joblib |
| **Database & ORM** | PostgreSQL, Flask-SQLAlchemy, Psycopg2 |
| **Authentication** | Supabase Auth, PyJWT |
| **External APIs** | OpenWeatherMap API, Sarvam AI Translate API (`sarvam-translate:v1`) |

---

