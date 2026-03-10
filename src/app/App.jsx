import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { HomePage } from "./routes/HomePage";
import { ServicesPage } from "./routes/ServicesPage";
import { ContentProvider } from "./content/ContentContext";
import { AdminPage } from "./routes/AdminPage";

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const hash = location.hash;

    if (hash) {
      const id = hash.replace("#", "");
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        attempts += 1;
        if (attempts < 10) requestAnimationFrame(tryScroll);
      };

      requestAnimationFrame(tryScroll);
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [location.key, location.hash]);

  return null;
}

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <ScrollToHash />
        <div className="min-h-screen">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServicesPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ContentProvider>
  );
}
