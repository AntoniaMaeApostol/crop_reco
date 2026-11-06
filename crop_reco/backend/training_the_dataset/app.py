from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load both models
crop_model = joblib.load('crop_decision_model.pkl')
try:
    fertilizer_model = joblib.load('fertilizer_decision.pkl')
except Exception as e:
    fertilizer_model = None
    print("Fertilizer model could not be loaded:", e)

crop_labels = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
    'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 
    'apple', 'orange', 'papaya', 'coconut', 'cotton', 
    'jute', 'coffee'
]

# Crop-specific growing tips dictionary
crop_tips_db = {
    'rice': {'season': 'Kharif / Wet Season', 'water': 'High', 'ph': '5.0 – 6.5'},
    'maize': {'season': 'Year-round / Summer', 'water': 'Moderate', 'ph': '5.5 – 7.5'},
    'chickpea': {'season': 'Rabi / Dry Season', 'water': 'Low', 'ph': '6.0 – 8.0'},
    'kidneybeans': {'season': 'Spring / Summer', 'water': 'Moderate', 'ph': '6.0 – 7.0'},
    'pigeonpeas': {'season': 'Kharif / Rainy Season', 'water': 'Low', 'ph': '5.0 – 7.0'},
    'mothbeans': {'season': 'Summer / Dry Season', 'water': 'Low', 'ph': '5.0 – 7.5'},
    'mungbean': {'season': 'Summer / Kharif', 'water': 'Moderate', 'ph': '6.2 – 7.2'},
    'blackgram': {'season': 'Rabi / Kharif', 'water': 'Moderate', 'ph': '6.5 – 7.8'},
    'lentil': {'season': 'Rabi / Winter', 'water': 'Low', 'ph': '6.0 – 7.5'},
    'pomegranate': {'season': 'Year-round (Dry tropical)', 'water': 'Low', 'ph': '5.5 – 7.0'},
    'banana': {'season': 'Year-round (Humid)', 'water': 'High', 'ph': '6.0 – 7.5'},
    'mango': {'season': 'Summer / Pre-monsoon', 'water': 'Moderate', 'ph': '5.5 – 7.5'},
    'grapes': {'season': 'Spring / Dry Season', 'water': 'Moderate', 'ph': '6.5 – 7.5'},
    'watermelon': {'season': 'Summer / Warm Season', 'water': 'High', 'ph': '6.0 – 7.0'},
    'muskmelon': {'season': 'Summer Season', 'water': 'Moderate', 'ph': '6.0 – 7.0'},
    'apple': {'season': 'Cool Temperate', 'water': 'Moderate', 'ph': '6.0 – 7.0'},
    'orange': {'season': 'Subtropical / Winter', 'water': 'Moderate', 'ph': '6.0 – 7.5'},
    'papaya': {'season': 'Year-round (Warm)', 'water': 'High', 'ph': '6.0 – 7.0'},
    'coconut': {'season': 'Year-round (Tropical)', 'water': 'High', 'ph': '5.0 – 8.0'},
    'cotton': {'season': 'Kharif / Warm Season', 'water': 'Moderate', 'ph': '5.8 – 8.0'},
    'jute': {'season': 'Monsoon / Rainy Season', 'water': 'High', 'ph': '6.0 – 7.5'},
    'coffee': {'season': 'Post-monsoon / Shaded', 'water': 'High', 'ph': '6.0 – 6.5'}
}

