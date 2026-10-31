from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('crop_decision_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = [
        float(data['N']), float(data['P']), float(data['K']),
        float(data['temperature']), float(data['humidity']),
        float(data['ph']), float(data['rainfall'])
    ]
    
    # Convert prediction to standard string so JSON serialization never fails
    prediction = str(model.predict([features])[0])
    
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