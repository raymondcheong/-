import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Fish,
  Beef,
  Globe,
  Activity
} from 'lucide-react';
import { getDashboard } from '../services/newsApi';

gsap.registerPlugin(ScrollTrigger);

interface DashboardData {
  latestNews: any[];
  stats: any;
  summary: {
    totalArticles: number;
    seafoodCount: number;
    meatCount: number;
    last7Days: number;
    last30Days: number;
    topKeywords: [string, number][];
  };
}

export default function Analytics() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await getDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = chartsRef.current?.querySelectorAll('.chart-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: chartsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  // 计算百分比
  const calculatePercent = (value: number, total: number) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <section className="py-24 lg:py-32">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-white/10 rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-white/10 rounded-2xl" />
              <div className="h-80 bg-white/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const { summary, stats } = data;
  const totalKeywords = summary.seafoodCount + summary.meatCount;
  const seafoodPercent = calculatePercent(summary.seafoodCount, totalKeywords);
  const meatPercent = calculatePercent(summary.meatCount, totalKeywords);

  return (
    <section
      id="analytics"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2997FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] text-white mb-4">
            数据<span className="text-gradient">分析</span>
          </h2>
          <p className="text-[#E7F6FC]/70 text-lg max-w-2xl mx-auto">
            基于抓取数据的智能分析，洞察行业趋势
          </p>
        </div>

        {/* Charts Grid */}
        <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="chart-card glass rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#2997FF]/20 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-[#2997FF]" />
              </div>
              <h3 className="text-xl font-semibold text-white">内容分类分布</h3>
            </div>

            <div className="space-y-6">
              {/* Seafood Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Fish className="w-5 h-5 text-[#2997FF]" />
                    <span className="text-white">水产</span>
                  </div>
                  <span className="text-[#2997FF] font-semibold">
                    {summary.seafoodCount} ({seafoodPercent}%)
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2997FF] to-[#006F9A] rounded-full transition-all duration-1000"
                    style={{ width: `${seafoodPercent}%` }}
                  />
                </div>
              </div>

              {/* Meat Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Beef className="w-5 h-5 text-[#10B981]" />
                    <span className="text-white">肉类</span>
                  </div>
                  <span className="text-[#10B981] font-semibold">
                    {summary.meatCount} ({meatPercent}%)
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-1000"
                    style={{ width: `${meatPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{summary.seafoodCount}</div>
                <div className="text-sm text-[#E7F6FC]/60">水产文章</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{summary.meatCount}</div>
                <div className="text-sm text-[#E7F6FC]/60">肉类文章</div>
              </div>
            </div>
          </div>

          {/* Update Trend */}
          <div className="chart-card glass rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-semibold text-white">更新趋势</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-5 text-center">
                <div className="text-4xl font-bold text-[#F59E0B] mb-2">
                  {summary.last7Days}
                </div>
                <div className="text-sm text-[#E7F6FC]/60 mb-1">近7天更新</div>
                <div className="flex items-center justify-center gap-1 text-xs text-[#10B981]">
                  <TrendingUp className="w-3 h-3" />
                  活跃
                </div>
              </div>
              <div className="glass rounded-xl p-5 text-center">
                <div className="text-4xl font-bold text-[#2997FF] mb-2">
                  {summary.last30Days}
                </div>
                <div className="text-sm text-[#E7F6FC]/60 mb-1">近30天更新</div>
                <div className="flex items-center justify-center gap-1 text-xs text-[#10B981]">
                  <TrendingUp className="w-3 h-3" />
                  持续增长
                </div>
              </div>
            </div>

            {/* Daily Average */}
            <div className="mt-6 glass rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-[#E7F6FC]/70">日均更新</span>
                <span className="text-2xl font-bold text-white">
                  {summary.last30Days > 0 ? Math.round(summary.last30Days / 30) : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Article Types */}
          <div className="chart-card glass rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-semibold text-white">文章类型分布</h3>
            </div>

            {stats?.byType && (
              <div className="space-y-4">
                {Object.entries(stats.byType as Record<string, number>)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([type, count], index) => {
                    const colors = ['#2997FF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444'];
                    const color = colors[index % colors.length];
                    const percent = calculatePercent(count, summary.totalArticles);
                    
                    const typeLabels: Record<string, string> = {
                      news: '新闻',
                      analysis: '分析',
                      price: '价格',
                      market: '市场',
                      trade: '贸易',
                      policy: '政策',
                    };
                    
                    return (
                      <div key={type} className="flex items-center gap-4">
                        <div className="w-20 text-sm text-[#E7F6FC]/70 capitalize">
                          {typeLabels[type] || type}
                        </div>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${percent}%`, backgroundColor: color }}
                          />
                        </div>
                        <div className="w-12 text-right text-sm text-white font-medium">
                          {count}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Top Keywords */}
          <div className="chart-card glass rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EC4899]/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#EC4899]" />
              </div>
              <h3 className="text-xl font-semibold text-white">热门话题</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {summary.topKeywords?.slice(0, 10).map(([keyword, count], index) => {
                const [cn] = keyword.split(/[()]/);
                const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg'];
                const size = sizes[Math.min(index, sizes.length - 1)];
                const opacity = Math.max(0.4, 1 - index * 0.08);
                
                return (
                  <span
                    key={keyword}
                    className={`${size} px-3 py-1.5 glass rounded-full text-white hover:bg-white/20 transition-all duration-300 cursor-default`}
                    style={{ opacity }}
                  >
                    {cn?.trim()}
                    <span className="ml-1 text-[#E7F6FC]/50">({count})</span>
                  </span>
                );
              })}
            </div>

            {/* Source Info */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#E7F6FC]/60">数据来源</span>
                <span className="text-white">SeafoodNews.com</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-[#E7F6FC]/60">最后更新</span>
                <span className="text-white">
                  {stats?.lastUpdate
                    ? new Date(stats.lastUpdate).toLocaleString('zh-CN')
                    : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
