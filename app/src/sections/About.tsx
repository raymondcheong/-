import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  '實時全球市場數據',
  '精準價格趨勢分析',
  '權威行業資訊報道',
  '專業貿易諮詢服務',
];

const stats = [
  { icon: Globe, value: '150+', label: '合作國家' },
  { icon: Zap, value: '10萬+', label: '日活躍用戶' },
  { icon: Shield, value: '8年', label: '行業經驗' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);
  const [hoveredFragment, setHoveredFragment] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text word fade in
      const words = textRef.current?.querySelectorAll('.word');
      if (words) {
        gsap.fromTo(
          words,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Fragments converge animation
      const fragments = fragmentsRef.current?.querySelectorAll('.fragment');
      if (fragments) {
        gsap.fromTo(
          fragments,
          { scale: 0, opacity: 0, rotation: gsap.utils.random(-20, 20) },
          {
            scale: 1,
            opacity: 1,
            rotation: gsap.utils.random(-5, 5),
            duration: 1,
            stagger: 0.2,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: fragmentsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Parallax effect for fragments
      if (fragments) {
        fragments.forEach((fragment, index) => {
          const speed = index % 2 === 0 ? -100 : -40;
          gsap.to(fragment, {
            y: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
      }

      // Stats animation
      const statItems = sectionRef.current?.querySelectorAll('.stat-item');
      if (statItems) {
        gsap.fromTo(
          statItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: statItems[0],
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleWords = '連接全球凍肉市場'.split('');

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#006F9A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#2997FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content - Text */}
          <div ref={textRef} className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] text-white mb-6">
                {titleWords.map((char, index) => (
                  <span
                    key={index}
                    className={`word inline-block ${char === ' ' ? 'w-4' : ''}`}
                  >
                    {char === ' ' ? '' : char}
                  </span>
                ))}
              </h2>
              <p className="word text-lg text-[#E7F6FC]/80 leading-relaxed">
                我們是香港凍肉門店及貿易商獲取肉類海產貿易洞察的可靠來源。通過整合全球數據源，
                我們提供實時市場價格、行業趨勢分析及權威資訊報道，
                幫助貿易商、進口商及出口商做出明智決策。
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="word flex items-center gap-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2997FF]/20 flex items-center justify-center group-hover:bg-[#2997FF]/30 transition-colors duration-300">
                    <CheckCircle className="w-4 h-4 text-[#2997FF]" />
                  </div>
                  <span className="text-[#E7F6FC]/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="word">
              <button className="group px-8 py-4 bg-gradient-to-r from-[#2997FF] to-[#006F9A] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-[#2997FF]/40 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                了解更多
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Content - Floating Fragments */}
          <div
            ref={fragmentsRef}
            className="relative h-[500px] lg:h-[600px]"
          >
            {/* Fragment 1 - Top */}
            <div
              className={`fragment absolute top-[5%] right-[10%] w-64 h-44 rounded-2xl overflow-hidden glass transition-all duration-500 cursor-pointer ${
                hoveredFragment === 1
                  ? 'scale-110 z-50 rotate-0 shadow-xl shadow-[#2997FF]/30'
                  : hoveredFragment !== null
                  ? 'blur-sm'
                  : 'rotate-3'
              }`}
              onMouseEnter={() => setHoveredFragment(1)}
              onMouseLeave={() => setHoveredFragment(null)}
              style={{ transformOrigin: 'center center' }}
            >
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop"
                alt="冷庫設施"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#023A52]/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs text-[#2997FF] font-medium">冷鏈物流</span>
                <p className="text-white font-semibold">現代化倉儲</p>
              </div>
            </div>

            {/* Fragment 2 - Middle Left */}
            <div
              className={`fragment absolute top-[35%] left-[5%] w-56 h-40 rounded-2xl overflow-hidden glass transition-all duration-500 cursor-pointer ${
                hoveredFragment === 2
                  ? 'scale-110 z-50 rotate-0 shadow-xl shadow-[#2997FF]/30'
                  : hoveredFragment !== null
                  ? 'blur-sm'
                  : '-rotate-3'
              }`}
              onMouseEnter={() => setHoveredFragment(2)}
              onMouseLeave={() => setHoveredFragment(null)}
              style={{ transformOrigin: 'center center' }}
            >
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                alt="運輸船隻"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#023A52]/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs text-[#2997FF] font-medium">海運物流</span>
                <p className="text-white font-semibold">全球運輸網絡</p>
              </div>
            </div>

            {/* Fragment 3 - Bottom Right */}
            <div
              className={`fragment absolute top-[60%] right-[15%] w-60 h-42 rounded-2xl overflow-hidden glass transition-all duration-500 cursor-pointer ${
                hoveredFragment === 3
                  ? 'scale-110 z-50 rotate-0 shadow-xl shadow-[#2997FF]/30'
                  : hoveredFragment !== null
                  ? 'blur-sm'
                  : 'rotate-2'
              }`}
              onMouseEnter={() => setHoveredFragment(3)}
              onMouseLeave={() => setHoveredFragment(null)}
              style={{ transformOrigin: 'center center' }}
            >
              <img
                src="https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&h=400&fit=crop"
                alt="產品展示"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#023A52]/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs text-[#2997FF] font-medium">品質保證</span>
                <p className="text-white font-semibold">優質產品</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2997FF]/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-3 gap-6 lg:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="stat-item text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#2997FF]/20 to-[#006F9A]/20 mb-4">
                  <Icon className="w-6 h-6 text-[#2997FF]" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#E7F6FC]/60">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
