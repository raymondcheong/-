import { Snowflake, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = [
  { name: '首頁', href: '#hero' },
  { name: '市場數據', href: '#market' },
  { name: '市場情報', href: '#business-dashboard' },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative border-t border-white/10">
      <div className="w-full px-6 lg:px-12 xl:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2997FF] to-[#006F9A] flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">
                Trade<span className="text-[#2997FF]">News</span>
              </span>
            </div>
            <p className="text-lg text-[#E7F6FC]/60">
              香港凍肉海產貿易資訊平台
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-xl mb-5">快速導航</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-lg text-[#E7F6FC]/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xl mb-5">聯繫我們</h4>
            <div className="space-y-3 text-lg text-[#E7F6FC]/60">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#2997FF]" />
                <span>zhangkailiang12@nfh.hk</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#2997FF]" />
                <span>+86 18825146113</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#2997FF]" />
                <span>大角咀欽州街89號潤發大廈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-base text-[#E7F6FC]/40">
            數據來源：香港食物環境衛生署、CME Group
          </p>
        </div>
      </div>
    </footer>
  );
}
