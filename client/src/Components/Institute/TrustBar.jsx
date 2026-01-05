import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Eye, 
  Users, 
  Award, 
  Layers 
} from 'lucide-react';

const TrustBar = () => {
  // Data for the Top "Big Promise" Stats
  const stats = [
    { 
      label: "Trusted by", 
      value: "500+ Students", 
      desc: "Across various courses",
      icon: Users 
    },
    { 
      label: "Faculty", 
      value: "10+ Years Exp", 
      desc: "Proven track record",
      icon: Award 
    },
    { 
      label: "Structure", 
      value: "Smart Batches", 
      desc: "Optimized for growth",
      icon: Layers 
    }
  ];

  // Data for the Bottom "Features/Badges" Grid
  const features = [
    {
      title: "Secure Systems",
      description: "Data privacy & secure payments",
      icon: ShieldCheck
    },
    {
      title: "Digital Attendance",
      description: "Real-time tracking & alerts",
      icon: UserCheck
    },
    {
      title: "Regular Assessments",
      description: "Weekly tests & performance analysis",
      icon: FileText
    },
    {
      title: "Parent Transparency",
      description: "Direct access to progress reports",
      icon: Eye
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Part 1: Top Stats Row --- */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="flex items-center space-x-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-500">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* --- Divider --- */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16"></div>

        {/* --- Part 2: Feature Badges Grid --- */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
           <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Why Parents & Students Choose KRJ</h2>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="flex flex-col items-center text-center group cursor-default"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
           </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TrustBar;