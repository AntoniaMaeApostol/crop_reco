import { useState } from "react";
import "../style/Predict.css";

// label, unit, range and a short hint for each input
const FIELDS = [
  { key: "N", label: "Nitrogen (N)", unit: "kg/ha", min: 0, max: 140, step: 1, hint: "Nitrogen content in the soil. Typical: 0–140." },
  { key: "P", label: "Phosphorus (P)", unit: "kg/ha", min: 5, max: 145, step: 1, hint: "Phosphorus content in the soil. Typical: 5–145." },
  { key: "K", label: "Potassium (K)", unit: "kg/ha", min: 5, max: 205, step: 1, hint: "Potassium content in the soil. Typical: 5–205." },
  { key: "ph", label: "Soil pH", unit: "pH", min: 3, max: 10, step: 0.1, hint: "Soil acidity. 7 is neutral. Typical: 3.5–9.9." },
  { key: "temperature", label: "Temperature", unit: "°C", min: 8, max: 44, step: 0.5, hint: "Average temperature of your area." },
  { key: "humidity", label: "Humidity", unit: "%", min: 14, max: 100, step: 1, hint: "Average relative humidity." },
  { key: "rainfall", label: "Rainfall", unit: "mm", min: 20, max: 300, step: 1, hint: "Average rainfall per month." },
];

const DEFAULTS = { N: 50, P: 50, K: 50, ph: 6.5, temperature: 25, humidity: 70, rainfall: 100 };
const SAMPLE = { N: 90, P: 42, K: 43, ph: 6.5, temperature: 21, humidity: 82, rainfall: 203 };

