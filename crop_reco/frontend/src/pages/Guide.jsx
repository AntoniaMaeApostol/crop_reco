import { Link } from "react-router-dom";
import "../style/Page.css";
import "../style/Guide.css";

const STEPS = [
  { title: "Collect your data", text: "Get your soil test results and your area's average weather." },
  { title: "Enter your values", text: "Fill in each field on the Predict page, using the sliders or the number boxes." },
  { title: "Read the result", text: "See your best crop, how confident SIBOL is, and other good options." },
  { title: "Plan your planting", text: "Use the growing tips, then confirm with your local agriculture office." },
];

const INPUTS = [
  { name: "Nitrogen (N)", range: "0 – 140 kg/ha", text: "Helps leaves grow. Found in a soil test." },
  { name: "Phosphorus (P)", range: "5 – 145 kg/ha", text: "Supports roots and flowering. Found in a soil test." },
  { name: "Potassium (K)", range: "5 – 205 kg/ha", text: "Improves overall plant health. Found in a soil test." },
  { name: "Soil pH", range: "3.5 – 9.9", text: "How acidic or alkaline the soil is. 7 is neutral." },
  { name: "Temperature", range: "8 – 44 °C", text: "Average temperature of your area." },
  { name: "Humidity", range: "14 – 100 %", text: "Average moisture in the air." },
  { name: "Rainfall", range: "20 – 300 mm", text: "Average rainfall per month." },
];

const TIPS = [
  "Take soil samples from several spots in your field and mix them for a better average.",
  "Test your soil before the planting season, not during it.",
  "Use average weather over several months, not just today's weather.",
  "Re-run SIBOL each season, because your soil and weather change.",
];

const FAQ = [
  { q: "I don't know my NPK values. What can I do?", a: "Ask your local agriculture office for a soil test, or use a home soil test kit. Until then you can try the sample data to see how the app works." },
  { q: "How accurate is the recommendation?", a: "SIBOL gives a confidence score with every result. It is a helpful guide, but real conditions on your farm can differ." },
  { q: "Which crops does SIBOL support?", a: "It supports 22 crops, including rice, maize, banana, mango, coconut and coffee. See the full list on the About page." },
  { q: "Where do I find my area's weather data?", a: "Your local weather bureau or agriculture office publishes monthly averages for temperature, humidity and rainfall." },
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
        <p>Four simple steps from your soil data to your best crop.</p>
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
              <span className="guide__range">{i.range}</span>
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
          <Link to="/predict" className="btn-pill">Predict Crop</Link>
        </div>
      </section>
    </div>
  );
}