import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Heart, Eye, ChevronLeft, ChevronRight, 
  Wifi, Battery, Sparkles, BookOpen, Clock, RefreshCw, Smartphone
} from "lucide-react";
import { Article, SimulatorConfig } from "../types";
import { getRecommendationsFor } from "../data";

interface PhoneSimulatorProps {
  config: SimulatorConfig;
  activeArticle: Article;
  onAddLog: (type: "info" | "success" | "trigger" | "close" | "change", message: string) => void;
  onSelectArticle: (articleId: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export default function PhoneSimulator({
  config,
  activeArticle,
  onAddLog,
  onSelectArticle,
  drawerOpen,
  setDrawerOpen,
}: PhoneSimulatorProps) {
  const [phoneTime, setPhoneTime] = useState("12:00");
  const [dragProgress, setDragProgress] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const articleContainerRef = useRef<HTMLDivElement>(null);
  const touchZoneRef = useRef<HTMLDivElement>(null);

  // Keep phone time synced up to current local or static nice representation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      setPhoneTime(`${hrs}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollPercentage(Math.min(99.9, Math.max(0, progress)));
  };

  // Get the recommended articles for the currently active article
  const recommendedList = getRecommendationsFor(activeArticle.id, 4);

  // Triggering handlers based on behaviors
  const handleTouchZoneTrigger = () => {
    if (drawerOpen) return;
    
    if (config.triggerBehavior === "hover") {
      setDrawerOpen(true);
      onAddLog("trigger", `滑入邊界觸發！開啟「猜你喜歡」推薦清單 (觸發區寬度: ${config.touchZoneWidth}px)`);
    }
  };

  const handleTouchZoneClick = () => {
    if (drawerOpen) return;
    
    if (config.triggerBehavior === "click") {
      setDrawerOpen(true);
      onAddLog("trigger", `點擊邊界觸發！開啟「猜你喜歡」推薦清單 (觸發區寬度: ${config.touchZoneWidth}px)`);
    } else if (config.triggerBehavior === "hover") {
      setDrawerOpen(true);
      onAddLog("trigger", `點擊輔助觸發！開啟「猜你喜歡」`);
    }
  };

  // Handle article view tracking
  useEffect(() => {
    onAddLog("change", `載入背景文章: 「${activeArticle.title}」`);
    if (articleContainerRef.current) {
      articleContainerRef.current.scrollTop = 0;
    }
  }, [activeArticle.id]);

  const toggleLike = (id: string) => {
    const hasLiked = !liked[id];
    setLiked(prev => ({ ...prev, [id]: hasLiked }));
    onAddLog("info", hasLiked ? `按讚了文章「${activeArticle.title}」` : `取消按讚「${activeArticle.title}」`);
  };

  const selectRecommended = (recArticle: Article) => {
    onSelectArticle(recArticle.id);
    setDrawerOpen(false);
    onAddLog("success", `自推薦清點擊載入新文章: 「${recArticle.title}」並關閉抽屜`);
  };

  return (
    <div className="relative mx-auto flex flex-col items-center select-none">
      {/* Device frame holder */}
      <div 
        id="phone-wrapper-frame"
        className="relative w-[360px] h-[740px] bg-slate-950 rounded-[52px] p-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-4 border-slate-800 ring-12 ring-slate-900/40 overflow-hidden flex flex-col transition-all duration-300"
      >
        {/* Anti-glare glass reflection */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-50 rounded-[44px]" />

        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#101026]" />
          <div className="w-9 h-1 bg-slate-900/60 rounded-full" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#08081a] border border-[#16162a] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/80" />
          </div>
        </div>

        {/* Left sensory physical volume buttons (Visual) */}
        <div className="absolute left-[-4px] top-32 w-[4px] h-12 bg-slate-700 rounded-r-sm z-30" />
        <div className="absolute left-[-4px] top-48 w-[4px] h-12 bg-slate-700 rounded-r-sm z-30" />
        {/* Right power physical button (Visual) */}
        <div className="absolute right-[-4px] top-40 w-[4px] h-16 bg-slate-700 rounded-l-sm z-30" />

        {/* Screen layout content panel */}
        <div className="relative flex-1 bg-neutral-50 rounded-[40px] overflow-hidden flex flex-col z-10 select-none">
          
          {/* Simulated iOS Style Status Bar */}
          <div className="bg-white/95 backdrop-blur text-neutral-800 text-xs px-6 pt-3.5 pb-2 flex justify-between items-center font-medium font-sans border-b border-neutral-100 z-30 select-none">
            <span className="text-[11px] font-bold tracking-tight">{phoneTime}</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="font-semibold tracking-wider text-neutral-700">5G</span>
              <Wifi size={12} className="text-neutral-800" />
              <Battery size={14} className="text-neutral-800 fill-neutral-800" />
            </div>
          </div>

          {/* Interactive Screen Viewport Wrapper */}
          <div className="relative flex-1 flex flex-col overflow-hidden">

            {/* TOUCH ZONE (Glow Overlay Bar representing left-gesture region) */}
            <div
              ref={touchZoneRef}
              onMouseEnter={handleTouchZoneTrigger}
              onClick={handleTouchZoneClick}
              className={`absolute top-0 left-0 h-full z-40 transition-all cursor-pointer ${
                config.showIndicator ? "hover:bg-indigo-500/10" : ""
              }`}
              style={{ width: `${config.touchZoneWidth}px` }}
              title={`${config.triggerBehavior === "click" ? "點擊" : "觸感/滑入"}此區域觸發猜你喜歡`}
            >
              {/* Glowing Indicator Line on left edge */}
              {config.showIndicator && (
                <div 
                  className="absolute inset-y-0 left-0 w-1 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ backgroundColor: config.indicatorColor }}
                >
                  {/* Subtle pulsing arrow indicator */}
                  <motion.div 
                    animate={{ x: [0, 4, 0], opacity: [0.3, 0.9, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="absolute left-1 bg-indigo-600 text-white rounded-r-md px-0.5 py-2 flex flex-col items-center gap-1"
                  >
                    <ChevronRight size={10} className="stroke-[3]" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* MAIN ARTICLE (Background) */}
            <div
              ref={articleContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto bg-neutral-50 px-5 pt-4 pb-20 scroll-smooth select-text"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Category & meta indicators */}
              <div className="flex items-center gap-2 mb-2 select-none">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  activeArticle.category === "Technology" ? "bg-violet-100 text-violet-700" :
                  activeArticle.category === "Finance" ? "bg-amber-100 text-amber-700" :
                  activeArticle.category === "Lifestyle" ? "bg-emerald-100 text-emerald-700" :
                  activeArticle.category === "Sports" ? "bg-rose-100 text-rose-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {activeArticle.category}
                </span>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Clock size={11} /> {activeArticle.readTime} 閱讀
                </span>
              </div>

              {/* Title display */}
              <h1 className="text-xl font-bold text-neutral-900 leading-snug tracking-tight mb-3">
                {activeArticle.title}
              </h1>

              {/* Author & date segment */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {activeArticle.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-neutral-700 leading-none">{activeArticle.author}</p>
                    <p className="text-[9px] text-neutral-400 mt-1">{activeArticle.date} · 發表於今日頭條</p>
                  </div>
                </div>
                
                {/* Simulated metrics */}
                <div className="flex items-center gap-2.5 text-neutral-400 text-[11px]">
                  <span className="flex items-center gap-0.5">
                    <Eye size={12} /> {activeArticle.views}
                  </span>
                </div>
              </div>

              {/* Cover illustration image */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 shadow-sm select-none">
                <img 
                  src={activeArticle.coverImage} 
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Detailed article content paragraphs */}
              <div className="space-y-4 text-neutral-700 text-sm leading-relaxed tracking-wide select-text">
                {activeArticle.content.map((p, i) => (
                  <p key={i} className="text-justify font-sans">
                    {p}
                  </p>
                ))}
              </div>

              {/* Feedback controls block */}
              <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-neutral-400 text-xs select-none">
                <button 
                  onClick={() => toggleLike(activeArticle.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    liked[activeArticle.id] 
                      ? "bg-rose-50 text-rose-500 font-semibold" 
                      : "hover:bg-neutral-100 text-neutral-500"
                  }`}
                >
                  <Heart size={14} className={liked[activeArticle.id] ? "fill-rose-500" : ""} />
                  <span>{activeArticle.likes + (liked[activeArticle.id] ? 1 : 0)} 讚</span>
                </button>
                <span className="text-[11px] text-neutral-400">
                  © 2026 模擬深度新聞頻道. 版權所有
                </span>
              </div>
            </div>

            {/* SCROLL PROGRESS INDICATOR */}
            <div className="absolute bottom-16 right-4 bg-white/95 backdrop-blur border border-neutral-150/80 shadow-xs px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-neutral-600 z-30 select-none">
              已讀 {Math.round(scrollPercentage)}%
            </div>

            {/* SIMULATED BOTTOM NAV TABS FOOTER (Always present in high fidelity news apps) */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-neutral-100 h-14 flex items-center justify-around text-neutral-400 text-[10px] z-30 select-none">
              <div className="flex flex-col items-center gap-0.5 text-blue-600 font-bold">
                <BookOpen size={16} />
                <span>焦點新聞</span>
              </div>
              <div 
                onClick={handleTouchZoneClick}
                className="flex flex-col items-center gap-0.5 hover:text-neutral-700 cursor-pointer text-neutral-450"
              >
                <div className="relative">
                  <Sparkles size={16} className="text-amber-500 animate-pulse" />
                </div>
                <span>猜你喜歡</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 opacity-45">
                <Smartphone size={16} />
                <span>我的收藏</span>
              </div>
            </div>

            {/* "猜你喜歡" RECOMMENDED LIST DRAWER - OVERLAY SLIDE OVER FEED */}
            <AnimatePresence>
              {drawerOpen && (
                <>
                  {/* Visual blur background mask beneath the overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setDrawerOpen(false);
                      onAddLog("close", "點擊外部遮罩：關閉「猜你喜歡」推薦清單");
                    }}
                    className="absolute inset-0 bg-black/50 z-45"
                  />

                  {/* Recommendation core sliding panel */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="absolute top-0 left-0 w-[290px] h-full bg-white shadow-2xl z-50 flex flex-col border-r border-neutral-100"
                  >
                    {/* Header bar of recommendation drawer */}
                    <div className="p-4 bg-slate-50 border-b border-neutral-100 flex items-center justify-between select-none shrink-0 pt-6">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                          <Sparkles size={15} className="fill-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-serif font-black text-slate-800 tracking-tight leading-tight line-clamp-1">
                            猜你喜歡 Recommend
                          </h3>
                          <p className="text-[9px] text-slate-400 leading-none mt-0.5">
                            每日精選 · 深度推薦列表
                          </p>
                        </div>
                      </div>
                      
                      {/* CLOSE BUTTON (X) - Mandated in request: 最右上角有叉叉可以關掉 */}
                      <button
                        onClick={() => {
                          setDrawerOpen(false);
                          onAddLog("close", "點擊 [X] 按鈕：關閉「猜你喜歡」推薦清單");
                        }}
                        className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shrink-0"
                        title="關閉推薦"
                      >
                        <X size={14} className="stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Highly curated recommendations feed lists */}
                    <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-neutral-50/50">
                      <div className="px-1 text-[11px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">
                        <span>猜您感興趣的內容</span>
                        <div className="h-[1px] flex-1 bg-slate-200" />
                      </div>

                      {recommendedList.map((rec) => (
                        <motion.div
                          key={rec.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectRecommended(rec)}
                          className="bg-white border border-neutral-200/70 p-2.5 rounded-xl shadow-xs hover:shadow-md hover:border-blue-100 transition-all cursor-pointer flex flex-col gap-2 relative group overflow-hidden"
                        >
                          {/* Left Border accent highlighting recommendation relevance */}
                          <div className={`absolute left-0 inset-y-0 w-1 ${
                            rec.category === "Technology" ? "bg-violet-500" :
                            rec.category === "Finance" ? "bg-amber-500" :
                            rec.category === "Lifestyle" ? "bg-emerald-500" :
                            rec.category === "Sports" ? "bg-rose-500" :
                            "bg-blue-500"
                          }`} />

                          {/* Image and meta row */}
                          <div className="flex gap-2.5 pl-1.5">
                            {/* Small thumbnail display */}
                            <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                              <img 
                                src={rec.coverImage} 
                                alt={rec.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              {/* Title with wrapping text constraint */}
                              <h4 className="text-[12px] font-serif font-serif-bold font-bold text-neutral-850 leading-snug tracking-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {rec.title}
                              </h4>

                              {/* Tiny badge and subtext */}
                              <div className="flex items-center justify-between text-[9px] text-neutral-400 mt-1">
                                <span className="font-semibold text-neutral-500">
                                  {rec.category}
                                </span>
                                <span>{rec.readTime}讀</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Excerpt synopsis preview */}
                          <p className="text-[10px] text-neutral-550 pl-1.5 leading-snug line-clamp-2 border-t border-neutral-105 pt-1.5 italic font-serif">
                            「{rec.excerpt}」
                          </p>
                        </motion.div>
                      ))}
                      
                      {/* Tips helper inside drawer */}
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[10px] text-blue-700 leading-normal font-sans">
                        <span className="font-bold flex items-center gap-1 mb-1 text-blue-800">
                          <Sparkles size={11} /> 
                          演算法即時偵測
                        </span>
                        偵測到您目前正在閱讀科技與人文相關内容，清單將隨背景題材動態演進與更新。
                      </div>
                    </div>

                    {/* Bottom bar inside drawer */}
                    <div className="p-3 border-t border-neutral-100 bg-white flex items-center justify-center select-none text-[10px] text-slate-400 shrink-0 font-sans">
                      <RefreshCw size={10} className="mr-1 animate-spin text-slate-300" />
                      實時推薦列表
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </div>

          {/* iOS physical touch bottom bar indicator */}
          <div className="bg-white pb-2 flex justify-center items-center z-30 select-none shrink-0">
            <div className="w-32 h-1 bg-neutral-300 rounded-full" />
          </div>

        </div>

        {/* Outer glass gloss bezel sheen shine (Visual) */}
        <div className="absolute inset-0 rounded-[52px] border-8 border-white/5 pointer-events-none z-50 ring-1 ring-black" />
      </div>

      {/* Swipe touch helper visual reminder */}
      <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs text-center font-medium">
        <span className="inline-block w-2.5 h-2.5 rounded-full animate-ping bg-blue-600" />
        <span>請在手機<b>左側邊緣 ({config.touchZoneWidth}px 寬)</b> 進行 {config.triggerBehavior === "click" ? "點擊" : "滑入/碰觸"} 觸發推薦</span>
      </div>
    </div>
  );
}
