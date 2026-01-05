import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Users, 
  ClipboardCheck, 
  HeartHandshake, 
  Smartphone, 
  ShieldCheck,
  Check
} from 'lucide-react';

const WhyChooseSection = () => {
  const features = [
    {
      title: "Experienced & Verified Faculty",
      desc: "Unlike local centers, our educators are professionally vetted, qualified, and constantly trained to deliver the best.",
      icon: Award,
    },
    {
      title: "Small Batch Sizes",
      desc: "We limit student count per batch to ensure every individual gets the attention they deserve.",
      icon: Users,
    },
    {
      title: "Regular Assessments",
      desc: "Weekly tests and mock exams to track progress, not just at the end of the year, but continuously.",
      icon: ClipboardCheck,
    },
    {
      title: "Personal Mentoring",
      desc: "One-on-one guidance sessions to help students overcome academic anxiety and plan their career path.",
      icon: HeartHandshake,
    },
    {
      title: "Tech-Enabled Management",
      desc: "Smart schedules, digital notes, and app-based learning support to keep students ahead of the curve.",
      icon: Smartphone,
    },
    {
      title: "Transparent Tracking",
      desc: "Complete visibility for parents regarding fees, attendance, and marks. No hidden surprises.",
      icon: ShieldCheck,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-gray-50 relative">
      
      {/* Decorative Background Blotches */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[10%] left-[-5%] w-64 h-64 bg-orange-200/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[10%] right-[-5%] w-64 h-64 bg-gray-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide mb-4">
            <Check size={12} strokeWidth={4} /> The KRJ Advantage
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Students & Parents <br/>
            <span className="text-orange-500">Choose KRJ</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            We bridge the gap between traditional teaching values and modern educational needs. Here is what sets us apart from the rest.
          </p>
        </div>

        {/* --- Feature Grid --- */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-50 group-hover:bg-orange-50 flex items-center justify-center text-gray-400 group-hover:text-orange-600 transition-colors duration-300 mb-6">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* --- Bottom Trust Note --- */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.8 }}
           className="mt-16 text-center"
        >
           <p className="text-gray-400 text-sm font-medium">
              Join <span className="text-gray-900 font-bold">500+ students</span> who have already made the right choice.
           </p>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseSection;