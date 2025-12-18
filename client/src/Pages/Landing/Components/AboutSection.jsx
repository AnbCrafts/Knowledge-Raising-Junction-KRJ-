import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Compass, Laptop, ArrowRight, Award } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      title: "Result-Oriented Teaching",
      description: "Focus on outcomes and performance metrics.",
      icon: Target,
    },
    {
      title: "Personal Attention",
      description: "Small batch sizes for individual guidance.",
      icon: Users,
    },
    {
      title: "Structured Academic Planning",
      description: "Systematic syllabus coverage and revision.",
      icon: Compass,
    },
    {
      title: "Technology-Supported Learning",
      description: "Smart tools for modern education.",
      icon: Laptop,
    },
  ];

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Left Column: Content --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wide mb-6">
              Who We Are
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              About <span className="text-orange-500">Knowledge Raising Junction</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Knowledge Raising Junction (KRJ) is a dedicated coaching institute focused on building strong academic foundations and delivering results through disciplined teaching, experienced educators, and student-centric methodologies.
            </p>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group">
              Learn more about our vision 
              <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* --- Right Column: Visual Composition --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image Placeholder (Abstract Education Theme) */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white aspect-[4/3] border-4 border-white">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
              
              {/* Decorative Geometric Patterns representing "Structure" */}
              <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-orange-50 rounded-bl-[100px] z-0"></div>
              <div className="absolute bottom-10 left-10 right-10 top-10 border-2 border-dashed border-gray-300 rounded-xl z-10 flex flex-col items-center justify-center text-center p-6">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-orange-500">
                    <Award size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800">Commitment to Excellence</h3>
                 <p className="text-sm text-gray-500 mt-2">Shaping futures with dedication since inception.</p>
              </div>

              {/* Floating Badge */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="absolute bottom-6 right-6 bg-gray-900 text-white p-4 rounded-xl shadow-xl z-20 max-w-[160px]"
              >
                 <div className="text-3xl font-bold text-orange-500">100%</div>
                 <div className="text-xs font-medium text-gray-300 uppercase tracking-wider mt-1">Dedication to Student Success</div>
              </motion.div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute -z-10 top-10 -right-10 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-50"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-50"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;