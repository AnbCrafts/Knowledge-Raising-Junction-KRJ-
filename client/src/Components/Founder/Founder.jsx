import React from "react";
import { motion } from "framer-motion";
import { Quote, Award, Linkedin, ArrowRight } from "lucide-react";

const FounderSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* --- Background Texture --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* --- Left Column: Vision & Message --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-0.5 bg-orange-500"></span>
              <span className="text-orange-600 font-bold tracking-wider uppercase text-xs">
                Vision & Leadership
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Built by Educators, <br />
              <span className="text-orange-500">Driven by Results.</span>
            </h2>

            {/* The Main Quote */}
            <div className="relative mb-8">
              <Quote
                size={40}
                className="text-orange-200 absolute -top-4 -left-2 transform -scale-x-100"
              />
              <blockquote className="pl-10 text-xl md:text-2xl text-gray-700 font-serif italic leading-relaxed relative z-10">
                "At KRJ – Knowledge Raising Junction, our mission is to simplify
                learning while maintaining the highest academic standards. We
                believe in disciplined teaching, transparent management, and
                continuous student growth."
              </blockquote>
            </div>

            <div className="space-y-4 text-gray-500 leading-relaxed mb-8">
              <p>
                Education is not just about syllabi; it is about building
                confidence. When I started KRJ, the goal was simple: to create
                an environment where students feel supported by technology and
                guided by experience.
              </p>
              <p>
                We don't just prepare students for exams; we prepare them for
                excellence in every academic pursuit.
              </p>
            </div>

            {/* Signature Area */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div
                  className="text-3xl font-handwriting text-gray-800 mb-1"
                  style={{ fontFamily: "cursive" }}
                >
                  Anubhaw Gupta
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Founder & Director
                </div>
                <div className="text-xs text-gray-500">
                  M.Tech, Computer Science
                </div>
                <div>
                  {" "}
                  {/* edit kar  lena baad me*/}
                  <br />
                  <p> Tm ek kaam karo , ias ki tayyari chhod do </p>
                  <p> chhod do </p>
                  <div className="text-xs text-gray-500"> --Saheb</div>
                </div>
              </div>

              {/* Optional Social Link */}
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0077b5] hover:border-[#0077b5] transition-colors">
                <Linkedin size={18} />
              </button>
            </div>
          </motion.div>

          {/* --- Right Column: Photo & Stats --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Image Frame */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl bg-gray-100 group">
              {/* Placeholder for Founder Image - Replace src with actual image */}
              <img
                src="/api/placeholder/600/750"
                alt="Founder of KRJ"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>

              {/* Floating Experience Badge */}
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg border-l-4 border-orange-500">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 leading-none">
                      15+
                    </p>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
                      Years of Excellence
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-orange-200 rounded-2xl"></div>
            <div className="absolute -z-10 -bottom-6 -left-6 bg-gray-900 text-white py-3 px-6 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2">
              <ArrowRight size={16} className="text-orange-500" />
              Mentored 5000+ Students
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
