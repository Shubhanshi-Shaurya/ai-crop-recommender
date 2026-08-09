# main route file 

from flask import Flask, request, jsonify,Blueprint
from flask_cors import CORS
import joblib
import json
import pandas as pd
import numpy as np
from dotenv import load_dotenv
import os
import xgboost as xgb
import requests
import jwt
from functools import wraps
from . import db

# importing components 
from app.pipeline.telemetry_fetcher import fetch_live_telemetry
from app.pipeline.market_scraper import scrape_live_market_prices
from app.models import RecommendationLog

load_dotenv()

# getting api from .env file
OPENWEATHER_KEY=os.getenv("OPENWEATHER_API_KEY")
SARVAM_API_KEY=os.getenv("SARVAM_API_KEY")
# SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET')

#app engine blueprint 
app = Blueprint('main_routes', __name__)


# loading trained models 
MODEL = xgb.XGBRegressor()
MODEL.load_model("app/models/model_xgboost.json")
SCALER = joblib.load("app/models/yield_scaler.pkl")


# JWT 
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'status': 'error', 'message': 'Authorization token is required.'}), 401

        # try:
            # payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=['HS256'], audience='authenticated')
            # user_id = payload.get('sub')
            # user_email = payload.get('email')
        # except Exception as e:
            return jsonify({'status': 'error', 'message': f'Invalid token: {str(e)}'}), 401

        # return f(user_id, user_email, *args, **kwargs)
    return decorated

