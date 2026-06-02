import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, X, Sparkles, BookOpen, Clock, Heart, 
  Share2, Bookmark, ArrowRight, ArrowLeft, ChevronRight, ThumbsUp
} from "lucide-react";
import { NEWS_ARTICLES, getRecommendationsFor } from "./data";
import { Article } from "./types";
import Logo from "./components/Logo";
import GlobeLogo from "./components/GlobeLogo";

export default function App() {
  const [activeArticleId, setActiveArticleId] = useState<string>("tech-1");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // Simulated reactive phone status bar time
  const [phoneTime, setPhoneTime] = useState<string>("12:00");
  
  // Custom touch gesture detection variables
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const touchZoneWidth = 40; // Pixels on left edge to arm gesture detection
  const mainScrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      setPhoneTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const activeArticle = NEWS_ARTICLES.find(a => a.id === activeArticleId) || NEWS_ARTICLES[0];
  const recommendedList = getRecommendationsFor(activeArticle.id, 4);

  // Auto scroll to top of article on change within the phone container
  useEffect(() => {
    if (mainScrollContainerRef.current) {
      mainScrollContainerRef.current.scrollTop = 0;
    }
  }, [activeArticleId]);

  // Touch tracking for real edge-swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    // Only detect swipes initiating from the left edge of the viewport
    if (startX < touchZoneWidth) {
      setTouchStartX(startX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartX;

    // Swipe more than 35px rightward to reveal drawer
    if (diffX > 35) {
      setDrawerOpen(true);
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  const handleLike = (id: string) => {
    setLikedArticles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBookmark = (id: string) => {
    setBookmarkedArticles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ["All", "Technology", "Finance", "Lifestyle", "Sports", "Humanities"];

  // Filtered articles list for homepage view
  const filteredArticles = activeCategory === "All" 
    ? NEWS_ARTICLES 
    : NEWS_ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 font-sans text-gray-800"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* 1. EDITORIAL HEADER & BRANDING */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-45 select-none shrink-0 w-full shadow-xs">
        <div className="max-w-4xl mx-auto h-16 flex items-center justify-between px-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GlobeLogo className="w-8 h-8 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-sans font-black tracking-tight text-slate-900 leading-none">
                  新聞網
                </span>
              </div>
            </div>
          </div>

          <div className="w-8"></div>
        </div>

        {/* Categories Tab selector bar for interactive mobile reading experience */}
        <div className="border-t border-gray-50 bg-gray-50/50 w-full">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 flex gap-6 overflow-x-auto scrollbar-none py-2.5 text-xs sm:text-sm font-medium">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  // Find first article of this category to dynamically load
                  const matched = NEWS_ARTICLES.find(a => cat === "All" || a.category === cat);
                  if (matched) {
                    setActiveArticleId(matched.id);
                  }
                }}
                className={`whitespace-nowrap pb-0.5 transition-colors px-1 cursor-pointer ${
                  activeCategory === cat || (cat === "All" && activeCategory === "All")
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {cat === "All" ? "最新總覽" : cat === "Technology" ? "未來科技" : cat === "Finance" ? "全球財經" : cat === "Lifestyle" ? "品味生活" : cat === "Sports" ? "競技心智" : "人文深度"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE ARTICLE BODY CONTAINER */}
      <main className="flex-1 w-full bg-white">
        <div 
          ref={mainScrollContainerRef}
          className="max-w-3xl mx-auto px-6 sm:px-10 py-8 pb-24 space-y-6 select-text"
        >
          <article className="space-y-6">
            
            {/* Article category and length metrics */}
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold tracking-wider uppercase">
                {activeArticle.category}
              </span>
              <span className="text-xs text-gray-400 font-mono tracking-wider">
                {activeArticle.readTime} 閱讀
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-gray-900 leading-snug">
              {activeArticle.title}
            </h1>

            {/* Author metadata panel */}
            <div className="flex items-center justify-between py-3 border-y border-gray-100 select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-500 text-white font-serif font-bold text-sm flex items-center justify-center">
                  {activeArticle.author.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800 leading-none">{activeArticle.author}</div>
                  <div className="text-xs text-gray-400 mt-1">發報日期 · {activeArticle.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-gray-450">
                <button 
                  onClick={() => handleBookmark(activeArticle.id)}
                  className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${
                    bookmarkedArticles[activeArticle.id] ? "text-blue-600" : "text-gray-400"
                  }`}
                  title="收藏本篇"
                >
                  <Bookmark size={18} className={bookmarkedArticles[activeArticle.id] ? "fill-blue-600" : ""} />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-50 transition-colors text-gray-400"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("已成功複製文章連結！");
                  }}
                  title="分享文章"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Hero Banner Cover Image */}
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-100 relative shadow-xs">
              <img 
                src={activeArticle.coverImage} 
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Excerpt panel */}
            <div className="bg-slate-50 border-l-4 border-blue-600 rounded-r-xl p-4 sm:p-5 italic font-serif text-sm sm:text-base text-gray-750 leading-relaxed">
              「{activeArticle.excerpt}」
            </div>

            {/* Concrete text rows */}
            <div className="space-y-4 font-serif text-base sm:text-lg text-gray-850 leading-relaxed">
              {activeArticle.content.map((p, i) => (
                <p key={i} className="indent-8 text-justify">
                  {p}
                </p>
              ))}
            </div>

            {/* Interactive like bar inside article */}
            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              <button 
                onClick={() => handleLike(activeArticle.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm transition-colors ${
                  likedArticles[activeArticle.id] 
                    ? "bg-rose-50 text-rose-600 font-bold" 
                    : "bg-slate-50 text-gray-500 hover:bg-slate-100"
                }`}
              >
                <ThumbsUp size={14} className={likedArticles[activeArticle.id] ? "fill-rose-600 stroke-rose-600" : ""} />
                <span>{activeArticle.likes + (likedArticles[activeArticle.id] ? 1 : 0)} 讚</span>
              </button>
            </div>

            {/* Footer space */}
            <footer className="pt-10 pb-6 text-center text-xs text-gray-400 select-none border-t border-gray-50">
              <p className="font-serif tracking-wider">GLOBAL TIMES · NEWS ONLINE</p>
              <p className="mt-1 text-[10px] font-mono">© 2026 GENERAL NEWS AND RESEARCH CO.</p>
            </footer>

          </article>
        </div>
      </main>

      {/* 3. TOP-LEFT 100px HOVER TRIGGER ZONE */}
      <div 
        onMouseEnter={() => setDrawerOpen(true)}
        onClick={() => setDrawerOpen(true)}
        className="fixed top-0 left-0 w-[100px] h-[100px] z-45 cursor-pointer bg-transparent select-none"
      />

      {/* 4. RECOMMENDATIONS SLIDE-OUT DRAWER PANEL (Fully covers the news article when open, rendering fullscreen on top) */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex overflow-hidden select-none">
            
            {/* Backdrop cover glass */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Sliding Core Panel - FULL WINDOW WIDTH to guarantee NO article is leaked underneath */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-full bg-white h-full shadow-2xl flex flex-col z-10"
            >
              
              {/* Drawer Masthead */}
              <div className="p-4 bg-gray-50 border-b border-gray-100 shrink-0 select-none">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-2">
                    <Logo className="w-6 h-6 flex-shrink-0" />
                    <span className="text-sm font-sans font-black tracking-tight text-slate-900 leading-none">新聞網</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-serif font-black text-[#E6256E] tracking-wider">
                    猜你喜歡
                  </h3>

                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors shrink-0"
                    title="關閉推薦"
                  >
                    <X size={18} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Scrolling List Content */}
              <div className="flex-1 overflow-y-auto px-6 py-8 sm:py-12 bg-white">
                <div className="max-w-2xl mx-auto w-full">
                  <div className="flex flex-col gap-6">
                    {recommendedList.map((rec) => {
                      const isRecActive = rec.id === activeArticleId;
                      return (
                        <motion.div
                          key={rec.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setActiveArticleId(rec.id);
                            setDrawerOpen(false);
                          }}
                          className={`p-4 sm:p-5 rounded-2xl cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 transition-all relative overflow-hidden border border-slate-100 ${
                            isRecActive
                              ? "bg-rose-50/40 text-slate-900 ring-2 ring-rose-200"
                              : "bg-white hover:bg-slate-50/60 hover:shadow-xs"
                          }`}
                        >
                          {/* Large Cover Image */}
                          <div className="aspect-[16/9] sm:w-[260px] sm:h-[146px] rounded-xl overflow-hidden bg-gray-100 shadow-2xs shrink-0">
                            <img 
                              src={rec.coverImage} 
                              alt={rec.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Title text, Category & Date */}
                          <div className="flex flex-col justify-between py-1 text-left flex-1 space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold tracking-wider uppercase">
                                  {rec.category}
                                </span>
                              </div>
                              <h4 className="text-base sm:text-lg font-serif font-black text-slate-900 leading-snug tracking-tight">
                                {rec.title}
                              </h4>
                            </div>
                            
                            <div className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5 font-mono">
                              <Clock size={12} className="text-gray-350" />
                              <span>{rec.date}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
