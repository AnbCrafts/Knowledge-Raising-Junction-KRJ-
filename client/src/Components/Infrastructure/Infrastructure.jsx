import React from 'react';
import { motion } from 'framer-motion';
import { 
  MonitorPlay, 
  Wifi, 
  BookOpen, 
  Armchair, 
  Video, 
  Download,
  Cast
} from 'lucide-react';

const InfrastructureSection = () => {
  const facilities = [
    {
      title: "Smart Classrooms",
      desc: "Equipped with digital projectors and smart boards for interactive visual learning.",
      icon: Cast,
    },
    {
      title: "Hybrid Learning Ready",
      desc: "Seamless switch between offline and online modes. Don't miss a class, even from home.",
      icon: Wifi,
    },
    {
      title: "Recorded Sessions",
      desc: "Every lecture is recorded and uploaded to the app for revision and backup.",
      icon: Video,
    },
    {
      title: "Digital & Physical Library",
      desc: "Access to a vast repository of study materials, e-books, and printed notes.",
      icon: BookOpen,
    },
    {
      title: "Comfortable Study Spaces",
      desc: "Ergonomic seating, air-conditioned rooms, and a distraction-free environment.",
      icon: Armchair,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Left Column: Content --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide mb-6">
              Infrastructure
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-orange-500">Learning Environment</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              We have designed our institute to be a blend of physical comfort and digital efficiency, ensuring students can focus entirely on their studies.
            </p>

            <div className="space-y-6">
              {facilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* --- Right Column: Visual Composition (Smart Class Abstract) --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* The "Smart Board" Container */}
            <div className="relative w-full max-w-md aspect-[4/5] bg-gray-900 rounded-3xl border-[8px] border-gray-800 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Screen Content */}
              <div className="flex-1 bg-gray-800 relative overflow-hidden p-6 flex flex-col">
                 
                 {/* Live Badge */}
                 <div className="flex justify-between items-start mb-8">
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse flex items-center gap-1">
                       <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
                    </div>
                    <div className="flex gap-2">
                       <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-white"><Wifi size={14}/></div>
                       <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-white"><MonitorPlay size={14}/></div>
                    </div>
                 </div>

                 {/* Abstract Teacher & Content */}
                 <div className="mt-auto mb-10">
                    <div className="w-16 h-16 rounded-full bg-orange-500 border-4 border-gray-700 mb-4 flex items-center justify-center text-white font-bold text-xl">
                       Tr.
                    </div>
                    <div className="space-y-3 opacity-50">
                       <div className="h-4 w-3/4 bg-gray-600 rounded-full"></div>
                       <div className="h-4 w-1/2 bg-gray-600 rounded-full"></div>
                       <div className="h-32 w-full bg-gray-700/50 rounded-xl border border-gray-600 mt-4 flex items-center justify-center">
                          <BookOpen size={40} className="text-gray-500" />
                       </div>
                    </div>
                 </div>

                 {/* Bottom Controls */}
                 <div className="h-16 bg-gray-900 absolute bottom-0 left-0 right-0 flex items-center justify-around px-4 border-t border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-600"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div className="w-32 h-2 rounded-full bg-gray-700"></div>
                 </div>
              </div>
            </div>

            {/* Floating Element: Recorded Lecture */}
            <motion.div 
               animate={{ y: [-10, 10, -10] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 -right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-20 max-w-[200px]"
            >
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                     <Download size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-gray-900">Lecture Saved</p>
                     <p className="text-[10px] text-gray-400">Physics - Ch 4.mp4</p>
                  </div>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 w-full h-full"></div>
               </div>
            </motion.div>

            {/* Floating Element: Hybrid Icon */}
            <motion.div 
               animate={{ y: [10, -10, 10] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-32 -left-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-20 flex items-center gap-3"
            >
               <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Wifi size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-gray-900">Hybrid Mode</p>
                  <p className="text-[10px] text-green-600 font-medium">Online • Active</p>
               </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default InfrastructureSection;