#database testing route
@app.route('/api/db-test', methods=['GET'])
def db_test():
    try:
        result = db.session.execute(db.text('SELECT current_database(), current_user;')).fetchone()
        return jsonify({
            'status': 'success',
            'message': 'Connected to PostgreSQL!',
            'database': result[0],
            'user': result[1]
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


with open("app/models/feature_layout.json", "r") as f:
    FEATURE_COLUMNS = json.load(f)

CROP_MARKET_DATABASE = {
    'Rice':   {'market_price_per_ton': 35000, 'production_cost_per_acre': 15000, 'water_depletion_index': 0.9},
    'Wheat':  {'market_price_per_ton': 28000, 'production_cost_per_acre': 11000, 'water_depletion_index': 0.5},
    'Maize':  {'market_price_per_ton': 22000, 'production_cost_per_acre': 8000,  'water_depletion_index': 0.4},
    'Cotton': {'market_price_per_ton': 62000, 'production_cost_per_acre': 25000, 'water_depletion_index': 0.7}
}

# language translation route 
@app.route('/api/translate', methods=['POST'])
def proxy_translate():
    try:
        data = request.json or {}
        text_to_translate = data.get('text')
        target_lang = data.get('target_lang')

        if not text_to_translate or not target_lang or target_lang == 'en-IN':
            return jsonify({'translated_text': text_to_translate})

        if not SARVAM_API_KEY:
            return jsonify({'translated_text': text_to_translate})

        endpoint = "https://api.sarvam.ai/translate"
        headers = {
            "Content-Type": "application/json",
            "api-subscription-key": SARVAM_API_KEY
        }
        payload = {
            "input": text_to_translate,
            "source_language_code": "en-IN",
            "target_language_code": target_lang,
            "model": "sarvam-translate:v1"
        }

        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=2.0)
            
            if response.status_code == 200:
                result = response.json()
                return jsonify({'translated_text': result.get('translated_text', text_to_translate)})
            else:
    
                print(f"⚠️ Sarvam Gateway returned code {response.status_code}. Using baseline text fallback.")
                return jsonify({'translated_text': text_to_translate})
                
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Sarvam connection timed out or failed: {str(e)}")
            return jsonify({'translated_text': text_to_translate})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# route for crop recommender pipeline
@app.route('/api/recommend-crops', methods=['POST'])
def recommend_crops():
    try:
        user_inputs = request.json 
        selected_soil = user_inputs.get('soil_type') 
        past_crop = user_inputs.get('past_crop')

        lat=user_inputs.get('latitude')
        lng=user_inputs.get('longitude')

        if not lat or not lng:
            return jsonify({'status':'error','message':'GPS Coordinates are required'})
        
        telemetry_metrics=fetch_live_telemetry(lat,lng,OPENWEATHER_KEY)

        all_live_crops=scrape_live_market_prices()

        all_crop_projections = []

        for crop_name,live_market_price in all_live_crops.items():
            input_row = {col: 0 for col in FEATURE_COLUMNS}
            for feature_key, val in telemetry_metrics.items():
                if feature_key in input_row:
                    input_row[feature_key] = val

            if f"Soil_Type_{selected_soil}" in input_row:
                input_row[f"Soil_Type_{selected_soil}"] = 1
            if f"Crop_Type_{crop_name}" in input_row:
                input_row[f"Crop_Type_{crop_name}"] = 1

            ml_mapping_crop="Wheat"

            if f"Crop_type_{crop_name}" in input_row:
                ml_mapping_crop=crop_name
            else:
                if crop_name in ['Barley','Oats']:
                    ml_mapping_crop="Wheat"
                elif crop_name in ['Chickpeas', 'Lentils', 'Soybeans', 'Mustard']:
                    ml_mapping_crop = "Maize"
                elif crop_name in ['Sugarcane']:
                    ml_mapping_crop = "Cotton"

            input_row[f"Crop_type_{ml_mapping_crop}"]=1
            
            # scaling and predicting yield 
            df_input = pd.DataFrame([input_row])[FEATURE_COLUMNS]
            scaled_features = SCALER.transform(df_input)
            predicted_yield = float(MODEL.predict(scaled_features)[0])
            predicted_yield = max(0.1, np.round(predicted_yield, 2))

            base_cost=12000
            water_index=0.5

            if crop_name in ['Rice', 'Sugarcane']:
                base_cost, water_index = 28000, 0.9
            elif crop_name in ['Chickpeas', 'Lentils', 'Mustard']:
                base_cost, water_index = 9000, 0.3

            # computing market values
            gross_revenue = predicted_yield * live_market_price
            net_profit = gross_revenue - base_cost
            profit_margin_pct = (net_profit / gross_revenue) * 100 if gross_revenue > 0 else 0

            # localized sustainibility scores
            base_sustainability = 80

            if crop_name == past_crop:
                base_sustainability -= 25 
            else:
                base_sustainability += 10 

            if water_index>0.6 and telemetry_metrics['Rainfall']<100:
                base_sustainability-=20

            sustainability_score = int(np.clip(base_sustainability, 10, 100))
            
            all_crop_projections.append({
                'crop': crop_name,
                'predicted_yield_tons_per_acre': predicted_yield,
                'estimated_profit_inr': int(max(0, net_profit)),
                'profit_margin_percentage': int(np.round(profit_margin_pct, 1)),
                'sustainability_score': sustainability_score,
                'suitability_index': (net_profit * 0.6) + (sustainability_score * 500)
            })

        ranked_crops = sorted(all_crop_projections, key=lambda x: x['suitability_index'], reverse=True)

        for item in ranked_crops:
            item.pop('suitability_index', None)

        best_crop = ranked_crops[0]['crop']

        # sending data to postgres
        try:
            log_entry = RecommendationLog(
                user_id=user_inputs.get('user_id'),
                user_email=user_inputs.get('user_email'),
                latitude=float(lat),
                longitude=float(lng),
                soil_type=str(selected_soil),
                past_crop=str(past_crop),
                recommended_crop=best_crop
            )
            db.session.add(log_entry)
            db.session.commit()
            print(" SUCCESS: Saved query inputs to PostgreSQL!", flush=True)
        except Exception as db_err:
            db.session.rollback()
            print(f"⚠️ Failed to save query to DB: {db_err}", flush=True)

        return jsonify({
            'status': 'success',
            'most_appropriate_crop': best_crop,
            'all_crop_rankings': ranked_crops
        }),200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400
    

# route to fetch user past history
@app.route('/api/history', methods=['GET'])
def get_user_history():
    try:
        logs = RecommendationLog.query.order_by(RecommendationLog.created_at.desc()).limit(20).all()
        return jsonify({
            'status': 'success',
            'history': [log.to_dict() for log in logs]
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

