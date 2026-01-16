import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryCarousel from "../components/CategoryCarousel";


function Home() {
  const [breaking, setBreaking] = useState([]);
  const [current, setCurrent] = useState(0);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;


  // Fetch real breaking news
  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const res = await fetch(
          `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=en&category=top`
        );
        const data = await res.json();

        if (data.results && Array.isArray(data.results)) {
          setBreaking(data.results.slice(0, 6)); // top 6 headlines
        }
      } catch (err) {
        console.error("Breaking news error:", err);
      }
    };

    fetchBreaking();
  }, []);

  // Rotate headline every 4 seconds
  useEffect(() => {
    if (!breaking.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % breaking.length);
    }, 4000); // ✅ 4 seconds

    return () => clearInterval(interval);
  }, [breaking]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      
      {/* Navbar */}
      <header className="sticky top-0 bg-white/70 backdrop-blur-xl border-b z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            📰 NewsHub
          </h1>

          <Link
            to="/news"
            className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Explore News
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl font-extrabold leading-tight text-slate-900">
            Your Daily Dose of  
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Real-Time News
            </span>
          </h2>

          <p className="mt-6 text-slate-600 text-lg max-w-xl">
            Fast. Clean. Smart. Stay updated with technology, business, sports and more.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/news"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Start Reading →
            </Link>

            <a
              href="#features"
              className="px-8 py-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Discover Features
            </a>
          </div>
        </div>

        {/* Floating Breaking Card */}
        <div className="relative">
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-2xl animate-float min-h-[220px]">
            <p className="text-sm text-red-600 font-bold">🔴 Breaking News</p>

            {breaking.length > 0 ? (
              <>
                <h3
                  key={current}
                  className="mt-3 text-2xl font-bold text-slate-900 animate-fade"
                >
                  {breaking[current]?.title}
                </h3>

                <a
                  href={breaking[current]?.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
                >
                  Read full article →
                </a>
              </>
            ) : (
              <p className="mt-4 text-slate-500">Loading headlines...</p>
            )}
          </div>

          {/* Glow bubbles */}
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-blue-400 blur-3xl opacity-40 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-400 blur-3xl opacity-40 rounded-full"></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Why NewsHub?</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: "⚡", title: "Instant Updates" },
            { icon: "🎯", title: "Smart Filters" },
            { icon: "📱", title: "Mobile First" },
            { icon: "🧠", title: "Modern UX" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-lg border border-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="text-4xl">{f.icon}</div>
              <h4 className="mt-4 text-xl font-semibold">{f.title}</h4>
              <p className="mt-2 text-slate-600 text-sm">
                Experience a premium, fast and clean reading experience.
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-3xl font-bold text-center mb-10">
    Explore Categories
  </h2>

  <CategoryCarousel />
</section>


      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-12 shadow-2xl">
          <h3 className="text-4xl font-bold">Start your smarter news journey</h3>
          <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
            Built like a real-world app. Designed like a product. Powered by your skills.
          </p>

          <Link
            to="/news"
            className="inline-block mt-8 px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:scale-105 transition"
          >
            Open NewsHub 🚀
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-500 text-sm">
        © {new Date().getFullYear()} NewsHub — Built by You with ❤️
      </footer>

      {/* Animations */}
      <style>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fade {
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Home;
