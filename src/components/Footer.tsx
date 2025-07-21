
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <span className="text-xl font-medium text-black tracking-tight">
                Rarity Leads
              </span>
            </div>
            <p className="text-gray-600 max-w-md leading-relaxed text-sm">
              Transform your B2B prospecting with AI-powered client acquisition systems. 
              Stop chasing leads and start attracting premium prospects automatically.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-black mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/prospecting" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Prospecting
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-black mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-gray-600 text-sm">
                hello@rarityleads.com
              </li>
              <li className="text-gray-600 text-sm">
                +55 (11) 9999-9999
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 RARITY LEADS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
