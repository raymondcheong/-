import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Scale, 
  MapPin, 
  Package,
  ExternalLink,
  ArrowUpRight,
  Minus,
  Beef,
  Fish,
  Globe,
  Tag,
  Ship,
  Fuel
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PriceChange {
  from?: number;
  to?: number;
  value?: number;
  unit: string;
  change?: number;
  changePercent?: string;
}

const dashboardData = {
  generatedAt: '2026-04-17T10:00:00.000Z',
  summary: {
    totalArticles: 52,
    highImpactCount: 15,
    priceChangeCount: 21,
    tariffRelatedCount: 8,
    logisticsRelatedCount: 6,
  },
  priorityArticles: [
    {
      id: '1',
      title: '中東衝突導致冷藏肉類運費飆升150%',
      source: 'Food Business MEA',
      sourceUrl: 'https://www.foodbusinessmea.com',
      category: 'meat',
      keyInfo: {
        products: ['牛肉', '冷凍肉類'],
        regions: ['中東', '巴西', '阿聯酋'],
        impactLevel: 'high',
        impactDesc: '重大影響',
        priceChanges: [{ from: 2800, to: 7000, unit: '櫃', change: 4200, changePercent: '150' }] as PriceChange[],
        percentChanges: [{ percent: 150, direction: 'up' }],
        futureOutlook: 'bearish',
        briefReason: '霍爾木茲海峽航運受阻、戰爭附加費',
        hasTariff: false,
        hasLogistics: true,
      },
      publishDate: '2026-04-16',
    },
    {
      id: '2',
      title: '北美卡車運輸成本預計上漲16-17%',
      source: 'C.H. Robinson',
      sourceUrl: 'https://www.chrobinson.com',
      category: 'meat',
      keyInfo: {
        products: ['牛肉', '豬肉', '家禽'],
        regions: ['美國', '加拿大', '墨西哥'],
        impactLevel: 'high',
        impactDesc: '重大影響',
        priceChanges: [] as PriceChange[],
        percentChanges: [{ percent: 16.5, direction: 'up' }],
        futureOutlook: 'bearish',
        briefReason: '柴油價格飆升、運力緊張',
        hasTariff: false,
        hasLogistics: true,
      },
      publishDate: '2026-04-15',
    },
    {
      id: '3',
      title: '柴油價格飆升推高美國農業運輸成本',
      source: 'RFD TV',
      sourceUrl: 'https://www.rfdtv.com',
      category: 'meat',
      keyInfo: {
        products: ['牛肉', '穀物飼料'],
        regions: ['美國'],
        impactLevel: 'high',
        impactDesc: '重大影響',
        priceChanges: [{ from: 3.72, to: 5.40, unit: 'gal', change: 1.68, changePercent: '45.2' }] as PriceChange[],
        percentChanges: [{ percent: 45.2, direction: 'up' }],
        futureOutlook: 'bearish',
        briefReason: '燃油成本上漲、運輸費用增加',
        hasTariff: false,
        hasLogistics: true,
      },
      publishDate: '2026-04-14',
    },
    {
      id: '4',
      title: '集裝箱運費指數同比上漲37.95%',
      source: 'Trading Economics',
      sourceUrl: 'https://tradingeconomics.com',
      category: 'meat',
      keyInfo: {
        products: ['冷凍肉類', '海產'],
        regions: ['全球'],
        impactLevel: 'high',
        impactDesc: '重大影響',
        priceChanges: [{ value: 1890.77, unit: '點', change: 520, changePercent: '37.95' }] as PriceChange[],
        percentChanges: [{ percent: 37.95, direction: 'up' }],
        futureOutlook: 'bearish',
        briefReason: '紅海局勢、航線繞行',
        hasTariff: false,
        hasLogistics: true,
      },
      publishDate: '2026-04-17',
    },
    {
      id: '5',
      title: '巴西牛肉出口中東量暴跌20.5%',
      source: 'ABIEC',
      sourceUrl: 'https://www.abiec.com.br',
      category: 'meat',
      keyInfo: {
        products: ['牛肉'],
        regions: ['巴西', '中東'],
        impactLevel: 'high',
        impactDesc: '重大影響',
        priceChanges: [{ from: 22919, to: 18220, unit: '噸', change: -4699, changePercent: '-20.5' }] as PriceChange[],
        percentChanges: [{ percent: 20.5, direction: 'down' }],
        futureOutlook: 'bearish',
        briefReason: '運費飆升、出口受阻',
        hasTariff: false,
        hasLogistics: true,
      },
      publishDate: '2026-04-16',
    },
    {
      id: '6',
      title: '澳洲碎牛肉出口強勁但關稅不確定性持續',
      source: 'Beef Central',
      sourceUrl: 'https://www.beefcentral.com',
      category: 'meat',
      keyInfo: {
        products: ['牛肉', '碎牛肉'],
        regions: ['澳洲', '美國', '中國'],
        impactLevel: 'medium',
        impactDesc: '中等影響',
        priceChanges: [{ from: 11.20, to: 11.40, unit: 'AUD/kg', change: 0.2, changePercent: '1.8' }] as PriceChange[],
        percentChanges: [{ percent: 1.8, direction: 'up' }],
        futureOutlook: 'bullish',
        briefReason: '美國國內供應短缺、中國需求強勁',
        hasTariff: true,
        hasLogistics: false,
      },
      publishDate: '2026-04-14',
    },
    {
      id: '7',
      title: '美國牛肉時隔20年重返澳洲市場',
      source: 'USMEF',
      sourceUrl: 'https://www.usmef.org',
      category: 'meat',
      keyInfo: {
        products: ['牛肉'],
        regions: ['美國', '澳洲'],
        impactLevel: 'medium',
        impactDesc: '中等影響',
        priceChanges: [] as PriceChange[],
        percentChanges: [],
        futureOutlook: 'bullish',
        briefReason: '市場重新開放、貿易機會增加',
        hasTariff: false,
        hasLogistics: false,
      },
      publishDate: '2026-04-13',
    },
    {
      id: '8',
      title: '中國需求強勁帶動澳洲牛肉出口價格飆升15%',
      source: 'Beef Central',
      sourceUrl: 'https://www.beefcentral.com',
      category: 'meat',
      keyInfo: {
        products: ['牛肉', '凍牛肉'],
        regions: ['澳洲', '中國'],
        impactLevel: 'high',
        impactDesc: '重大影響',
        priceChanges: [{ from: 8.5, to: 9.8, unit: 'kg', change: 1.3, changePercent: '15.3' }] as PriceChange[],
        percentChanges: [{ percent: 15.3, direction: 'up' }],
        futureOutlook: 'bullish',
        briefReason: '中國需求強勁、供應緊張',
        hasTariff: false,
        hasLogistics: false,
      },
      publishDate: '2026-04-12',
    },
    {
      id: '9',
      title: '美國宣布對特定國家進口海產徵收新關稅',
      source: 'SeafoodSource',
      sourceUrl: 'https://www.seafoodsource.com',
      category: 'seafood',
      keyInfo: {
        products: ['海產', '蝦', '蟹'],
        regions: ['美國', '中國', '越南'],
        impactLevel: 'high',
        impactDesc: '重大影響',
        priceChanges: [] as PriceChange[],
        percentChanges: [],
        futureOutlook: 'bearish',
        briefReason: '關稅政策變動',
        hasTariff: true,
        hasLogistics: false,
      },
      publishDate: '2026-04-11',
    },
    {
      id: '10',
      title: '產量增加導致巴西豬肉價格下跌8%',
      source: 'Global Meat News',
      sourceUrl: 'https://www.globalmeatnews.com',
      category: 'meat',
      keyInfo: {
        products: ['豬肉', '凍豬肉'],
        regions: ['巴西'],
        impactLevel: 'medium',
        impactDesc: '中等影響',
        priceChanges: [{ from: 4.2, to: 3.9, unit: 'kg', change: -0.3, changePercent: '-7.1' }] as PriceChange[],
        percentChanges: [{ percent: 7.1, direction: 'down' }],
        futureOutlook: 'neutral',
        briefReason: '產量增加',
        hasTariff: false,
        hasLogistics: false,
      },
      publishDate: '2026-04-10',
    },
  ],
  priceUpdates: [
    {
      id: '1',
      title: '中東衝突導致冷藏肉類運費飆升150%',
      products: ['冷凍肉類'],
      priceChanges: [{ from: 2800, to: 7000, unit: '櫃', change: 4200, changePercent: '150' }] as PriceChange[],
      percentChanges: [{ percent: 150, direction: 'up' }],
      source: 'Food Business MEA',
      sourceUrl: 'https://www.foodbusinessmea.com',
    },
    {
      id: '4',
      title: '集裝箱運費指數同比上漲37.95%',
      products: ['冷凍肉類', '海產'],
      priceChanges: [{ value: 1890.77, unit: '點', change: 520, changePercent: '37.95' }] as PriceChange[],
      percentChanges: [{ percent: 37.95, direction: 'up' }],
      source: 'Trading Economics',
      sourceUrl: 'https://tradingeconomics.com',
    },
    {
      id: '3',
      title: '柴油價格飆升推高美國農業運輸成本',
      products: ['牛肉', '飼料'],
      priceChanges: [{ from: 3.72, to: 5.40, unit: 'gal', change: 1.68, changePercent: '45.2' }] as PriceChange[],
      percentChanges: [{ percent: 45.2, direction: 'up' }],
      source: 'RFD TV',
      sourceUrl: 'https://www.rfdtv.com',
    },
  ],
  tariffUpdates: [
    {
      id: '2',
      title: '美國宣布對特定國家進口海產徵收新關稅',
      tariffKeywords: [{ en: 'tariff', cn: '關稅', severity: 'high' }],
      countries: ['美國', '中國', '越南'],
      source: 'SeafoodSource',
      sourceUrl: 'https://www.seafoodsource.com',
    },
  ],
  logisticsUpdates: [
    {
      id: '1',
      title: '中東衝突導致冷藏肉類運費飆升150%',
      logisticsKeywords: [{ en: 'shipping', cn: '航運', severity: 'high' }, { en: 'freight', cn: '運費', severity: 'high' }],
      regions: ['中東', '巴西'],
      impact: '運費從$2,800/櫃飆升至$7,000/櫃',
      source: 'Food Business MEA',
      sourceUrl: 'https://www.foodbusinessmea.com',
    },
    {
      id: '2',
      title: '北美卡車運輸成本預計上漲16-17%',
      logisticsKeywords: [{ en: 'trucking', cn: '卡車運輸', severity: 'high' }],
      regions: ['美國', '加拿大', '墨西哥'],
      impact: '2026年運輸成本同比上漲16-17%',
      source: 'C.H. Robinson',
      sourceUrl: 'https://www.chrobinson.com',
    },
  ],
};

