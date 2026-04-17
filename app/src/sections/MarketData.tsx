import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw, Fish } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface MarketItem {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  source: string;
  updatedAt: string;
}

// 香港政府官方數據 - 食物環境衛生署（FEHD）
const hkGovData: MarketItem[] = [
  {
    id: 'hk-pig-avg',
    name: '活豬平均拍賣價',
    nameEn: 'Live Pig Avg Price',
    price: 771,
    unit: 'HKD/擔',
    change: -26,
    changePercent: -3.26,
    source: 'FEHD',
    updatedAt: '2026-04-16',
  },
  {
    id: 'hk-pig-high',
    name: '活豬最高拍賣價',
    nameEn: 'Live Pig High Price',
    price: 1500,
    unit: 'HKD/擔',
    change: 0,
    changePercent: 0,
    source: 'FEHD',
    updatedAt: '2026-04-16',
  },
  {
    id: 'hk-pig-low',
    name: '活豬最低拍賣價',
    nameEn: 'Live Pig Low Price',
    price: 600,
    unit: 'HKD/擔',
    change: -50,
    changePercent: -7.69,
    source: 'FEHD',
    updatedAt: '2026-04-16',
  },
  {
    id: 'hk-pig-supply',
    name: '今日活豬供應量',
    nameEn: "Today's Supply",
    price: 3470,
    unit: '頭',
    change: 24,
    changePercent: 0.70,
    source: 'FEHD',
    updatedAt: '2026-04-16',
  },
  {
    id: 'hk-pig-forecast',
    name: '明日活豬預計供應量',
    nameEn: "Tomorrow's Forecast",
    price: 3500,
    unit: '頭',
    change: 30,
    changePercent: 0.86,
    source: 'FEHD',
    updatedAt: '2026-04-16',
  },
];

// CME 肉類期貨指數數據
const cmeData: MarketItem[] = [
  {
    id: 'LE',
    name: '活牛期貨',
    nameEn: 'Live Cattle Futures',
    price: 247.60,
    unit: 'USD/cwt',
    change: -3.47,
    changePercent: -1.38,
    source: 'CME Group',
    updatedAt: '2026-04-17',
  },
  {
    id: 'FCI',
    name: '育肥牛指數',
    nameEn: 'Feeder Cattle Index',
    price: 379.09,
    unit: 'USD/cwt',
    change: 3.63,
    changePercent: 0.97,
    source: 'CME Group',
    updatedAt: '2026-04-15',
  },
  {
    id: 'HE',
    name: '瘦肉豬期貨',
    nameEn: 'Lean Hog Futures',
    price: 101.75,
    unit: 'USD/cwt',
    change: -0.20,
    changePercent: -0.20,
    source: 'CME Group',
    updatedAt: '2026-04-17',
  },
  {
    id: 'LHI',
    name: '瘦肉豬指數',
    nameEn: 'Lean Hog Index',
    price: 90.60,
    unit: 'USD/cwt',
    change: 0.27,
    changePercent: 0.30,
    source: 'CME Group',
    updatedAt: '2026-04-14',
  },
  {
    id: 'PCI',
    name: '豬肉切塊指數',
    nameEn: 'Pork Cutout Index',
    price: 97.83,
    unit: 'USD/cwt',
    change: -0.32,
    changePercent: -0.33,
    source: 'CME Group',
    updatedAt: '2026-04-15',
  },
];

// 海鮮類價格指數
const seafoodData: MarketItem[] = [
  {
    id: 'salmon-no',
    name: '挪威三文魚',
    nameEn: 'Norway Salmon',
    price: 7.51,
    unit: 'USD/kg',
    change: -1.52,
    changePercent: -16.82,
    source: 'SalmonBusiness',
    updatedAt: '2026-04-16',
  },
  {
    id: 'shrimp-global',
    name: '全球蝦價格指數',
    nameEn: 'Global Shrimp Index',
    price: 7.19,
    unit: 'USD/kg',
    change: -0.26,
    changePercent: -3.49,
    source: 'FRED',
    updatedAt: '2026-03-31',
  },
  {
    id: 'salmon-chile',
    name: '智利三文魚',
    nameEn: 'Chile Salmon',
    price: 6.85,
    unit: 'USD/kg',
    change: 0.15,
    changePercent: 2.24,
    source: 'Urner Barry',
    updatedAt: '2026-04-14',
  },
  {
    id: 'crab-usa',
    name: '美國藍蟹肉',
    nameEn: 'US Blue Crab Meat',
    price: 28.50,
    unit: 'USD/lb',
    change: 1.20,
    changePercent: 4.40,
    source: 'Urner Barry',
    updatedAt: '2026-04-15',
  },
  {
    id: 'scallop-usa',
    name: '美國海扇貝',
    nameEn: 'US Sea Scallops',
    price: 18.75,
    unit: 'USD/lb',
    change: -0.50,
    changePercent: -2.60,
    source: 'Urner Barry',
    updatedAt: '2026-04-15',
  },
];

