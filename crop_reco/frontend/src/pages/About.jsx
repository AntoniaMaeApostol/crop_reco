import { Link } from "react-router-dom";
import "../style/Page.css";
import "../style/About.css";

const STEPS = [
  {
    title: "Enter your data",
    text: "Provide your soil nutrients, pH, temperature, humidity and rainfall.",
  },
  {
    title: "SIBOL analyzes it",
    text: "SIBOL finds the crop that best matches your land.",
  },
  {
    title: "Get your results",
    text: "Receive the most suitable crop for your land.",
  },
];

const STATS = [
  { value: "22", label: "Crops supported" },
  { value: "7", label: "Input factors" },
  { value: "10", label: "Fertilizer types" },
];

const CROPS = [
  "Rice",
  "Maize",
  "Chickpea",
  "Kidney beans",
  "Pigeon peas",
  "Moth beans",
  "Mung bean",
  "Black gram",
  "Lentil",
  "Pomegranate",
  "Banana",
  "Mango",
  "Grapes",
  "Watermelon",
  "Muskmelon",
  "Apple",
  "Orange",
  "Papaya",
  "Coconut",
  "Cotton",
  "Jute",
  "Coffee",
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
        <span className="page__eyebrow">About</span>
        <h1>Meet SIBOL</h1>
        <p>
          We help you decide what to plant by turning your soil and climate details into a clear recommendation.
        </p>
      </header>

      <section className="page__section">
        <h2>Our mission</h2>
        <p className="page__lead">
          Picking the wrong crop can cost time, money and effort. SIBOL helps
          you decide what to plant by matching your soil and climate conditions
          to the crops most likely to do well. It’s made especially for farmers,
          and it works just as well for anyone starting a home garden or
          planning a farming business.
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
            <span className="about__chip" key={c}>
              {c}
            </span>
          ))}
        </div>
        <p className="about__note">
          Recommendations are a guide, not a guarantee. Please confirm with your
          local agriculture office before making major planting or business
          decisions.
        </p>
      </section>

      <section className="page__section">
        <div className="page__cta">
          <div>
            <h2>Ready to find your crop?</h2>
            <p>It only takes a minute.</p>
          </div>
          <Link to="/predict" className="btn-pill">
            Predict Crop
          </Link>
        </div>
      </section>
    </div>
  );
}
