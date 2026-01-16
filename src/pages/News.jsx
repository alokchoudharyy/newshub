import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function News() {
  const [news, setNews] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("top");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  const categories = [
    { id: "top", icon: "🔥", label: "Top" },
    { id: "business", icon: "💼", label: "Business" },
    { id: "technology", icon: "💻", label: "Tech" },
    { id: "sports", icon: "⚽", label: "Sports" },
    { id: "health", icon: "🏥", label: "Health" },
    { id: "entertainment", icon: "🎬", label: "Entertainment" },
    { id: "science", icon: "🔬", label: "Science" },
  ];

  // ---------------- FETCH NEWS ----------------
  const fetchNews = async (page = null, selectedCategory = category) => {
    try {
      setLoading(true);

      let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=en&category=${selectedCategory}`;

      if (debouncedSearch.trim() !== "") {
        url += `&q=${debouncedSearch}`;
      }

      if (page) {
        url += `&page=${page}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || !Array.isArray(data.results)) {
        setNews([]);
        setNextPage(null);
        return;
      }

      setNews((prev) => {
        const existingIds = new Set(prev.map((n) => n.article_id));
        const uniqueNewArticles = data.results.filter(
          (item) => !existingIds.has(item.article_id)
        );
        return page ? [...prev, ...uniqueNewArticles] : uniqueNewArticles;
      });

      setNextPage(data.nextPage || null);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- APPLY CATEGORY FROM URL ----------------
  useEffect(() => {
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
      setNews([]);
      setNextPage(null);
    }
  }, [urlCategory]);

  // ---------------- FETCH ON CHANGE ----------------
  useEffect(() => {
    fetchNews();
  }, [category, debouncedSearch]);

  // ---------------- DEBOUNCE ----------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NewsHub
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Stay informed with the latest stories
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Updates
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news like bitcoin, cricket, apple..."
              className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setNews([]);
                  setNextPage(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                  category === cat.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && news.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-48 bg-slate-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <article
                key={item.article_id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
              >
                {item.image_url ? (
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-6xl opacity-30">📰</span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {item.description || "Click to read the full article."}
                  </p>

                  <div className="pt-4 border-t border-slate-100">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-semibold text-sm hover:underline"
                    >
                      Read Article →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {nextPage && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => fetchNews(nextPage)}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition"
            >
              {loading ? "Loading..." : "Load More Stories"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default News;
