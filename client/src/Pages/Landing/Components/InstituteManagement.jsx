import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CreditCard, 
  Users, 
  Database, 
  Building2, 
  Lock,
  CheckCircle2 
} from 'lucide-react';

const InstituteManagement = () => {
  const features = [
    {
      title: "Organized Batches & Schedules",
      desc: "Clash-free timetables and optimized batch allocation for seamless learning.",
      icon: Calendar,
      className: "md:col-span-2"
    },
    {
      title: "Transparent Fee Tracking",
      desc: "Automated receipts and clear payment history records for parents.",
      icon: CreditCard,
      className: "md:col-span-1"
    },
    {
      title: "Faculty Coordination",
      desc: "Streamlined communication between departments and educators.",
      icon: Users,
      className: "md:col-span-1"
    },
    {
      title: "Secure Student Records",
      desc: "Bank-grade encryption for all personal and academic data.",
      icon: Lock,
      className: "md:col-span-2"
    },
    {
      title: "Branch Management",
      desc: "Unified standards across all KRJ centers.",
      icon: Building2,
      className: "md:col-span-3"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 text-xs font-medium mb-4"
          >
            <Database size={14} className="text-orange-500" />
            <span>Operational Backbone</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Efficient <span className="text-orange-500">Academic & Administrative</span> Management
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Behind the scenes, KRJ uses smart systems to ensure smooth operations, secure data, and better academic delivery—so students can focus purely on learning.
          </motion.p>
        </div>

        {/* --- Bento Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-100 transition-all duration-300 group ${feature.className}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-orange-50 flex items-center justify-center text-gray-500 group-hover:text-orange-600 transition-colors">
                    <Icon size={24} />
                  </div>
                  {/* Subtle checkmark on hover */}
                  <CheckCircle2 size={20} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* --- Trust Note --- */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
        >
            <p className="text-sm text-gray-400">
                Powered by enterprise-grade infrastructure. 
                <span className="ml-2 text-gray-500 font-medium">99.9% Uptime & Data Reliability.</span>
            </p>
        </motion.div>

      </div>
    </section>
  );
};

export default InstituteManagement;