export default function MarketData() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'hk' | 'cme' | 'seafood'>('hk');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.market-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [activeTab]);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-5 h-5" />;
    if (change < 0) return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-[#EF4444]';
    if (change < 0) return 'text-[#10B981]';
    return 'text-[#888888]';
  };

  const getChangeBg = (change: number) => {
    if (change > 0) return 'bg-[#EF4444]/10';
    if (change < 0) return 'bg-[#10B981]/10';
    return 'bg-[#888888]/10';
  };

  const currentData = activeTab === 'hk' ? hkGovData : activeTab === 'cme' ? cmeData : seafoodData;

  return (
    <section
      id="market"
      ref={sectionRef}
      className="relative py-10 overflow-hidden"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            肉類<span className="text-gradient">價格指數</span>
          </h2>
          <p className="text-lg text-[#E7F6FC]/60">
            {activeTab === 'hk' ? '香港食物環境衛生署官方數據' : activeTab === 'cme' ? 'CME Group 期貨指數' : '全球海鮮價格指數'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('hk')}
            className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
              activeTab === 'hk'
                ? 'bg-[#10B981] text-white'
                : 'glass text-[#E7F6FC]/70 hover:bg-white/10'
            }`}
          >
            香港政府官方
          </button>
          <button
            onClick={() => setActiveTab('cme')}
            className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
              activeTab === 'cme'
                ? 'bg-[#2997FF] text-white'
                : 'glass text-[#E7F6FC]/70 hover:bg-white/10'
            }`}
          >
            CME 期貨
          </button>
          <button
            onClick={() => setActiveTab('seafood')}
            className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
              activeTab === 'seafood'
                ? 'bg-[#F59E0B] text-white'
                : 'glass text-[#E7F6FC]/70 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Fish className="w-5 h-5" />
              海鮮類
            </div>
          </button>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {currentData.map((item) => (
            <div
              key={item.id}
              className="market-card glass rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-[#E7F6FC]/50">{item.nameEn}</p>
              </div>

              <div className="mb-3">
                <span className="text-3xl font-bold text-white">
                  {item.price.toLocaleString()}
                </span>
                <span className="text-sm text-[#E7F6FC]/60 ml-1">{item.unit}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getChangeBg(item.change)}`}>
                  <span className={getChangeColor(item.change)}>
                    {getChangeIcon(item.change)}
                  </span>
                  <span className={`text-base font-semibold ${getChangeColor(item.change)}`}>
                    {item.change > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-sm text-[#E7F6FC]/40">
                <span>{item.source}</span>
                <span>{item.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Data Source */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href={activeTab === 'hk' 
              ? 'https://www.fehd.gov.hk/tc_chi/sh/data/supply_tw.html'
              : activeTab === 'cme'
              ? 'https://www.cmegroup.com/market-data/browse-data/commodity-index-prices.html'
              : 'https://www.salmonbusiness.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-base text-[#E7F6FC]/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <span>查看數據來源</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-base text-[#E7F6FC]/70 hover:text-white hover:bg-white/10 transition-all">
            <RefreshCw className="w-4 h-4" />
            <span>刷新</span>
          </button>
        </div>

        {/* Note */}
        <div className="mt-4 text-center">
          <p className="text-base text-[#E7F6FC]/40">
            {activeTab === 'hk' 
              ? '數據來源：香港食物環境衛生署（FEHD），每日更新'
              : activeTab === 'cme'
              ? 'cwt = hundredweight（100磅 ≈ 45.36公斤）'
              : '數據來源：SalmonBusiness、Urner Barry、FRED'}
          </p>
        </div>
      </div>
    </section>
  );
}
