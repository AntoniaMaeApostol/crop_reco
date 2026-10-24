import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Guide from "./pages/Guide";
import Predict from "./pages/Predict";
import "./style/App.css";

const PAGE_TITLES = {
  "/": "Home",
  "/about": "About",
  "/guide": "Guide",
  "/predict": "Predict",
};

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PAGE_TITLES[pathname] ?? "SIBOL";
    document.title = `${page} | SIBOL Crop Recommendation`;
  }, [pathname]);

  return (
    <div className="app">
      <Header />
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}