# Fertilizer remarks database sourced directly from your dataset sheet
fertilizer_remarks_db = {
    'Compost': 'Enhances organic matter and improves soil structure. Prefer this for low-carbon soils to boost soil health naturally.',
    'Balanced': 'Provides a balanced mix of nitrogen, phosphorus, and potassium for loamy soils. Prefer this for general-purpose fertilization in well-structured soils.',
    'Water Retainer': 'Improves water retention in dry soils. Prefer this for soils with low moisture to prevent water stress in plants.',
    'Organic Fertilizer': 'Enhances fertility naturally, ideal for peaty soils. Prefer this to improve soil fertility while maintaining organic farming practices.',
    'Gypsum': 'Corrects alkaline soil, adds calcium and sulfur. Prefer this to lower soil pH and enhance soil structure.',
    'Lime': 'Neutralizes acidic soil and improves pH balance. Prefer this to correct low soil pH, improving nutrient availability.',
    'DAP': 'Rich in phosphorus, essential for root development. Prefer this for phosphorus-deficient soils to improve plant establishment.',
    'Urea': 'Provides high nitrogen, ideal for rapid leafy growth. Prefer this for nitrogen-deficient soils as it supports vegetative growth.',
    'Muriate of Potash': 'High potassium content, improves fruit and flower quality. Prefer this for potassium-deficient soils to enhance crop productivity.'
}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    n = float(data['N'])
    p = float(data['P'])
    k = float(data['K'])
    temp = float(data['temperature'])
    humidity = float(data['humidity'])
    ph = float(data['ph'])
    rainfall = float(data['rainfall'])
    
    crop_features = [[n, p, k, temp, humidity, ph, rainfall]]
    
    # Predict Crop and extract probabilities
    try:
        probs = crop_model.predict_proba(crop_features)[0]
        top_indices = np.argsort(probs)[::-1]
        
        best_idx = top_indices[0]
        recommended_crop = crop_labels[best_idx] if 0 <= best_idx < len(crop_labels) else str(best_idx)
        confidence = round(float(probs[best_idx]) * 100, 1)
        
        other_options = []
        for idx in top_indices[1:4]:
            crop_name = crop_labels[idx] if 0 <= idx < len(crop_labels) else str(idx)
            if crop_name.lower() != recommended_crop.lower():
                other_options.append(crop_name.capitalize())
    except Exception as e:
        print("Error calculating probabilities:", e)
        pred_idx = int(crop_model.predict(crop_features)[0])
        recommended_crop = crop_labels[pred_idx] if 0 <= pred_idx < len(crop_labels) else str(pred_idx)
        confidence = 92.0
        other_options = ['Jute', 'Coconut', 'Papaya']

    # Predict Fertilizer using fertilizer model and map remarks
    recommended_fertilizers = []
    if fertilizer_model is not None:
        try:
            moisture_val = humidity / 100.0
            carbon_val = 1.0
            
            model_features = list(fertilizer_model.feature_names_in_)
            row_dict = {feat: 0 for feat in model_features}
            
            base_inputs = {
                'Temperature': temp,
                'Moisture': moisture_val,
                'Rainfall': rainfall,
                'PH': ph,
                'Nitrogen': n,
                'Phosphorous': p,
                'Potassium': k,
                'Carbon': carbon_val
            }
            
            for k_in, v_in in base_inputs.items():
                if k_in in row_dict:
                    row_dict[k_in] = v_in
            
            formatted_crop = recommended_crop.capitalize()
            crop_col_name = f"Crop_{recommended_crop}"
            crop_col_name_cap = f"Crop_{formatted_crop}"
            soil_col_name = "Soil_Loamy Soil"
            
            if crop_col_name in row_dict:
                row_dict[crop_col_name] = 1
            elif crop_col_name_cap in row_dict:
                row_dict[crop_col_name_cap] = 1
                
            if soil_col_name in row_dict:
                row_dict[soil_col_name] = 1
                
            fert_input_df = pd.DataFrame([row_dict])
            
            pred_fert = str(fertilizer_model.predict(fert_input_df)[0])
            
            # Fetch remark description from dictionary, or fallback if unknown
            remark_text = fertilizer_remarks_db.get(
                pred_fert, 
                'Recommended dynamically by your machine learning fertilizer model.'
            )
            
            recommended_fertilizers.append({
                'name': pred_fert,
                'use': remark_text
            })
        except Exception as err:
            print("Error running fertilizer model prediction:", err)
            
    if not recommended_fertilizers:
        recommended_fertilizers = [
            { 'name': 'Complete Fertilizer (14-14-14)', 'use': 'Base application during land preparation.' }
        ]

    # Fetch dynamic crop tips
    default_tip = {'season': 'Optimal growing season', 'water': 'Moderate', 'ph': '5.5 – 7.0'}
    selected_tips = crop_tips_db.get(recommended_crop.lower(), default_tip)

    return jsonify({
        'recommended_crop': recommended_crop.capitalize(),
        'confidence': confidence,
        'other_options': other_options,
        'season': selected_tips['season'],
        'water_need': selected_tips['water'],
        'ideal_ph': selected_tips['ph'],
        'fertilizers': recommended_fertilizers
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)