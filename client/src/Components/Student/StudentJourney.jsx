import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  BookOpen, 
  TrendingUp, 
  MessageCircleHeart, 
  Trophy,
  Check
} from 'lucide-react';

const StudentJourneySection = () => {
  const journeySteps = [
    {
      title: "Admission & Onboarding",
      desc: "Smooth digital enrollment process, profile setup, and welcome kit orientation.",
      icon: UserPlus,
    },
    {
      title: "Batch & Subject Allocation",
      desc: "Scientific placement into optimized batches based on aptitude and goals.",
      icon: Users,
    },
    {
      title: "Regular Classes & Assignments",
      desc: "Structured academic schedule combined with regular digital homework and tests.",
      icon: BookOpen,
    },
    {
      title: "Performance Tracking",
      desc: "Continuous monitoring of attendance and marks via smart dashboards.",
      icon: TrendingUp,
    },
    {
      title: "Feedback & Mentoring",
      desc: "Personalized remedial sessions and one-on-one guidance to close learning gaps.",
      icon: MessageCircleHeart,
    },
    {
      title: "Results & Achievements",
      desc: "Reaching academic milestones, competitive success, and future readiness.",
      icon: Trophy,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wide mb-4 border border-orange-100">
            The Path to Success
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            A Student’s Journey at <span className="text-orange-500">KRJ</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
            From the moment you join, we provide a structured, supportive, and tech-enabled path to help you realize your potential.
          </p>
        </div>

        {/* --- Timeline Container --- */}
        <div className="relative">
          
          {/* Central Line */}
          <div className="absolute left-1/2 top-2 bottom-2 w-0.5 bg-gray-100 -translate-x-1/2 z-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-200 rounded-full"></div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-200 rounded-full"></div>
             {/* Orange progress filler gradient */}
             <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-b from-orange-400 via-orange-200 to-gray-100 opacity-60"></div>
          </div>

          <div className="space-y-16 relative z-10">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`flex items-center ${isEven ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Content Card Side */}
                  <div className={`flex-1 ${isEven ? 'text-right pr-12' : 'text-left pl-12'}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2 justify-end">
                      {!isEven && <span className="text-orange-500 font-bold text-sm">0{index+1}.</span>}
                      {step.title}
                      {isEven && <span className="text-orange-500 font-bold text-sm">0{index+1}.</span>}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                      {step.desc}
                    </p>
                  </div>

                  {/* Center Node (Icon Circle) */}
                  <div className="relative flex-shrink-0 w-16 h-16 z-20">
                    {/* Outer glowing ring */}
                    <div className="absolute inset-0 bg-orange-100 rounded-full blur-md opacity-50 animate-pulse"></div>
                    {/* The Node itself */}
                    <div className="relative w-full h-full rounded-full bg-white border-4 border-orange-500 flex items-center justify-center shadow-sm text-orange-500">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                     {/* Connector line to card */}
                     <div className={`absolute top-1/2 h-0.5 w-12 bg-orange-200 ${isEven ? 'right-full' : 'left-full'}`}></div>
                  </div>

                  {/* Empty Balance Side */}
                  <div className="flex-1"></div>
                  
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Closing Checkmark */}
        <div className="flex justify-center mt-16 relative z-20">
           <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-full font-bold border border-green-100 shadow-sm">
              <Check size={20} />
              Career Ready
           </div>
        </div>

      </div>
    </section>
  );
};

export default StudentJourneySection;