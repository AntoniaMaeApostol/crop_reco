import { Link } from "react-router-dom";
import "../style/Page.css";
import "../style/About.css";

const STEPS = [
  { title: "Enter your data", text: "Provide your soil nutrients, pH, temperature, humidity and rainfall." },
  { title: "SIBOL analyzes it", text: "A machine learning model compares your land against patterns learned from real crop data." },
  { title: "Get your crop", text: "Receive the most suitable crop for your farm, plus other good options." },
];

const STATS = [
  { value: "22", label: "Crops supported" },
  { value: "7", label: "Input factors" },
  { value: "<5s", label: "To get a result" },
];

const CROPS = [
  "Rice", "Maize", "Chickpea", "Kidney beans", "Pigeon peas", "Moth beans", "Mung bean", "Black gram",
  "Lentil", "Pomegranate", "Banana", "Mango", "Grapes", "Watermelon", "Muskmelon", "Apple",
  "Orange", "Papaya", "Coconut", "Cotton", "Jute", "Coffee",
];

const TEAM = [
  { name: "Antonia Mae G. Apostol", role: "Designer" },
  { name: "Irene Jade V. Chatto", role: "Back-end & Model Developer" },
  { name: "Leanna Faye J. Ensomo", role: "Fertilizer Data Specialist" },
];

export default function About() {
  return (
    <div className="page">
      <video
        className="page__video"
        src="/1008.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="page__overlay" />

      <header className="page__hero">
        <span className="page__eyebrow">About SIBOL</span>
        <h1>Helping Farmers Grow Smarter</h1>
        <p>SIBOL turns your soil and climate data into a clear crop recommendation.</p>
      </header>

      <section className="page__section">
        <h2>Our mission</h2>
        <p className="page__lead">
          Choosing the wrong crop can cost a farmer a whole season. SIBOL was built to make that
          decision easier by matching your land's conditions with the crops most likely to thrive,
          so every planting starts with better information.
        </p>
      </section>

      <section className="page__section">
        <h2>How it works</h2>
        <div className="page-grid page-grid--3">
          {STEPS.map((s, i) => (
            <div className="page-card" key={s.title}>
              <span className="page__num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page__section">
        <div className="about__stats">
          {STATS.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page__section">
        <h2>Supported crops</h2>
        <div className="about__chips">
          {CROPS.map((c) => (
            <span className="about__chip" key={c}>{c}</span>
          ))}
        </div>
      </section>

      <section className="page__section">
        <h2>The team</h2>
        <div className="page-grid page-grid--3">
          {TEAM.map((m, i) => (
            <div className="page-card" key={i}>
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </div>
          ))}
        </div>
        <p className="about__note">
          Recommendations are a guide, not a guarantee. Please confirm with your local agricultural
          office before making major planting decisions.
        </p>
      </section>

      <section className="page__section">
        <div className="page__cta">
          <div>
            <h2>Ready to find your crop?</h2>
            <p>It only takes a minute.</p>
          </div>
          <Link to="/predict" className="btn-pill">Predict Crop</Link>
        </div>
      </section>
    </div>
  );
}