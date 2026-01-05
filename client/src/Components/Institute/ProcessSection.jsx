import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  LineChart, 
  Trophy, 
  ArrowRight 
} from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    {
      id: 1,
      title: "Counselling & Admission",
      desc: "Understanding student goals and selecting the right course path.",
      icon: MessageSquare,
    },
    {
      id: 2,
      title: "Batch Allocation",
      desc: "Placement in optimized batches based on aptitude and class.",
      icon: Users,
    },
    {
      id: 3,
      title: "Classes & Assessments",
      desc: "Rigorous academic schedule with regular testing cycles.",
      icon: BookOpen,
    },
    {
      id: 4,
      title: "Monitoring & Feedback",
      desc: "Continuous performance tracking and remedial sessions.",
      icon: LineChart,
    },
    {
      id: 5,
      title: "Growth & Results",
      desc: "Achieving academic excellence and competitive success.",
      icon: Trophy,
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header --- */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Learning Works at <span className="text-orange-500">KRJ</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our proven 5-step methodology ensures that every student follows a structured path from enrollment to excellence.
          </p>
        </div>

        {/* --- Process Timeline --- */}
        <div className="relative">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

          <div className="grid lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group relative flex flex-col items-center text-center"
                >
                  {/* Step Number Badge */}
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-orange-100 text-orange-500 font-bold text-sm flex items-center justify-center mb-4 z-20 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-300">
                    {step.id}
                  </div>

                  {/* Icon Card */}
                  <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/10 group-hover:text-orange-500 transition-all duration-300">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>

                  {/* Mobile Connector (Vertical Line) */}
                  {index !== steps.length - 1 && (
                    <div className="lg:hidden absolute bottom-[-32px] left-1/2 w-0.5 h-8 bg-gray-100 -translate-x-1/2"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* --- Bottom CTA --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <button className="inline-flex items-center gap-2 text-orange-600 font-semibold border-b-2 border-orange-100 pb-0.5 hover:text-orange-700 hover:border-orange-500 transition-all">
            Start your journey with us
            <ArrowRight size={16} />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default ProcessSection;