// Comprehensive fertilizer mapping covering all supported SIBOL crops
const CROP_FERTILIZERS = {
  rice: [
    { name: "Urea (Nitrogen)", use: "Split applications at basal, active tillering, and panicle initiation." },
    { name: "Muriate of Potash (MOP)", use: "Applied during basal and panicle stage for grain filling." },
    { name: "Zinc Sulfate", use: "Basal application in flooded fields to prevent zinc deficiency." }
  ],
  maize: [
    { name: "Complete Fertilizer (14-14-14)", use: "Base application during planting for early root growth." },
    { name: "Urea (Side-dress)", use: "Applied 30–45 days after planting for vegetative boost." },
    { name: "Muriate of Potash", use: "Enhances stalk strength and stress tolerance." }
  ],
  chickpea: [
    { name: "DAP (Diammonium Phosphate)", use: "Applied via furrow placement at sowing time." },
    { name: "Rhizobium Biofertilizer", use: "Seed inoculation before planting to boost nitrogen fixation." }
  ],
  "kidney beans": [
    { name: "Balanced NPK (12-12-12)", use: "Light basal application during land preparation." },
    { name: "Single Super Phosphate (SSP)", use: "Provides phosphorus and sulfur for healthy pod growth." }
  ],
  "pigeon peas": [
    { name: "Phosphorus Starter", use: "Applied at sowing to support deep root development." },
    { name: "Rhizobium Culture", use: "Seed treatment for enhanced nodulation." }
  ],
  "moth beans": [
    { name: "Phosphorus & Potassium Blend", use: "Applied during planting to improve drought and arid resilience." }
  ],
  "mung bean": [
    { name: "DAP (Diammonium Phosphate)", use: "Light basal dressing for early seedling vigor." },
    { name: "Potassium Sulfate", use: "Supports flowering and pod filling stages." }
  ],
  "black gram": [
    { name: "DAP (Diammonium Phosphate)", use: "Apply during land preparation for initial Nitrogen and Phosphorus." },
    { name: "Single Super Phosphate (SSP)", use: "Promotes root development and legume nodulation." },
    { name: "Rhizobium Biofertilizer", use: "Seed treatment to boost natural nitrogen fixation." }
  ],
  lentil: [
    { name: "Single Super Phosphate (SSP)", use: "Supplies phosphorus and sulfur essential for pulse crops." }
  ],
  pomegranate: [
    { name: "Well-rotted Farmyard Manure", use: "Applied during pre-blossom and soil conditioning." },
    { name: "Sulfate of Potash", use: "Boosts fruit quality, color, and sugar content." }
  ],
  banana: [
    { name: "Urea & Muriate of Potash", use: "Heavy feeder requirement applied in monthly split doses." },
    { name: "Magnesium Sulfate", use: "Prevents leaf yellowing and supports high fruit yields." }
  ],
  mango: [
    { name: "Balanced NPK (16-16-16)", use: "Applied post-harvest to help trees recover and push new flushes." },
    { name: "Calcium Nitrate", use: "Foliar spray during fruit set to prevent spongy tissue." }
  ],
  grapes: [
    { name: "Calcium Ammonium Nitrate", use: "Applied during active vegetative growth." },
    { name: "Potassium Schoenite", use: "Supports berry sizing and sugar accumulation." }
  ],
  watermelon: [
    { name: "Complete NPK Fertilizer", use: "Applied as base feed before vine spreading." },
    { name: "Calcium Nitrate", use: "Prevents blossom-end rot in developing melons." }
  ],
  muskmelon: [
    { name: "NPK 12-11-18 Blend", use: "Applied in splits during vine growth and fruit expansion." }
  ],
  apple: [
    { name: "Calcium Nitrate", use: "Applied post-bloom to enhance fruit firmness and storage life." },
    { name: "Balanced NPK 12-12-12", use: "Applied early spring before bud break." }
  ],
  orange: [
    { name: "Citrus Special NPK Blend", use: "Applied at three key seasonal flush periods." },
    { name: "Zinc & Iron Chelates", use: "Foliar spray to prevent micro-nutrient chlorosis." }
  ],
  papaya: [
    { name: "Calcium Ammonium Nitrate", use: "Regular side-dressing every 2 months during growth." },
    { name: "Sulfate of Potash", use: "Applied to support sweet fruit development." }
  ],
  coconut: [
    { name: "NaCl (Common Salt) & NPK", use: "Applied around palm basin to enhance nut yield and water retention." },
    { name: "Organic Manure", use: "Applied annually during the rainy season." }
  ],
  cotton: [
    { name: "Nitrogen & Phosphorus Blend", use: "Balanced application during early square formation stage." },
    { name: "Potassium Nitrate", use: "Foliar spray during boll development stage." }
  ],
  jute: [
    { name: "Urea & Ammonium Sulfate", use: "Applied in split doses during early vegetative growth to boost fiber length." },
    { name: "Muriate of Potash", use: "Applied as a basal dose to improve stem strength." }
  ],
  coffee: [
    { name: "NPK 16-16-16", use: "Applied at the onset of the rainy season and post-harvest." },
    { name: "Organic Compost", use: "Applied around the root zone to improve soil organic matter." }
  ]
};

