import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ExternalLink, 
  Search,
  Fish,
  Beef,
  BarChart3
} from 'lucide-react';
import ArticleAnalysis from '../components/ArticleAnalysis';

gsap.registerPlugin(ScrollTrigger);

// 模拟分析后的新闻数据
const mockAnalyzedNews = [
  {
    id: 'bc_1',
    source: 'beefcentral',
    sourceName: 'Beef Central',
    sourceUrl: 'https://www.beefcentral.com/news/heres-seven-plausible-buyers-of-mort-cos-lotfeeding-business-and-why/',
    title: "Here's seven plausible buyers of Mort & Co's lotfeeding business, and why",
    excerpt: "IT'S pure speculation, but on the occasion of Australia's largest commercial feedlot hitting the market this week, we've thrown together some names that could conceivably come up in despatches as possible buyers...",
    category: 'meat',
    scrapedAt: '2026-04-15T10:00:00.000Z',
    analysis: {
      products: [
        { cn: '牛肉', en: 'beef', category: 'meat', confidence: 'high' },
        { cn: '活牛', en: 'cattle', category: 'livestock', confidence: 'high' },
        { cn: '育肥场', en: 'feedlot', category: 'livestock', confidence: 'high' },
      ],
      impact: {
        categories: [
          { 
            category: 'industry', 
            items: [
              { en: 'consolidation', cn: '行业整合', sentiment: 'neutral' },
              { en: 'market share', cn: '市场份额', sentiment: 'neutral' },
            ] 
          },
        ],
        sentiment: 'neutral',
        keyPoints: [],
      },
      trends: {
        direction: 'neutral',
        keywords: [],
        forecasts: [],
      },
      tariff: {
        hasTariff: false,
        keywords: [],
        details: [],
        countries: [],
      },
      analyzedAt: '2026-04-15T10:00:00.000Z',
    },
  },
  {
    id: 'bc_2',
    source: 'beefcentral',
    sourceName: 'Beef Central',
    sourceUrl: 'https://www.beefcentral.com/processing/former-minerva-wa-abattoir-assets-come-to-market/',
    title: 'Former Minerva WA abattoir assets come to market',
    excerpt: 'Two mothballed regional Western Australian meat processing facilities previously operated by Minerva Foods Australia have been put to market...',
    category: 'meat',
    scrapedAt: '2026-04-15T10:00:00.000Z',
    analysis: {
      products: [
        { cn: '牛肉', en: 'beef', category: 'meat', confidence: 'high' },
        { cn: '加工肉', en: 'processed meat', category: 'processed', confidence: 'medium' },
        { cn: '屠宰场', en: 'abattoir', category: 'livestock', confidence: 'high' },
      ],
      impact: {
        categories: [
          { 
            category: 'supply', 
            items: [
              { en: 'supply chain', cn: '供应链', sentiment: 'neutral' },
            ] 
          },
        ],
        sentiment: 'neutral',
        keyPoints: [],
      },
      trends: {
        direction: 'neutral',
        keywords: [],
        forecasts: [],
      },
      tariff: {
        hasTariff: false,
        keywords: [],
        details: [],
        countries: [],
      },
      analyzedAt: '2026-04-15T10:00:00.000Z',
    },
  },
  {
    id: 'ss_1',
    source: 'seafoodsource',
    sourceName: 'SeafoodSource',
    sourceUrl: 'https://www.seafoodsource.com/news/seafood-inflation-soars-at-us-retail-in-march/',
    title: 'Seafood inflation soars at US retail in March as consumer sentiment continues to fall',
    excerpt: 'Seafood prices at US retail continued to rise in March, contributing to overall food inflation as consumer confidence wanes...',
    category: 'seafood',
    scrapedAt: '2026-04-15T10:00:00.000Z',
    analysis: {
      products: [
        { cn: '海鲜', en: 'seafood', category: 'seafood', confidence: 'high' },
        { cn: '鱼类', en: 'fish', category: 'seafood', confidence: 'medium' },
      ],
      impact: {
        categories: [
          { 
            category: 'price', 
            items: [
              { en: 'price increase', cn: '价格上涨', sentiment: 'negative' },
              { en: 'inflation', cn: '通胀', sentiment: 'negative' },
            ] 
          },
          { 
            category: 'demand', 
            items: [
              { en: 'demand decline', cn: '需求下降', sentiment: 'negative' },
            ] 
          },
        ],
        sentiment: 'negative',
        keyPoints: [],
      },
      trends: {
        direction: 'decline',
        keywords: [
          { en: 'price increase', cn: '价格上涨', category: 'price' },
        ],
        forecasts: [],
      },
      tariff: {
        hasTariff: false,
        keywords: [],
        details: [],
        countries: [{ en: 'usa', cn: '美国' }],
      },
      analyzedAt: '2026-04-15T10:00:00.000Z',
    },
  },
  {
    id: 'ss_2',
    source: 'seafoodsource',
    sourceName: 'SeafoodSource',
    sourceUrl: 'https://www.seafoodsource.com/news/us-reveals-start-date-for-tariff-refund-process/',
    title: 'US reveals start date for tariff refund process, but questions remain on implementation',
    excerpt: 'The U.S. government has announced the start date for processing tariff refunds on imported seafood, though industry stakeholders remain uncertain about implementation details...',
    category: 'seafood',
    scrapedAt: '2026-04-15T10:00:00.000Z',
    analysis: {
      products: [
        { cn: '海鲜', en: 'seafood', category: 'seafood', confidence: 'high' },
      ],
      impact: {
        categories: [
          { 
            category: 'trade', 
            items: [
              { en: 'import', cn: '进口', sentiment: 'neutral' },
            ] 
          },
        ],
        sentiment: 'neutral',
        keyPoints: [],
      },
      trends: {
        direction: 'neutral',
        keywords: [],
        forecasts: [],
      },
      tariff: {
        hasTariff: true,
        keywords: [
          { en: 'tariff', cn: '关税', weight: 10 },
          { en: 'duty', cn: '关税', weight: 10 },
          { en: 'import tax', cn: '进口税', weight: 9 },
        ],
        details: [],
        countries: [{ en: 'usa', cn: '美国' }],
      },
      analyzedAt: '2026-04-15T10:00:00.000Z',
    },
  },
  {
    id: 'ss_3',
    source: 'seafoodsource',
    sourceName: 'SeafoodSource',
    sourceUrl: 'https://www.seafoodsource.com/news/newfoundland-seafood-processors-sue-harvester-union/',
    title: 'Newfoundland seafood processors sue harvester union leadership over ongoing snow crab pricing dispute',
    excerpt: 'Seafood processors in Newfoundland have filed a lawsuit against the harvester union leadership amid an ongoing dispute over snow crab pricing...',
    category: 'seafood',
    scrapedAt: '2026-04-15T10:00:00.000Z',
    analysis: {
      products: [
        { cn: '蟹', en: 'crab', category: 'seafood', confidence: 'high' },
        { cn: '海鲜', en: 'seafood', category: 'seafood', confidence: 'high' },
      ],
      impact: {
        categories: [
          { 
            category: 'price', 
            items: [
              { en: 'price dispute', cn: '价格争议', sentiment: 'negative' },
            ] 
          },
          { 
            category: 'industry', 
            items: [
              { en: 'competition', cn: '竞争', sentiment: 'negative' },
            ] 
          },
        ],
        sentiment: 'negative',
        keyPoints: [],
      },
      trends: {
        direction: 'neutral',
        keywords: [],
        forecasts: [],
      },
      tariff: {
        hasTariff: false,
        keywords: [],
        details: [],
        countries: [{ en: 'canada', cn: '加拿大' }],
      },
      analyzedAt: '2026-04-15T10:00:00.000Z',
    },
  },
  {
    id: 'bc_3',
    source: 'beefcentral',
    sourceName: 'Beef Central',
    sourceUrl: 'https://www.beefcentral.com/property/weekly-property-review-recently-completed-sales-137/',
    title: 'Weekly property review: Recently completed sales',
    excerpt: 'Pickersgills pay $50m+ for Blackwater\'s Bottle Tree Camp | Grazing enterprise between Sydney & Canberra makes $16m | $4.7m for Southern Tablelands block...',
    category: 'meat',
    scrapedAt: '2026-04-15T10:00:00.000Z',
    analysis: {
      products: [
        { cn: '活牛', en: 'cattle', category: 'livestock', confidence: 'high' },
        { cn: '畜牧业', en: 'livestock', category: 'livestock', confidence: 'high' },
      ],
      impact: {
        categories: [
          { 
            category: 'price', 
            items: [
              { en: 'price increase', cn: '价格上涨', sentiment: 'positive' },
            ] 
          },
        ],
        sentiment: 'positive',
        keyPoints: [],
      },
      trends: {
        direction: 'growth',
        keywords: [
          { en: 'market expansion', cn: '市场扩张', category: 'market' },
        ],
        forecasts: [],
      },
      tariff: {
        hasTariff: false,
        keywords: [],
        details: [],
        countries: [{ en: 'australia', cn: '澳大利亚' }],
      },
      analyzedAt: '2026-04-15T10:00:00.000Z',
    },
  },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: '全部', icon: BarChart3 },
  { key: 'meat', label: '肉类', icon: Beef },
  { key: 'seafood', label: '水产', icon: Fish },
];

