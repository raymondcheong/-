import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Package, 
  Globe, 
  TrendingUp, 
  Scale, 
  ExternalLink,
  Beef,
  Fish,
  ArrowRight,
  BarChart3,
  MapPin,
  FileText
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// 模拟分析报告数据
const mockAnalysisReport = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalArticles: 24,
    meatArticles: 12,
    seafoodArticles: 12,
    tariffRelated: 5,
    priceRelated: 8,
  },
  products: [
    { cn: '牛肉', en: 'beef', count: 8, category: 'meat' },
    { cn: '三文鱼', en: 'salmon', count: 5, category: 'seafood' },
    { cn: '虾', en: 'shrimp', count: 4, category: 'seafood' },
    { cn: '活牛', en: 'cattle', count: 3, category: 'meat' },
    { cn: '蟹', en: 'crab', count: 3, category: 'seafood' },
    { cn: '金枪鱼', en: 'tuna', count: 2, category: 'seafood' },
  ],
  regions: [
    { cn: '澳大利亚', en: 'australia', count: 10 },
    { cn: '美国', en: 'usa', count: 8 },
    { cn: '中国', en: 'china', count: 6 },
    { cn: '日本', en: 'japan', count: 4 },
    { cn: '欧盟', en: 'eu', count: 3 },
  ],
  template: {
    products: {
      title: '产品分析',
      content: '牛肉(beef): 8 篇相关报道；三文鱼(salmon): 5 篇相关报道；虾(shrimp): 4 篇相关报道',
      topProducts: [
        { name: '牛肉', en: 'beef', count: 8 },
        { name: '三文鱼', en: 'salmon', count: 5 },
        { name: '虾', en: 'shrimp', count: 4 },
      ],
      summary: '近期重点关注的产品包括: 牛肉、三文鱼、虾',
    },
    impact: {
      title: '市场影响',
      content: '关税政策相关报道 5 篇，主要涉及: 关税、贸易壁垒、限制',
      tariffCount: 5,
      keyIssues: [
        { en: 'tariff', cn: '关税' },
        { en: 'trade barrier', cn: '贸易壁垒' },
        { en: 'restriction', cn: '限制' },
      ],
    },
    trends: {
      title: '未来全球趋势',
      content: '主要市场: 澳大利亚、美国、中国；价格相关报道 8 篇',
      keyMarkets: [
        { name: '澳大利亚', en: 'australia', count: 10 },
        { name: '美国', en: 'usa', count: 8 },
        { name: '中国', en: 'china', count: 6 },
        { name: '日本', en: 'japan', count: 4 },
        { name: '欧盟', en: 'eu', count: 3 },
      ],
      priceTrends: '市场价格波动受到关注',
    },
    tariff: {
      title: '关税与贸易政策',
      content: 'US reveals start date for tariff refund process; Australia beef export to China increases',
      relatedArticles: [
        { title: 'US reveals start date for tariff refund process', source: 'SeafoodSource' },
        { title: 'Australia beef export hits new record', source: 'Beef Central' },
      ],
    },
  },
};

