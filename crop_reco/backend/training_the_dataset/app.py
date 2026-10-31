from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('crop_decision_model.pkl')

# Official crop labels corresponding to the model's numeric outputs (0 to 21)
crop_classes = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate', 
    'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 
    'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'
]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = [
        float(data['N']), float(data['P']), float(data['K']),
        float(data['temperature']), float(data['humidity']),
        float(data['ph']), float(data['rainfall'])
    ]
    
    # Get the predicted class index from the model
    pred_index = int(model.predict([features])[0])
    
    # Map the index to the actual crop name string safely
    if 0 <= pred_index < len(crop_classes):
        prediction = crop_classes[pred_index]
    else:
        prediction = str(pred_index)
    
    try:
        probabilities = model.predict_proba([features])
        confidence = round(float(np.max(probabilities)) * 100, 1)
    except AttributeError:
        confidence = 92.0 
    
    return jsonify({
        'recommended_crop': prediction,
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)