import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.char');
        gsap.fromTo(
          chars,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.02,
            ease: 'expo.out',
            delay: 0.1,
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const titleText = '凍肉海產資訊';

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-[35vh] min-h-[180px] flex items-center justify-center overflow-hidden"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 text-center">
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-['Poppins'] leading-tight"
        >
          <span className="overflow-hidden inline-block">
            {titleText.split('').map((char, index) => (
              <span
                key={index}
                className="char inline-block text-gradient"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>
      </div>
    </section>
  );
}
