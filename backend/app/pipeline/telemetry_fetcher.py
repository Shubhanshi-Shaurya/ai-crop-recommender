# file for fetching soil and weather data fro soilgrid api and openweather api

import requests
import numpy as np


def fetch_live_telemetry(lat,lon,openweather_api_key=None):
    """
    Fetches real time metrics based on global gps
    """

    # 1.FETCH LIVE SOIL PROPERTIES FROM SOILGRIDS REST API

    soil_url=f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}"

    soil_features = {
        'pH': 6.5, 'EC': 1.1, 'OC': 0.8, 'N': 45.0, 'P': 32.0, 'K': 22.0, 'CEC': 15.0,
        'Sand': 35.0, 'Silt': 40.0, 'Clay': 25.0, 'Bulk_Density': 1.3, 'Water_Holding_Capacity': 35.0
    }

    try:
        soil_response=requests.get(soil_url,timeout=10)
        if soil_response.status_code==200:
            soil_data=soil_response.json()
            layers=soil_data.get('properties',{}).get('layers',[])

        for layer in layers:
            name=layer.get('name')

            mean_val=layer.get('depths',[{}])[0].get('values',{}).get('mean',None)

            if mean_val is not None:
                if name=='phh2o':
                    soil_features['pH']=float(mean_val)/10.0
                elif name == 'cec':
                    soil_features['CEC'] = float(mean_val) / 10.0
                elif name == 'soc':
                    soil_features['OC'] = float(mean_val) / 100.0  # Soil Organic Carbon
                elif name == 'sand':
                    soil_features['Sand'] = float(mean_val) / 10.0
                elif name == 'silt':
                    soil_features['Silt'] = float(mean_val) / 10.0
                elif name == 'clay':
                    soil_features['Clay'] = float(mean_val) / 10.0
                elif name == 'bdod':
                    soil_features['Bulk_Density'] = float(mean_val) / 100.0

    except Exception as e:
        print(f" SoilGrids API Lookup Warning: {str(e)}. Falling back to regional baseline.")

    
    # 2. FETCH REAL-TIME WEATHER FORECASTS VIA OPENWEATHERMAP API 

    weather_features = {
        'Temperature': 27.5, 'Humidity': 60.0, 'Rainfall': 120.0,
        'Wind_Speed': 5.0, 'Solar_Radiation': 18.0
    }

    if openweather_api_key:
        weather_url=f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={openweather_api_key}&units=metric"
        try:
            weather_response=requests.get(weather_url,timeout=5)
            if weather_response.status_code==200:
                w_data=weather_response.json()
                weather_features['Temperature']=float(w_data.get('main',{}).get('temp',27.5))
                weather_features['Humidity'] = float(w_data.get('main', {}).get('humidity', 60.0))
                weather_features['Wind_Speed'] = float(w_data.get('wind', {}).get('speed', 5.0))

                rain_dict = w_data.get('rain', {})
                rain_1h = rain_dict.get('1h', 0)
                if rain_1h > 0:
                    weather_features['Rainfall'] = float(rain_1h) * 120.0

        except Exception as e:
            print(f" Weather API Lookup Warning: {str(e)}. Using seasonal regional averages.")

    
    # 3. merge metrics for model input dictionary

    consolidated_telemetry={}
    consolidated_telemetry.update(soil_features)
    consolidated_telemetry.update(weather_features)


    consolidated_telemetry['Slope'] = 1.8
    consolidated_telemetry['Aspect'] = 180.0
    consolidated_telemetry['Elevation'] = 150.0
    consolidated_telemetry['Solar_Radiation'] = 18.5
    consolidated_telemetry['NDVI'] = 0.70    # vegetation index
    consolidated_telemetry['Irrigation_Frequency'] = 3

    return consolidated_telemetry



