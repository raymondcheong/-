import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ExternalLink, 
  Search,
  ChevronLeft,
  ChevronRight,
  Fish,
  Beef,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { 
  getNews, 
  getStats, 
  type NewsArticle, 
  type NewsStats,
  getArticleTypeLabel,
  getArticleTypeColor 
} from '../services/newsApi';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_FILTERS = [
  { key: 'all', label: '全部', icon: BarChart3 },
  { key: 'seafood', label: '水产', icon: Fish },
  { key: 'meat', label: '肉类', icon: Beef },
];

const TYPE_FILTERS = [
  { key: 'all', label: '全部类型' },
  { key: 'news', label: '新闻' },
  { key: 'analysis', label: '分析' },
  { key: 'price', label: '价格' },
  { key: 'market', label: '市场' },
  { key: 'trade', label: '贸易' },
  { key: 'policy', label: '政策' },
];

export default function ScrapedNews() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [stats, setStats] = useState<NewsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [newsResult, statsData] = await Promise.all([
        getNews({
          category: categoryFilter === 'all' ? undefined : categoryFilter,
          type: typeFilter === 'all' ? undefined : typeFilter,
          keyword: searchQuery || undefined,
          page,
          limit: 12,
        }),
        getStats(),
      ]);
      
      setNews(newsResult.news);
      setPagination(newsResult.pagination);
      setStats(statsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, typeFilter, page]);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        loadData();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // GSAP 动画
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const statCards = statsRef.current?.querySelectorAll('.stat-card');
      if (statCards) {
        gsap.fromTo(
          statCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  return (
    <section
      id="scraped-news"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#2997FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#006F9A]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#2997FF]/20 text-[#2997FF] text-sm font-medium rounded-full">
                数据来源: SeafoodNews.com
              </span>
              {stats?.lastUpdate && (
                <span className="text-sm text-[#E7F6FC]/50">
                  更新于 {new Date(stats.lastUpdate).toLocaleString('zh-CN')}
                </span>
              )}
            </div>
            <h2
              ref={titleRef}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] text-white mb-4"
            >
              全球水产<span className="text-gradient">资讯聚合</span>
            </h2>
            <p className="text-[#E7F6FC]/70 text-lg max-w-xl">
              每日自动抓取 Seafood News 最新资讯，智能分类分析
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-6 lg:mt-0 group flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/15 transition-all duration-300"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新数据</span>
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="stat-card glass rounded-xl p-5">
              <div className="text-3xl font-bold text-white mb-1">
                {stats.totalArticles || 0}
              </div>
              <div className="text-sm text-[#E7F6FC]/60">总文章数</div>
            </div>
            <div className="stat-card glass rounded-xl p-5">
              <div className="text-3xl font-bold text-[#2997FF] mb-1">
                {stats.seafoodCount || 0}
              </div>
              <div className="text-sm text-[#E7F6FC]/60">水产相关</div>
            </div>
            <div className="stat-card glass rounded-xl p-5">
              <div className="text-3xl font-bold text-[#10B981] mb-1">
                {stats.meatCount || 0}
              </div>
              <div className="text-sm text-[#E7F6FC]/60">肉类相关</div>
            </div>
            <div className="stat-card glass rounded-xl p-5">
              <div className="text-3xl font-bold text-[#F59E0B] mb-1">
                {stats.last7Days || 0}
              </div>
              <div className="text-sm text-[#E7F6FC]/60">近7天更新</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex gap-2">
            {CATEGORY_FILTERS.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setCategoryFilter(cat.key);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    categoryFilter === cat.key
                      ? 'bg-[#2997FF] text-white'
                      : 'glass text-[#E7F6FC]/70 hover:bg-white/15'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type.key}
                onClick={() => {
                  setTypeFilter(type.key);
                  setPage(1);
                }}
                className={`px-4 py-2.5 rounded-xl transition-all duration-300 text-sm ${
                  typeFilter === type.key
                    ? 'bg-white/20 text-white'
                    : 'glass text-[#E7F6FC]/70 hover:bg-white/15'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 lg:max-w-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E7F6FC]/50" />
              <input
                type="text"
                placeholder="搜索关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white placeholder:text-[#E7F6FC]/50 focus:outline-none focus:ring-2 focus:ring-[#2997FF]/50"
              />
            </div>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
                <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl text-white mb-2">暂无相关资讯</h3>
            <p className="text-[#E7F6FC]/60">请尝试调整筛选条件</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, index) => (
                <article
                  key={article.id}
                  className="group glass rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-500"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Card Header */}
                  <div className="p-6">
                    {/* Type & Source */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${getArticleTypeColor(article.articleType)}20`,
                          color: getArticleTypeColor(article.articleType),
                        }}
                      >
                        {getArticleTypeLabel(article.articleType)}
                      </span>
                      <span className="text-xs text-[#E7F6FC]/50">
                        {article.sourceName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-[#2997FF] transition-colors duration-300">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[#E7F6FC]/70 line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>

                    {/* Keywords */}
                    {article.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.keywords.slice(0, 3).map((kw, i) => (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                              kw.category === 'seafood'
                                ? 'bg-[#2997FF]/20 text-[#2997FF]'
                                : 'bg-[#10B981]/20 text-[#10B981]'
                            }`}
                          >
                            {kw.category === 'seafood' ? (
                              <Fish className="w-3 h-3" />
                            ) : (
                              <Beef className="w-3 h-3" />
                            )}
                            {kw.cn}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-xs text-[#E7F6FC]/50">
                        {article.scrapedAt
                          ? new Date(article.scrapedAt).toLocaleDateString('zh-CN')
                          : '-'}
                      </span>
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-[#2997FF] hover:text-white transition-colors duration-300"
                      >
                        阅读原文
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  上一页
                </button>
                <span className="text-[#E7F6FC]/70">
                  第 {page} 页 / 共 {pagination.totalPages} 页
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 transition-all duration-300"
                >
                  下一页
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Top Keywords */}
        {stats?.topKeywords && stats.topKeywords.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-white mb-6">热门关键词</h3>
            <div className="flex flex-wrap gap-3">
              {stats.topKeywords.map(([keyword, count], index) => {
                const [cn, en] = keyword.split(/[()]/);
                return (
                  <button
                    key={keyword}
                    onClick={() => {
                      setSearchQuery(en || cn);
                      setPage(1);
                    }}
                    className="group flex items-center gap-2 px-4 py-2 glass rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    <span className="text-[#2997FF] font-medium">#{index + 1}</span>
                    <span className="text-white">{cn?.trim()}</span>
                    <span className="text-[#E7F6FC]/50 text-sm">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
