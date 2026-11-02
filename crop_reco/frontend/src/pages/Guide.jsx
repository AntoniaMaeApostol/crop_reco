import { Link } from "react-router-dom";
import "../style/Page.css";
import "../style/Guide.css";

const STEPS = [
  {
    title: "Gather your details",
    text: "Prepare your soil test results and your area's average weather.",
  },
  {
    title: "Fill in the form",
    text: "Enter your values on the Predict page using the sliders or number boxes.",
  },
  {
    title: "Get your result",
    text: "See the recommended crop, SIBOL's confidence, and commonly used fertilizers.",
  },
  {
    title: "Plan your planting",
    text: "Use the result as a starting point. For larger plantings, it helps to check with your local agriculture office.",
  },
];

const INPUTS = [
  {
    name: "Nitrogen (N)",
    text: "Helps leaves grow. Found in a soil test, measured in kg/ha.",
  },
  {
    name: "Phosphorus (P)",
    text: "Supports roots and flowering. Found in a soil test, measured in kg/ha.",
  },
  {
    name: "Potassium (K)",
    text: "Improves overall plant health. Found in a soil test, measured in kg/ha.",
  },
  {
    name: "Soil pH",
    text: "How acidic or alkaline the soil is. 7 is neutral.",
  },
  {
    name: "Temperature",
    text: "Average temperature of your area, in °C.",
  },
  {
    name: "Humidity",
    text: "Average moisture in the air, as a percentage.",
  },
  {
    name: "Rainfall",
    text: "Average rainfall per month, in mm.",
  },
];

const TIPS = [
  "Collect soil from several spots and mix it into one sample, so it represents your whole area. Skip fertilizer spills and compost piles.",
  "Sample your soil before adding any lime, fertilizer or manure.",
  "Test your soil before planting, not while a crop is growing, so you have time to act on the results. Don't sample soaking-wet soil.",
  "Use long-term average weather for your area (a whole season or more), not just today's weather.",
  "Retest every 2–3 years (every 1–2 years for vegetable gardens), around the same time of year.",
];

const FAQ = [
  {
    q: "Is SIBOL only for farmers?",
    a: "No. SIBOL is made especially for farmers, but anyone can use it, including people who want to try planting at home, start a mini garden, or plan a farming business.",
  },
  {
    q: "I don't know my NPK values. What can I do?",
    a: "Ask your local agriculture office for a soil test, or use a home soil test kit. Until then you can try the sample data to see how the app works.",
  },
  {
    q: "How accurate is the recommendation?",
    a: "SIBOL gives a confidence score with every result. It is a helpful guide, but real conditions on your land can differ.",
  },
  {
    q: "Which crops does SIBOL support?",
    a: "It supports 22 crops, including rice, maize, banana, mango, coconut and coffee. See the full list on the About page.",
  },
  {
    q: "Where do I find my area's weather data?",
    a: "Your local weather bureau or agriculture office publishes monthly averages for temperature, humidity and rainfall.",
  },
];

export default function Guide() {
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
        <span className="page__eyebrow">Guide</span>
        <h1>How To Use SIBOL</h1>
        <p>
          A quick walkthrough to help you get the most out of SIBOL.
        </p>
      </header>

      <section className="page__section">
        <h2>Getting started</h2>
        <div className="page-grid page-grid--4">
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
        <h2>What each input means</h2>
        <div className="page-grid page-grid--4">
          {INPUTS.map((i) => (
            <div className="page-card" key={i.name}>
              <h3>{i.name}</h3>
              <p>{i.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page__section">
        <h2>Tips for better results</h2>
        <ul className="guide__tips">
          {TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="page__section">
        <h2>Frequently asked questions</h2>
        <div className="guide__faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="page__section">
        <div className="page__cta">
          <div>
            <h2>Ready to try it?</h2>
            <p>Have your numbers handy and get your result in seconds.</p>
          </div>
          <Link to="/predict" className="btn-pill">
            Predict Crop
          </Link>
        </div>
      </section>
    </div>
  );
}