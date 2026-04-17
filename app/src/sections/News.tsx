import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Clock, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  views: string;
  image: string;
  featured?: boolean;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: '全球海鲜贸易峰会2024：可持续发展成焦点',
    excerpt: '来自80多个国家的行业领袖齐聚新加坡，共同探讨海鲜贸易的可持续发展路径。会议强调了可追溯性和环保捕捞的重要性，并达成多项国际合作共识。',
    category: '行业峰会',
    date: '2024-01-15',
    readTime: '8分钟',
    views: '12.5K',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: '牛肉出口创历史新高，澳洲对华贸易激增',
    excerpt: '最新数据显示，澳洲牛肉对华出口量同比增长45%，创历史新高。',
    category: '贸易数据',
    date: '2024-01-14',
    readTime: '5分钟',
    views: '8.2K',
    image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title: '可持续捕捞实践：挪威三文鱼产业领先全球',
    excerpt: '挪威通过创新技术实现三文鱼养殖的碳中和目标。',
    category: '可持续发展',
    date: '2024-01-13',
    readTime: '6分钟',
    views: '6.8K',
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    title: '中国进口冷链物流新规解读',
    excerpt: '新的冷链物流标准将对进口冻肉和水产产生深远影响。',
    category: '政策法规',
    date: '2024-01-12',
    readTime: '4分钟',
    views: '15.3K',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    title: '厄瓜多尔白虾产量预计增长20%',
    excerpt: '新养殖季开启，厄瓜多尔白虾出口前景乐观。',
    category: '产量预测',
    date: '2024-01-11',
    readTime: '3分钟',
    views: '5.1K',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=600&fit=crop',
  },
];

export default function News() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const sideCardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
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

      // Featured image scale reveal
      const featuredImage = featuredRef.current?.querySelector('.featured-image');
      if (featuredImage) {
        gsap.fromTo(
          featuredImage,
          { scale: 1.2, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: featuredRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Featured text slide up
      const featuredText = featuredRef.current?.querySelector('.featured-text');
      if (featuredText) {
        gsap.fromTo(
          featuredText,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.3,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: featuredRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Side cards slide in
      const sideCards = sideCardsRef.current?.querySelectorAll('.side-card');
      if (sideCards) {
        gsap.fromTo(
          sideCards,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sideCardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Parallax effect for featured image
      if (featuredImage) {
        gsap.to(featuredImage, {
          y: 50,
          ease: 'none',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featuredNews = newsData.find((item) => item.featured);
  const sideNews = newsData.filter((item) => !item.featured);

  return (
    <section
      id="news"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#2997FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2
              ref={titleRef}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] text-white mb-4"
            >
              最新<span className="text-gradient">资讯</span>
            </h2>
            <p className="text-[#E7F6FC]/70 text-lg max-w-xl">
              掌握行业动态，洞察市场趋势
            </p>
          </div>
          <button className="mt-4 sm:mt-0 group flex items-center gap-2 text-[#2997FF] hover:text-white transition-colors duration-300">
            查看全部资讯
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* News Grid - Asymmetric Layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Featured Article - Takes 3 columns */}
          {featuredNews && (
            <div
              ref={featuredRef}
              className="lg:col-span-3 group cursor-pointer"
              onMouseEnter={() => setHoveredCard(featuredNews.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full glass rounded-2xl overflow-hidden">
                {/* Image Container */}
                <div className="relative h-64 lg:h-80 overflow-hidden">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className={`featured-image w-full h-full object-cover transition-transform duration-700 ${
                      hoveredCard === featuredNews.id ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#023A52] via-[#023A52]/50 to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 px-4 py-1.5 bg-[#2997FF] text-white text-sm font-medium rounded-full">
                    {featuredNews.category}
                  </span>
                </div>

                {/* Content */}
                <div className="featured-text p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-[#2997FF] transition-colors duration-300">
                    {featuredNews.title}
                  </h3>
                  <p className="text-[#E7F6FC]/70 mb-4 line-clamp-2">
                    {featuredNews.excerpt}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-[#E7F6FC]/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredNews.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredNews.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredNews.views}
                    </span>
                  </div>

                  {/* Read More Link */}
                  <div
                    className={`mt-4 flex items-center gap-2 text-[#2997FF] font-medium transition-all duration-300 ${
                      hoveredCard === featuredNews.id
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    阅读全文
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Underline Animation */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#2997FF] to-[#006F9A] transition-all duration-500 ${
                    hoveredCard === featuredNews.id ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Side Articles - Takes 2 columns */}
          <div ref={sideCardsRef} className="lg:col-span-2 space-y-4">
            {sideNews.map((item) => (
              <div
                key={item.id}
                className="side-card group cursor-pointer"
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`glass rounded-xl overflow-hidden transition-all duration-500 ${
                    hoveredCard === item.id
                      ? 'bg-white/15 shadow-lg shadow-[#2997FF]/10'
                      : ''
                  }`}
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          hoveredCard === item.id
                            ? 'scale-110 saturate-100'
                            : 'scale-100 saturate-75'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-[#2997FF] font-medium">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-semibold text-white mt-1 mb-2 line-clamp-2 group-hover:text-[#2997FF] transition-colors duration-300">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-[#E7F6FC]/50">
                        <span>{item.date}</span>
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      hoveredCard === item.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-[#E7F6FC]/70 mb-3 line-clamp-2">
                        {item.excerpt}
                      </p>
                      <button className="flex items-center gap-2 text-[#2997FF] text-sm font-medium hover:underline">
                        阅读更多
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