export default function AnalysisReport() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'impact' | 'trends' | 'tariff'>('products');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.report-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const report = mockAnalysisReport;
  const template = report.template;

  const tabs = [
    { key: 'products', label: '产品分析', icon: Package },
    { key: 'impact', label: '市场影响', icon: BarChart3 },
    { key: 'trends', label: '全球趋势', icon: Globe },
    { key: 'tariff', label: '关税政策', icon: Scale },
  ] as const;

  return (
    <section
      id="analysis-report"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#2997FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2997FF]/10 rounded-full mb-6">
            <FileText className="w-4 h-4 text-[#2997FF]" />
            <span className="text-sm text-[#2997FF]">AI 智能分析报告</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] text-white mb-4">
            市场<span className="text-gradient">分析报告</span>
          </h2>
          <p className="text-[#E7F6FC]/70 text-lg max-w-2xl mx-auto">
            基于 Beef Central 和 SeafoodSource 数据的智能分析
          </p>
          <p className="text-sm text-[#E7F6FC]/50 mt-2">
            生成时间: {new Date(report.generatedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="glass rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-white mb-1">{report.summary.totalArticles}</div>
            <div className="text-sm text-[#E7F6FC]/60">分析文章</div>
          </div>
          <div className="glass rounded-xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Beef className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-3xl font-bold text-[#F59E0B]">{report.summary.meatArticles}</span>
            </div>
            <div className="text-sm text-[#E7F6FC]/60">肉类相关</div>
          </div>
          <div className="glass rounded-xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Fish className="w-5 h-5 text-[#2997FF]" />
              <span className="text-3xl font-bold text-[#2997FF]">{report.summary.seafoodArticles}</span>
            </div>
            <div className="text-sm text-[#E7F6FC]/60">水产相关</div>
          </div>
          <div className="glass rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-[#EF4444] mb-1">{report.summary.tariffRelated}</div>
            <div className="text-sm text-[#E7F6FC]/60">关税相关</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-[#2997FF] text-white shadow-lg shadow-[#2997FF]/30'
                    : 'glass text-[#E7F6FC]/70 hover:bg-white/15'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Report Content */}
        <div ref={cardsRef} className="space-y-6">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="report-card glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#2997FF]/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#2997FF]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{template.products.title}</h3>
                  <p className="text-[#E7F6FC]/60">{template.products.summary}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.products.map((product) => (
                  <div
                    key={product.en}
                    className="glass rounded-xl p-5 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {product.category === 'meat' ? (
                          <Beef className="w-5 h-5 text-[#F59E0B]" />
                        ) : (
                          <Fish className="w-5 h-5 text-[#2997FF]" />
                        )}
                        <span className="text-lg font-semibold text-white">{product.cn}</span>
                      </div>
                      <span className="text-2xl font-bold text-[#2997FF]">{product.count}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2997FF] to-[#006F9A] rounded-full transition-all duration-700"
                        style={{ width: `${(product.count / 8) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm text-[#E7F6FC]/50">{product.en}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impact Tab */}
          {activeTab === 'impact' && (
            <div className="report-card glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#EF4444]/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{template.impact.title}</h3>
                  <p className="text-[#E7F6FC]/60">{template.impact.content}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">关键议题</h4>
                  <div className="space-y-3">
                    {template.impact.keyIssues.map((issue, index) => (
                      <div
                        key={issue.en}
                        className="flex items-center gap-3 p-4 glass rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#EF4444]/20 flex items-center justify-center">
                          <span className="text-[#EF4444] font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <span className="text-white font-medium">{issue.cn}</span>
                          <span className="text-[#E7F6FC]/50 text-sm ml-2">({issue.en})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">关税影响评估</h4>
                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#E7F6FC]/70">关税相关文章</span>
                      <span className="text-3xl font-bold text-[#EF4444]">{report.summary.tariffRelated}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B] rounded-full"
                        style={{ width: `${(report.summary.tariffRelated / report.summary.totalArticles) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-[#E7F6FC]/60">
                      占总文章数的 {((report.summary.tariffRelated / report.summary.totalArticles) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="report-card glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{template.trends.title}</h3>
                  <p className="text-[#E7F6FC]/60">{template.trends.content}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">主要市场</h4>
                  <div className="space-y-3">
                    {report.regions.map((region) => (
                      <div
                        key={region.en}
                        className="flex items-center gap-3 p-4 glass rounded-xl"
                      >
                        <MapPin className="w-5 h-5 text-[#10B981]" />
                        <div className="flex-1">
                          <span className="text-white font-medium">{region.cn}</span>
                          <span className="text-[#E7F6FC]/50 text-sm ml-2">({region.en})</span>
                        </div>
                        <span className="text-[#10B981] font-bold">{region.count} 篇</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">价格趋势</h4>
                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-8 h-8 text-[#F59E0B]" />
                      <div>
                        <div className="text-white font-medium">{template.trends.priceTrends}</div>
                        <div className="text-sm text-[#E7F6FC]/50">
                          价格相关文章: {report.summary.priceRelated} 篇
                        </div>
                      </div>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-full"
                        style={{ width: `${(report.summary.priceRelated / report.summary.totalArticles) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 glass rounded-xl p-6">
                    <h5 className="text-white font-medium mb-3">未来展望</h5>
                    <ul className="space-y-2 text-[#E7F6FC]/70">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-[#10B981] mt-1 flex-shrink-0" />
                        <span>澳大利亚牛肉出口预计持续增长</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-[#10B981] mt-1 flex-shrink-0" />
                        <span>中国市场对高端海鲜需求上升</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-[#10B981] mt-1 flex-shrink-0" />
                        <span>关税政策变动需持续关注</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tariff Tab */}
          {activeTab === 'tariff' && (
            <div className="report-card glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{template.tariff.title}</h3>
                  <p className="text-[#E7F6FC]/60">{template.tariff.content}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">相关文章</h4>
                {template.tariff.relatedArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#8B5CF6]" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{article.title}</div>
                        <div className="text-sm text-[#E7F6FC]/50">来源: {article.source}</div>
                      </div>
                    </div>
                    <button className="p-2 text-[#2997FF] hover:text-white transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 glass rounded-xl border border-[#8B5CF6]/30">
                <h4 className="text-lg font-semibold text-white mb-4">关税政策要点</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-2" />
                    <div>
                      <div className="text-white font-medium">美国关税退款</div>
                      <div className="text-sm text-[#E7F6FC]/60">退款流程即将启动</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-2" />
                    <div>
                      <div className="text-white font-medium">中澳贸易</div>
                      <div className="text-sm text-[#E7F6FC]/60">牛肉出口持续增长</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-2" />
                    <div>
                      <div className="text-white font-medium">欧盟政策</div>
                      <div className="text-sm text-[#E7F6FC]/60">水产养殖新规</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-2" />
                    <div>
                      <div className="text-white font-medium">日本市场</div>
                      <div className="text-sm text-[#E7F6FC]/60">海鲜进口需求强劲</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
