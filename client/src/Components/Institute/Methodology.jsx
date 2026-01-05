import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  HelpCircle, 
  FileCheck, 
  BarChart2, 
  MessageSquare, 
  Smartphone, 
  Laptop,
  Check
} from 'lucide-react';

const MethodologySection = () => {
  const methods = [
    {
      title: "Concept-First Teaching",
      desc: "We don't believe in rote memorization. Our classes focus on building a rock-solid foundation of core concepts using real-world examples and interactive lectures.",
      icon: Lightbulb,
      techFeature: "Digital Notes & Resources",
      techIcon: Laptop
    },
    {
      title: "Doubt-Clearing Sessions",
      desc: "Learning doesn't stop when the class ends. We have dedicated slots where students can ask questions freely, ensuring no topic is left potentialy misunderstood.",
      icon: HelpCircle,
      techFeature: "Query Management System",
      techIcon: MessageSquare
    },
    {
      title: "Weekly Tests & Analysis",
      desc: "Regular assessment is key. We conduct weekly chapter-wise tests that mirror board and competitive exam patterns to build exam temperament.",
      icon: FileCheck,
      techFeature: "Automated Assignments", // Links to your Assignment Module
      techIcon: FileCheck
    },
    {
      title: "Performance Tracking",
      desc: "We analyze every test result to identify weak areas. Our data-driven approach helps us personalize the learning path for every single student.",
      icon: BarChart2,
      techFeature: "Graphical Dashboard", // Links to your Dashboard
      techIcon: BarChart2
    },
    {
      title: "Parent-Teacher Communication",
      desc: "Parents are partners in this journey. We ensure you are always in the loop regarding attendance, test marks, and general behavior.",
      icon: MessageSquare,
      techFeature: "Real-time App Updates", // Links to your Notification System
      techIcon: Smartphone
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wide mb-4 border border-orange-100">
            Systematic Excellence
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Teaching <span className="text-orange-500">Methodology</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            We combine traditional teaching values with modern technology to create a seamless learning ecosystem.
          </p>
        </div>

        {/* --- Timeline / Zig-Zag Layout --- */}
        <div className="relative">
          
          {/* Vertical Center Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-400 to-orange-200 -translate-x-1/2 rounded-full opacity-30"></div>

          <div className="space-y-12 md:space-y-24">
            {methods.map((item, index) => {
              const Icon = item.icon;
              const TechIcon = item.techIcon;
              const isEven = index % 2 === 0;

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  
                  {/* Text Content Side */}
                  <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} text-center md:text-left`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 mb-6 shadow-sm border border-orange-100 ${isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    {/* Tech Integration Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 ${isEven ? 'md:flex-row-reverse' : 'flex-row'}`}>
                      <TechIcon size={16} className="text-orange-500" />
                      <span>Integration: {item.techFeature}</span>
                    </div>
                  </div>

                  {/* Center Dot (Desktop) */}
                  <div className="hidden md:flex flex-shrink-0 relative z-10">
                    <div className="w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-md"></div>
                  </div>

                  {/* Visual/Empty Side (To balance the grid) */}
                  <div className="flex-1 hidden md:block">
                     {/* Optional: You could put an image here corresponding to the step.
                        For now, keeping it clean whitespace or a subtle pattern.
                     */}
                     <div className={`w-full h-full min-h-[100px] rounded-2xl border-2 border-dashed border-gray-100 relative opacity-50 ${isEven ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-gray-50 to-transparent`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gray-200 font-bold text-6xl opacity-20">0{index + 1}</span>
                        </div>
                     </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default MethodologySection;