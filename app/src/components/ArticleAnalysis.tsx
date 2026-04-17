import { useState } from 'react';
import { 
  Package, 
  BarChart3, 
  TrendingUp, 
  Scale, 
  ChevronDown, 
  ChevronUp,
  Beef,
  Fish,
  Snowflake,
  TrendingDown,
  Minus,
  Globe
} from 'lucide-react';

interface AnalysisProps {
  analysis: {
    products: Array<{
      cn: string;
      en: string;
      category: string;
      confidence: string;
    }>;
    impact: {
      categories: Array<{
        category: string;
        items: Array<{
          en: string;
          cn: string;
          sentiment: string;
        }>;
      }>;
      sentiment: string;
      keyPoints: string[];
    };
    trends: {
      direction: string;
      keywords: Array<{
        en: string;
        cn: string;
        category: string;
      }>;
      forecasts: string[];
    };
    tariff: {
      hasTariff: boolean;
      keywords: Array<{
        en: string;
        cn: string;
        weight: number;
      }>;
      details: Array<{
        type: string;
        value: string;
      }>;
      countries: Array<{
        en: string;
        cn: string;
      }>;
    };
    analyzedAt: string;
  };
}

export default function ArticleAnalysis({ analysis }: AnalysisProps) {
  const [expanded, setExpanded] = useState(false);

  if (!analysis) return null;

  const { products, impact, trends, tariff } = analysis;

  // 获取产品图标
  const getProductIcon = (category: string) => {
    switch (category) {
      case 'meat':
        return <Beef className="w-4 h-4 text-[#F59E0B]" />;
      case 'seafood':
        return <Fish className="w-4 h-4 text-[#2997FF]" />;
      case 'frozen':
        return <Snowflake className="w-4 h-4 text-[#06B6D4]" />;
      case 'livestock':
        return <Package className="w-4 h-4 text-[#8B5CF6]" />;
      default:
        return <Package className="w-4 h-4 text-[#888888]" />;
    }
  };

  // 获取情感图标
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-[#10B981]" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-[#EF4444]" />;
      default:
        return <Minus className="w-4 h-4 text-[#888888]" />;
    }
  };

  // 获取趋势图标
  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'growth':
        return <TrendingUp className="w-5 h-5 text-[#10B981]" />;
      case 'decline':
        return <TrendingDown className="w-5 h-5 text-[#EF4444]" />;
      default:
        return <Minus className="w-5 h-5 text-[#888888]" />;
    }
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      {/* 摘要行 */}
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-wrap">
          {/* 产品标签 */}
          {products.slice(0, 2).map((product) => (
            <span
              key={product.cn}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white/10 text-white/80"
            >
              {getProductIcon(product.category)}
              {product.cn}
            </span>
          ))}
          
          {/* 关税标识 */}
          {tariff.hasTariff && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#EF4444]/20 text-[#EF4444]">
              <Scale className="w-3.5 h-3.5" />
              关税
            </span>
          )}
          
          {/* 情感标识 */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
            impact.sentiment === 'positive' ? 'bg-[#10B981]/20 text-[#10B981]' :
            impact.sentiment === 'negative' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
            'bg-white/10 text-white/60'
          }`}>
            {getSentimentIcon(impact.sentiment)}
            {impact.sentiment === 'positive' ? '正面' : 
             impact.sentiment === 'negative' ? '负面' : '中性'}
          </span>
          
          {/* 趋势标识 */}
          {trends.direction !== 'neutral' && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
              trends.direction === 'growth' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
            }`}>
              {getTrendIcon(trends.direction)}
              {trends.direction === 'growth' ? '看涨' : '看跌'}
            </span>
          )}
        </div>
        
        <button className="p-2 text-white/50 hover:text-white transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* 详细分析 */}
      {expanded && (
        <div className="mt-4 grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* 1. 产品分析 */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#2997FF]/20 flex items-center justify-center">
                <Package className="w-4 h-4 text-[#2997FF]" />
              </div>
              <h4 className="text-sm font-semibold text-white">产品</h4>
            </div>
            
            {products.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {products.map((product) => (
                  <span
                    key={product.cn}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/10 text-white"
                  >
                    {getProductIcon(product.category)}
                    <span>{product.cn}</span>
                    <span className="text-white/50 text-xs">({product.en})</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50">未识别到具体产品</p>
            )}
          </div>

          {/* 2. 影响分析 */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <h4 className="text-sm font-semibold text-white">影响</h4>
            </div>
            
            {impact.categories.length > 0 ? (
              <div className="space-y-2">
                {impact.categories.slice(0, 2).map((cat) => (
                  <div key={cat.category}>
                    <div className="text-xs text-white/50 mb-1 capitalize">{cat.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.items.slice(0, 3).map((item) => (
                        <span
                          key={item.en}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                            item.sentiment === 'positive' ? 'bg-[#10B981]/20 text-[#10B981]' :
                            item.sentiment === 'negative' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                            'bg-white/10 text-white/70'
                          }`}
                        >
                          {item.cn}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50">未识别到显著影响</p>
            )}
          </div>

          {/* 3. 未来趋势 */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <h4 className="text-sm font-semibold text-white">未来趋势</h4>
            </div>
            
            {trends.keywords.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getTrendIcon(trends.direction)}
                  <span className={`text-sm font-medium ${
                    trends.direction === 'growth' ? 'text-[#10B981]' :
                    trends.direction === 'decline' ? 'text-[#EF4444]' :
                    'text-white/70'
                  }`}>
                    {trends.direction === 'growth' ? '上升趋势' :
                     trends.direction === 'decline' ? '下降趋势' : '趋势不明'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {trends.keywords.slice(0, 4).map((kw) => (
                    <span
                      key={kw.en}
                      className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/70"
                    >
                      {kw.cn}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/50">未识别到明确趋势</p>
            )}
          </div>

          {/* 4. 关税分析 */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                tariff.hasTariff ? 'bg-[#EF4444]/20' : 'bg-white/10'
              }`}>
                <Scale className={`w-4 h-4 ${tariff.hasTariff ? 'text-[#EF4444]' : 'text-white/50'}`} />
              </div>
              <h4 className="text-sm font-semibold text-white">关税</h4>
            </div>
            
            {tariff.hasTariff ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {tariff.keywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw.en}
                      className="px-2 py-0.5 rounded text-xs bg-[#EF4444]/20 text-[#EF4444]"
                    >
                      {kw.cn}
                    </span>
                  ))}
                </div>
                {tariff.countries.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <Globe className="w-3 h-3" />
                    <span>涉及: {tariff.countries.slice(0, 3).map(c => c.cn).join('、')}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-white/50">未涉及关税内容</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
