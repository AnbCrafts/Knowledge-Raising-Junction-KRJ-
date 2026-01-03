import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/KRJ_logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Moon,
  Sun,
  UserCircle,
} from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About KRJ", href: "#" },
    { name: "Courses", href: "#" },
    { name: "Our Faculty", href: "#" },
    { name: "Student Zone", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
            : "bg-white border-b border-gray-50 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* --- Logo Area --- */}
            <div className="flex flex-col justify-center cursor-pointer group">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-white-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                  <span className="font-bold text-xl tracking-tighter">
                    <img src={logo} alt="" />
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                    KRJ
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider leading-tight mt-0.5">
                    Knowledge Raising Junction
                  </span>
                </div>
              </div>
            </div>

            {/* --- Desktop Navigation --- */}
            <nav className="hidden xl:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors relative group py-2"
                >
                  {link.name}
                  {/* Hover Underline Animation */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* --- Desktop Actions --- */}
            <div className="hidden md:flex items-center space-x-3">
              {/* WhatsApp / Contact Icon */}
              <button
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle size={20} />
              </button>

              {/* Theme Toggle (Optional) */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              {/* Secondary CTA: Login/Logout/Profile */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors px-3 py-2">
                    <span>Hi, {user.fullName?.split(" ")[0]}</span>
                    <UserCircle size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Profile
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors px-3 py-2"
                >
                  <UserCircle size={18} />
                  Login
                </button>
              )}

              {/* Primary CTA: Enquiry */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-5 rounded-full shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <Phone size={16} className="fill-white/20" />
                Book Counselling
              </motion.button>
            </div>

            {/* --- Mobile Menu Toggle --- */}
            <div className="xl:hidden flex items-center gap-4">
              {/* Show basic CTA on mobile header too */}
              <button className="md:hidden p-2 text-orange-500 bg-orange-50 rounded-full">
                <Phone size={20} />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-orange-500 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* --- Mobile Navigation Dropdown --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden fixed top-[72px] left-0 right-0 bg-white border-b border-gray-100 shadow-xl z-40 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-lg transition-colors border-l-4 border-transparent hover:border-orange-500"
                >
                  {link.name}
                </a>
              ))}

              <hr className="border-gray-100 my-4" />

              <div className="flex flex-col gap-3 px-2">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center justify-center gap-2 text-gray-700 font-semibold py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <UserCircle size={20} />
                      My Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 text-gray-700 font-semibold py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 text-gray-700 font-semibold py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle size={20} />
                    Student Login
                  </button>
                )}
                <button className="w-full text-center bg-orange-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-orange-600 transition-colors">
                  Book Free Counselling
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