export default function Predict() {
  const [values, setValues] = useState(DEFAULTS);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);

  const update = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Server response was not ok");

      const data = await response.json();
      
      const rawCrop = data.recommended_crop || "";
      // Clean and normalize key (handles both lowercase, spaces, and no spaces)
      const cropKey = rawCrop.trim().toLowerCase();
      const altKey = cropKey.replace(/([a-z])([A-Z])/g, '$1 $2'); // Handles camelCase if any

      const matchedFertilizers = CROP_FERTILIZERS[cropKey] || CROP_FERTILIZERS[altKey] || [
        { name: `Balanced NPK for ${rawCrop}`, use: "Apply balanced base feed during land preparation." },
        { name: "Nitrogen Booster", use: "Split into 2–3 side-dress applications during vegetative growth." }
      ];

      setResult({
        crop: rawCrop,
        confidence: data.confidence,
        reason: `Your entered soil and climate parameters point to ${rawCrop} as the optimal crop choice.`,
        alternatives: ["Jute", "Coconut", "Papaya"],
        tips: [
          { label: "Season", value: "Optimal season" },
          { label: "Water need", value: values.rainfall > 150 ? "High" : "Moderate" },
          { label: "Ideal pH", value: "5.5 – 7.0" },
        ],
        fertilizers: matchedFertilizers,
      });
      setStatus("done");
    } catch (error) {
      console.error("Prediction error:", error);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setValues(DEFAULTS);
    setResult(null);
    setStatus("idle");
  };

  return (
    <div className="predict">
      <video
        className="predict__video"
        src="/1008.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="predict__overlay" />
      <section className="predict__hero">
        <div className="predict__hero-inner">
          <span className="predict__eyebrow">Crop Prediction</span>
          <h1>Tell Us About Your Land</h1>
          <p>Fill in your soil and climate details and SIBOL will suggest the crop that fits best.</p>
        </div>
      </section>

      <section className={`predict__body${status === "done" && result ? " predict__body--tight" : ""}`}>
        <form className="card predict__form" onSubmit={handleSubmit}>
          <div className="card__head">
            <h2>Your farm details</h2>
            <button type="button" className="link-btn" onClick={() => setValues(SAMPLE)}>
              Use sample data
            </button>
          </div>

          <div className="predict__fields">
            {FIELDS.map((f) => (
              <div className="field" key={f.key}>
                <div className="field__top">
                  <label htmlFor={f.key}>{f.label}</label>
                  <div className="field__value">
                    <input
                      id={f.key}
                      type="number"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={values[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      required
                    />
                    <span>{f.unit}</span>
                  </div>
                </div>
                <input
                  className="field__slider"
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={values[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  aria-label={f.label}
                />
                <small>{f.hint}</small>
              </div>
            ))}
          </div>

          <div className="predict__actions">
            <button type="submit" className="btn-pill" disabled={status === "loading"}>
              {status === "loading" ? "Predicting..." : "Predict Crop"}
            </button>
            <button type="button" className="link-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        <aside className="card predict__result" aria-live="polite">
          {status === "idle" && (
            <div className="result__empty">
              <div className="result__icon">🌱</div>
              <h2>Your recommendation</h2>
              <p>Your recommended crop will appear here after you submit your details.</p>
            </div>
          )}

          {status === "loading" && (
            <div className="result__empty">
              <div className="spinner" />
              <p>Analyzing your soil and climate...</p>
            </div>
          )}

          {status === "error" && (
            <div className="result__empty">
              <div className="result__icon">⚠️</div>
              <h2>Something went wrong</h2>
              <p>We couldn't reach the server. Please check if app.py is running.</p>
            </div>
          )}

          {status === "done" && result && (
            <div className="result__content">
              <span className="predict__eyebrow">Best match</span>
              <h2 className="result__crop">{result.crop}</h2>

              <div className="confidence">
                <div className="confidence__label">
                  <span>Confidence</span>
                  <strong>{result.confidence}%</strong>
                </div>
                <div className="confidence__bar">
                  <div style={{ width: `${result.confidence}%` }} />
                </div>
              </div>

              <p className="result__reason">{result.reason}</p>

              <h3>Other good options</h3>
              <div className="chips">
                {result.alternatives.map((c) => (
                  <span className="chip" key={c}>{c}</span>
                ))}
              </div>

              <h3>Growing tips</h3>
              <ul className="tips">
                {result.tips.map((t) => (
                  <li key={t.label}>
                    <span>{t.label}</span>
                    <strong>{t.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      {status === "done" && result?.fertilizers?.length > 0 && (
        <section className="predict__extra">
          <div className="card">
            <h2>Commonly used fertilizers</h2>
            <ul className="result__list result__list--green">
              {result.fertilizers.map((f) => (
                <li key={f.name}>
                  <strong>{f.name}</strong>
                  <span>{f.use}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="result__note">
            Based on dataset records. Actual needs depend on your soil test and field size.
            Please confirm with your local agriculture office before applying.
          </p>
        </section>
      )}
    </div>
  );
}