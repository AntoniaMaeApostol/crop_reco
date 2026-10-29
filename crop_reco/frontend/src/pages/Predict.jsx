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

export default function Predict() {
  const [values, setValues] = useState(DEFAULTS);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);

  const update = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    setTimeout(() => {
      setResult({
        crop: "Rice",
        confidence: 92,
        reason: "Your high humidity, heavy rainfall and nitrogen level suit rice well.",
        alternatives: ["Jute", "Coconut", "Papaya"],
        tips: [
          { label: "Season", value: "Wet season" },
          { label: "Water need", value: "High" },
          { label: "Ideal pH", value: "5.5 – 7.0" },
        ],
        fertilizers: [
          { name: "Complete fertilizer (14-14-14)", use: "Before or at planting, as the base feed." },
          { name: "Urea (nitrogen)", use: "Split into 2–3 applications during growth." },
          { name: "Muriate of potash (potassium)", use: "At the tillering stage, for stronger stems." },
        ],
      });
      setStatus("done");
    }, 1200);
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