const CATEGORY_FILTERS = [
  { key: 'all', label: '全部', icon: Package },
  { key: 'meat', label: '肉類', icon: Beef },
  { key: 'seafood', label: '海產', icon: Fish },
  { key: 'logistics', label: '物流', icon: Ship },
];

const IMPACT_CONFIG = {
  high: { color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/20', label: '重大', icon: AlertTriangle },
  medium: { color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/20', label: '中等', icon: AlertTriangle },
  low: { color: 'text-[#10B981]', bg: 'bg-[#10B981]/20', label: '輕微', icon: Minus },
};

const TREND_CONFIG = {
  bullish: { color: 'text-[#EF4444]', icon: TrendingUp, label: '看漲' },
  bearish: { color: 'text-[#10B981]', icon: TrendingDown, label: '看跌' },
  neutral: { color: 'text-[#888888]', icon: Minus, label: '觀望' },
};

export default function BusinessDashboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<'all' | 'meat' | 'seafood' | 'logistics'>('all');
  const [showTariffOnly, setShowTariffOnly] = useState(false);
  const [showLogisticsOnly, setShowLogisticsOnly] = useState(false);

  const filteredArticles = dashboardData.priorityArticles
    .filter(article => {
      if (filter !== 'all' && article.category !== filter) return false;
      if (showTariffOnly && !article.keyInfo.hasTariff) return false;
      if (showLogisticsOnly && !article.keyInfo.hasLogistics) return false;
      return true;
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dashboard-card',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'meat': return <Beef className="w-5 h-5 text-[#F59E0B]" />;
      case 'seafood': return <Fish className="w-5 h-5 text-[#2997FF]" />;
      case 'logistics': return <Ship className="w-5 h-5 text-[#8B5CF6]" />;
      default: return <Package className="w-5 h-5 text-[#888888]" />;
    }
  };

  return (
    <section
      id="business-dashboard"
      ref={sectionRef}
      className="relative py-10 overflow-hidden"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              市場<span className="text-gradient">情報</span>
            </h2>
            <p className="text-lg text-[#E7F6FC]/60">
              產品 · 地區 · 影響程度 · 價格變動 · 未來預計
            </p>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <div className="glass rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold text-[#EF4444]">{dashboardData.summary.highImpactCount}</div>
              <div className="text-sm text-[#E7F6FC]/60">重大影響</div>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold text-[#F59E0B]">{dashboardData.summary.priceChangeCount}</div>
              <div className="text-sm text-[#E7F6FC]/60">價格變動</div>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold text-[#10B981]">{dashboardData.summary.logisticsRelatedCount}</div>
              <div className="text-sm text-[#E7F6FC]/60">物流相關</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {CATEGORY_FILTERS.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key as 'all' | 'meat' | 'seafood' | 'logistics')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-lg transition-all duration-300 ${
                  filter === cat.key
                    ? 'bg-[#2997FF] text-white'
                    : 'glass text-[#E7F6FC]/70 hover:bg-white/15'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{cat.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowTariffOnly(!showTariffOnly)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-lg transition-all duration-300 ${
              showTariffOnly ? 'bg-[#8B5CF6] text-white' : 'glass text-[#E7F6FC]/70 hover:bg-white/15'
            }`}
          >
            <Scale className="w-5 h-5" />
            <span className="font-semibold">僅顯示關稅相關</span>
          </button>
          <button
            onClick={() => setShowLogisticsOnly(!showLogisticsOnly)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-lg transition-all duration-300 ${
              showLogisticsOnly ? 'bg-[#10B981] text-white' : 'glass text-[#E7F6FC]/70 hover:bg-white/15'
            }`}
          >
            <Fuel className="w-5 h-5" />
            <span className="font-semibold">僅顯示物流相關</span>
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-2xl text-white mb-2">暫無相關資訊</h3>
              <p className="text-lg text-[#E7F6FC]/60">請嘗試調整篩選條件</p>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const impact = IMPACT_CONFIG[article.keyInfo.impactLevel as keyof typeof IMPACT_CONFIG];
              const ImpactIcon = impact.icon;
              const trend = TREND_CONFIG[article.keyInfo.futureOutlook as keyof typeof TREND_CONFIG];
              const TrendIcon = trend.icon;

              return (
                <article
                  key={article.id}
                  className="dashboard-card glass rounded-2xl p-5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${
                          article.category === 'meat' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 
                          article.category === 'seafood' ? 'bg-[#2997FF]/20 text-[#2997FF]' :
                          'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                        }`}>
                          {getProductIcon(article.category)}
                          {article.category === 'meat' ? '肉類' : article.category === 'seafood' ? '海產' : '物流'}
                        </span>

                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${impact.bg} ${impact.color}`}>
                          <ImpactIcon className="w-4 h-4" />
                          {impact.label}影響
                        </span>

                        {article.keyInfo.hasTariff && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-[#8B5CF6]/20 text-[#8B5CF6]">
                            <Scale className="w-4 h-4" />
                            關稅
                          </span>
                        )}

                        {article.keyInfo.hasLogistics && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-[#10B981]/20 text-[#10B981]">
                            <Ship className="w-4 h-4" />
                            物流
                          </span>
                        )}

                        <span className="text-base text-[#E7F6FC]/50">
                          {article.source} · {article.publishDate}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white hover:text-[#2997FF] transition-colors cursor-pointer">
                        <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      </h3>
                    </div>

                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#E7F6FC]/50 hover:text-[#2997FF] transition-colors"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-[#2997FF]" />
                        <span className="text-base text-[#E7F6FC]/60">產品</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {article.keyInfo.products.map((product) => (
                          <span key={product} className="text-base text-white font-semibold">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-[#10B981]" />
                        <span className="text-base text-[#E7F6FC]/60">地區</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {article.keyInfo.regions.map((region) => (
                          <span key={region} className="text-base text-white font-semibold">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-5 h-5 text-[#F59E0B]" />
                        <span className="text-base text-[#E7F6FC]/60">價格變動</span>
                      </div>
                      {article.keyInfo.priceChanges.length > 0 ? (
                        <div className="space-y-1">
                          {article.keyInfo.priceChanges.map((change, idx) => {
                            const hasRange = change.from !== undefined && change.to !== undefined;
                            const changeVal = change.change ?? 0;
                            const changePercent = change.changePercent ?? '0';
                            return (
                              <div key={idx} className="text-base">
                                {hasRange ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white/60">${change.from}</span>
                                    <ArrowUpRight className={`w-4 h-4 ${
                                      changeVal > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'
                                    }`} />
                                    <span className="text-white font-bold">${change.to}</span>
                                    <span className="text-white/40">/{change.unit}</span>
                                  </div>
                                ) : (
                                  <span className="text-white font-bold">${change.value}/{change.unit}</span>
                                )}
                                {changePercent !== '0' && (
                                  <span className={`text-base ml-2 ${
                                    parseFloat(changePercent) > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'
                                  }`}>
                                    {parseFloat(changePercent) > 0 ? '+' : ''}{changePercent}%
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-base text-white/50">暫無價格數據</span>
                      )}
                    </div>

                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendIcon className={`w-5 h-5 ${trend.color}`} />
                        <span className="text-base text-[#E7F6FC]/60">預計 · 原因</span>
                      </div>
                      <div className="text-base text-white font-bold mb-1">
                        {trend.label}
                      </div>
                      <div className="text-base text-[#E7F6FC]/60">
                        {article.keyInfo.briefReason}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Logistics Updates Section */}
        {dashboardData.logisticsUpdates && dashboardData.logisticsUpdates.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Ship className="w-6 h-6 text-[#10B981]" />
              物流運輸動態
            </h3>
            <div className="space-y-3">
              {dashboardData.logisticsUpdates.map((update) => (
                <div key={update.id} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {update.logisticsKeywords.map((kw) => (
                        <span key={kw.en} className="px-2.5 py-1 rounded-lg bg-[#10B981]/20 text-[#10B981] text-base">
                          {kw.cn}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-white font-bold text-lg">{update.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-base text-[#E7F6FC]/60">
                      <Globe className="w-5 h-5" />
                      <span>涉及: {update.regions.join('、')}</span>
                    </div>
                    <div className="text-base text-[#10B981] mt-2 font-semibold">
                      {update.impact}
                    </div>
                  </div>
                  <a
                    href={update.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#E7F6FC]/50 hover:text-[#10B981] transition-colors"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Updates Section */}
        {dashboardData.priceUpdates.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Tag className="w-6 h-6 text-[#F59E0B]" />
              最新價格變動
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {dashboardData.priceUpdates.map((update) => (
                <div key={update.id} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {update.products.map((p) => (
                      <span key={p} className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-base">
                        {p}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-white font-bold mb-3 line-clamp-2 text-base">{update.title}</h4>
                  {update.percentChanges.map((pc, idx) => (
                    <div key={idx} className={`flex items-center gap-2 ${
                      pc.direction === 'up' ? 'text-[#EF4444]' : 'text-[#10B981]'
                    }`}>
                      {pc.direction === 'up' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                      <span className="text-2xl font-bold">
                        {pc.direction === 'up' ? '+' : '-'}{pc.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tariff Updates Section */}
        {dashboardData.tariffUpdates.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-[#8B5CF6]" />
              關稅政策更新
            </h3>
            <div className="space-y-3">
              {dashboardData.tariffUpdates.map((update) => (
                <div key={update.id} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {update.tariffKeywords.map((kw) => (
                        <span key={kw.en} className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] text-base">
                          {kw.cn}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-white font-bold text-lg">{update.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-base text-[#E7F6FC]/60">
                      <Globe className="w-5 h-5" />
                      <span>涉及: {update.countries.join('、')}</span>
                    </div>
                  </div>
                  <a
                    href={update.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#E7F6FC]/50 hover:text-[#8B5CF6] transition-colors"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
