import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, ArrowRight, Mail } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      
      {/* --- Vibrant Background --- */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500"></div>
      
      {/* --- Decorative Shapes --- */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-900 opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to take the next step in your <br className="hidden md:block" />
            <span className="text-orange-100">academic journey?</span>
          </h2>
          
          <p className="text-lg text-orange-50 mb-10 max-w-2xl mx-auto">
            Admissions are open for the upcoming session. Join KRJ to experience structured learning and expert guidance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Primary Button: Book Counselling */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-base shadow-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Calendar size={20} />
              Book a Counselling Session
            </motion.button>

            {/* Secondary Button: Enquire Now */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-orange-200 text-white rounded-full font-bold text-base flex items-center justify-center gap-2 hover:border-white transition-all"
            >
              <Mail size={20} />
              Enquire Now
            </motion.button>
            
          </div>

          <p className="mt-6 text-sm text-orange-200 opacity-80">
            Have questions? Call us directly at <span className="font-bold text-white underline decoration-orange-300 underline-offset-4 cursor-pointer hover:text-orange-100">+91 98765 43210</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default CTASection;