const IMPACT_FILTERS = [
  { key: 'all', label: '全部影响' },
  { key: 'positive', label: '正面' },
  { key: 'negative', label: '负面' },
  { key: 'tariff', label: '关税相关' },
];

export default function AnalyzedNews() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const [news] = useState(mockAnalyzedNews);
  const [filteredNews, setFilteredNews] = useState(mockAnalyzedNews);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [impactFilter, setImpactFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 筛选逻辑
  useEffect(() => {
    let result = news;
    
    // 分类筛选
    if (categoryFilter !== 'all') {
      result = result.filter(n => n.category === categoryFilter);
    }
    
    // 影响筛选
    if (impactFilter !== 'all') {
      if (impactFilter === 'tariff') {
        result = result.filter(n => n.analysis.tariff.hasTariff);
      } else {
        result = result.filter(n => n.analysis.impact.sentiment === impactFilter);
      }
    }
    
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.excerpt.toLowerCase().includes(query) ||
        n.analysis.products.some(p => p.cn.includes(query) || p.en.toLowerCase().includes(query))
      );
    }
    
    setFilteredNews(result);
  }, [categoryFilter, impactFilter, searchQuery, news]);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="analyzed-news"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#2997FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#2997FF]/20 text-[#2997FF] text-sm font-medium rounded-full">
                AI 智能分析
              </span>
              <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-sm font-medium rounded-full">
                Beef Central
              </span>
              <span className="px-3 py-1 bg-[#06B6D4]/20 text-[#06B6D4] text-sm font-medium rounded-full">
                SeafoodSource
              </span>
            </div>
            <h2
              ref={titleRef}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] text-white mb-4"
            >
              智能分析<span className="text-gradient">资讯</span>
            </h2>
            <p className="text-[#E7F6FC]/70 text-lg max-w-xl">
              每篇文章自动提取：产品、影响、趋势、关税四维度分析
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex gap-2">
            {CATEGORY_FILTERS.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategoryFilter(cat.key)}
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

          {/* Impact Filter */}
          <div className="flex gap-2">
            {IMPACT_FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setImpactFilter(filter.key)}
                className={`px-4 py-2.5 rounded-xl transition-all duration-300 text-sm ${
                  impactFilter === filter.key
                    ? 'bg-white/20 text-white'
                    : 'glass text-[#E7F6FC]/70 hover:bg-white/15'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 lg:max-w-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E7F6FC]/50" />
              <input
                type="text"
                placeholder="搜索产品、关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white placeholder:text-[#E7F6FC]/50 focus:outline-none focus:ring-2 focus:ring-[#2997FF]/50"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{filteredNews.length}</div>
            <div className="text-sm text-[#E7F6FC]/60">文章总数</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#10B981]">
              {filteredNews.filter(n => n.analysis.impact.sentiment === 'positive').length}
            </div>
            <div className="text-sm text-[#E7F6FC]/60">正面影响</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#EF4444]">
              {filteredNews.filter(n => n.analysis.impact.sentiment === 'negative').length}
            </div>
            <div className="text-sm text-[#E7F6FC]/60">负面影响</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#8B5CF6]">
              {filteredNews.filter(n => n.analysis.tariff.hasTariff).length}
            </div>
            <div className="text-sm text-[#E7F6FC]/60">关税相关</div>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl text-white mb-2">暂无相关资讯</h3>
              <p className="text-[#E7F6FC]/60">请尝试调整筛选条件</p>
            </div>
          ) : (
            filteredNews.map((article) => (
              <article
                key={article.id}
                className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                {/* Article Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Source & Category */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        article.category === 'meat' 
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B]' 
                          : 'bg-[#2997FF]/20 text-[#2997FF]'
                      }`}>
                        {article.category === 'meat' ? '肉类' : '水产'}
                      </span>
                      <span className="text-xs text-[#E7F6FC]/50">{article.sourceName}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-2 hover:text-[#2997FF] transition-colors">
                      <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-sm text-[#E7F6FC]/70 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  
                  {/* External Link */}
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#E7F6FC]/50 hover:text-[#2997FF] transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                {/* AI Analysis */}
                <ArticleAnalysis analysis={article.analysis} />
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
