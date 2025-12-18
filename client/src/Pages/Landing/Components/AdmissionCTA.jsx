import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, PenTool, Download, MapPin, ArrowRight } from 'lucide-react';

const AdmissionCTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* --- Vibrant Background --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-red-500"></div>
      
      {/* --- Decorative Pattern --- */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* --- Abstract Shapes --- */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-400 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Admissions Open for 2025-26
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Shape Your Future with <br />
            <span className="text-yellow-200">Expert Guidance</span>
          </h2>
          
          <p className="text-lg md:text-xl text-orange-50 mb-12 max-w-2xl mx-auto leading-relaxed">
            Don't leave your academic success to chance. Secure your spot at KRJ Institute and experience learning that delivers results.
          </p>

          {/* --- Action Buttons Grid --- */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            
            {/* Primary 1: Book Counseling (Highest Priority) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-base shadow-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors group"
            >
              <Calendar size={20} className="text-orange-600" />
              Book a Counseling Session
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
            </motion.button>

            {/* Primary 2: Apply Now */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto px-8 py-4 bg-orange-800/30 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 hover:bg-white/20 hover:border-white transition-all"
            >
              <PenTool size={20} />
              Apply for Admission
            </motion.button>
          </div>

          {/* --- Secondary Actions (Links) --- */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-12">
            <button className="flex items-center gap-2 text-orange-100 hover:text-white font-medium text-sm border-b border-transparent hover:border-white transition-all pb-0.5">
              <Download size={16} />
              Download Course Details
            </button>
            
            <button className="flex items-center gap-2 text-orange-100 hover:text-white font-medium text-sm border-b border-transparent hover:border-white transition-all pb-0.5">
              <MapPin size={16} />
              Visit Our Center
            </button>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default AdmissionCTA;