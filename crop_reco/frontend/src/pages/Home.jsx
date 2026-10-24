import { Link } from "react-router-dom";
import "../style/Home.css";
 
export default function Home() {
  return (
    <section className="hero">
      <video
        className="hero__video"
        src="/1008.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="hero__overlay" />
      <div className="hero__inner">
        <h1 className="hero__title">
          Grow What
          <br />
          Your Land Is
          <br />
          Meant For
        </h1>
        <p className="hero__text">
          Enter your soil, climate and rainfall details and SIBOL predicts the
          most suitable crop for your farm.
        </p>
        <Link to="/predict" className="hero__cta">Predict Crop</Link>
      </div>
    </section>
  );
}