import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Newspaper } from 'lucide-react';

import FluidBackground from './components/FluidBackground';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import MarketData from './sections/MarketData';
import BusinessDashboard from './sections/BusinessDashboard';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [activeSection, setActiveSection] = useState<'market' | 'news'>('market');

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    ScrollTrigger.refresh();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollToSection = (section: 'market' | 'news') => {
    setActiveSection(section);
    const element = document.getElementById(section === 'market' ? 'market' : 'business-dashboard');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen grain-overlay">
      <FluidBackground />
      <Navigation />

      <main className="relative">
        <Hero />
        
        <div className="sticky top-14 z-40 w-full px-6 lg:px-12 xl:px-20 py-3 bg-[#0a0a0a]/90 backdrop-blur-xl border-y border-white/5">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 p-1.5 glass rounded-xl">
              <button
                onClick={() => scrollToSection('market')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  activeSection === 'market'
                    ? 'bg-[#10B981] text-white'
                    : 'text-[#E7F6FC]/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>市場數據</span>
              </button>
              <button
                onClick={() => scrollToSection('news')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  activeSection === 'news'
                    ? 'bg-[#2997FF] text-white'
                    : 'text-[#E7F6FC]/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Newspaper className="w-5 h-5" />
                <span>市場情報</span>
              </button>
            </div>
          </div>
        </div>

        <MarketData />
        <BusinessDashboard />
        <Footer />
      </main>
    </div>
  );
}

export default App;
