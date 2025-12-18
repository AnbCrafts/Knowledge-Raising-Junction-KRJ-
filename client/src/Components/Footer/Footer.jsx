import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MessageCircle,
  ArrowUpRight,
  Layers
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    quick: [
      { name: "About KRJ", href: "#" },
      { name: "Our Courses", href: "#" },
      { name: "Meet the Faculty", href: "#" },
      { name: "Admissions", href: "#" },
      { name: "Careers", href: "#" },
    ],
    portals: [
      { name: "Student Login", href: "#" },
      { name: "Teacher Login", href: "#" },
      { name: "Parent Portal", href: "#" },
      { name: "Online Tests", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms & Conditions", href: "#" },
      { name: "Refund Policy", href: "#" },
    ]
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Main Footer Content --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-white">
                  <span className="font-bold text-sm tracking-tighter">KRJ</span>
               </div>
               <span className="text-xl font-bold tracking-tight">
                 KRJ <span className="text-orange-500">Institute</span>
               </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Knowledge Raising Junction (KRJ) is dedicated to building strong academic foundations through disciplined teaching and modern technology.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {links.quick.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-orange-500 text-sm flex items-center gap-2 transition-colors group">
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-orange-500 transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portals (Logins) */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Portals</h4>
            <ul className="space-y-3">
              {links.portals.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-orange-500 text-sm flex items-center gap-2 transition-colors">
                    <ArrowUpRight size={14} className="opacity-50" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <span>
                  123, Education Hub, Sector 4,<br />
                  New Delhi, India - 110001
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group cursor-pointer">
                <Phone size={18} className="text-orange-500 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group cursor-pointer">
                <Mail size={18} className="text-orange-500 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">admissions@krj.edu.in</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group cursor-pointer">
                <MessageCircle size={18} className="text-green-500" />
                <span className="text-green-500 font-medium">Chat on WhatsApp</span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- Divider --- */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* --- Bottom Bar --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Knowledge Raising Junction. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            {links.legal.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-500 hover:text-orange-500 text-sm transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;