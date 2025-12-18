import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Shield,
  Clock,
  Star,
  BookOpen
} from 'lucide-react';

const StakeholderSection = () => {
  const [activeTab, setActiveTab] = useState('students');

  const tabs = [
    { id: 'students', label: 'For Students', icon: GraduationCap },
    { id: 'parents', label: 'For Parents', icon: Users },
    { id: 'faculty', label: 'For Faculty', icon: Briefcase },
  ];

  const content = {
    students: {
      heading: "Focus on Learning, We Handle the Rest",
      desc: "We provide a distraction-free environment where your only job is to grow academically.",
      features: [
        { title: "Structured Learning", desc: "Curated syllabus planning so you never feel lost.", icon: BookOpen },
        { title: "Regular Feedback", desc: "Detailed analysis of every test to spot improvement areas.", icon: TrendingUp },
        { title: "Career Guidance", desc: "Expert mentorship to help you choose the right path.", icon: GraduationCap }
      ],
      visualColor: "bg-blue-500"
    },
    parents: {
      heading: "Complete Peace of Mind",
      desc: "Bridging the gap between home and the institute with total transparency.",
      features: [
        { title: "Total Transparency", desc: "Real-time access to attendance and test scores.", icon: Shield },
        { title: "Direct Communication", desc: "One-click connection with teachers and admin.", icon: MessageCircle },
        { title: "Academic Discipline", desc: "We ensure your child adheres to a strict routine.", icon: CheckCircle2 }
      ],
      visualColor: "bg-green-500"
    },
    faculty: {
      heading: "A Platform to Teach Your Best",
      desc: "We respect educators and provide the systems needed to teach effectively without burnout.",
      features: [
        { title: "Respectful Environment", desc: "A culture that values knowledge and authority.", icon: Users },
        { title: "Structured Routines", desc: "Organized timetables with no last-minute chaos.", icon: Clock },
        { title: "Performance Recognition", desc: "Rewards for delivering excellent student results.", icon: Star }
      ],
      visualColor: "bg-purple-500"
    }
  };

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            An Ecosystem Built for <span className="text-orange-500">Everyone</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            KRJ is more than just a coaching center; it's a community where students, parents, and teachers thrive together.
          </p>
        </div>

        {/* --- Tabs Navigation --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- Content Area --- */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              
              {/* Left: Text Content */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {content[activeTab].heading}
                </h3>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                  {content[activeTab].desc}
                </p>

                <div className="space-y-6">
                  {content[activeTab].features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white ${
                            activeTab === 'students' ? 'bg-blue-500' : 
                            activeTab === 'parents' ? 'bg-green-500' : 'bg-purple-500'
                        }`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="mt-10 flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 group transition-colors">
                  Learn more
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Right: Dynamic Visual Illustration */}
              <div className="relative h-full min-h-[400px] flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                
                {/* Visual for Students: Career/Progress */}
                {activeTab === 'students' && (
                   <div className="relative w-64">
                      <div className="bg-white p-6 rounded-2xl shadow-lg mb-4 transform -rotate-3 border border-gray-100">
                         <div className="flex justify-between mb-4">
                            <div className="h-2 w-20 bg-gray-200 rounded"></div>
                            <div className="h-2 w-8 bg-green-200 rounded"></div>
                         </div>
                         <div className="h-32 bg-blue-50 rounded-lg flex items-end justify-around pb-2 px-2">
                            <div className="w-4 h-12 bg-blue-300 rounded-t"></div>
                            <div className="w-4 h-16 bg-blue-400 rounded-t"></div>
                            <div className="w-4 h-24 bg-blue-500 rounded-t shadow-lg shadow-blue-500/30"></div>
                         </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-3 w-48 ml-auto">
                         <div className="p-2 bg-orange-100 rounded-full text-orange-600"><GraduationCap size={16}/></div>
                         <div className="text-xs font-bold text-gray-800">Target Achieved</div>
                      </div>
                   </div>
                )}

                {/* Visual for Parents: Mobile App/Transparency */}
                {activeTab === 'parents' && (
                   <div className="relative">
                      <div className="w-60 h-[400px] bg-gray-900 rounded-[30px] border-[6px] border-gray-800 shadow-2xl p-4 flex flex-col">
                         <div className="w-full h-32 bg-green-500 rounded-xl mb-4 p-4 text-white">
                            <div className="text-xs opacity-80 mb-1">Attendance Alert</div>
                            <div className="font-bold text-lg">Present</div>
                            <div className="text-xs mt-2 flex items-center gap-1"><CheckCircle2 size={12}/> 9:00 AM • On Time</div>
                         </div>
                         <div className="space-y-3">
                            <div className="bg-gray-800 p-3 rounded-lg flex gap-3 items-center">
                               <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><MessageCircle size={14}/></div>
                               <div>
                                  <div className="h-1.5 w-20 bg-gray-600 rounded mb-1"></div>
                                  <div className="h-1.5 w-12 bg-gray-700 rounded"></div>
                               </div>
                            </div>
                            <div className="bg-gray-800 p-3 rounded-lg flex gap-3 items-center">
                               <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center"><TrendingUp size={14}/></div>
                               <div>
                                  <div className="h-1.5 w-16 bg-gray-600 rounded mb-1"></div>
                                  <div className="h-1.5 w-24 bg-gray-700 rounded"></div>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="absolute top-10 -right-12 bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-2">
                         <Shield size={20} className="text-green-500"/>
                         <span className="text-xs font-bold text-gray-800">Secure Data</span>
                      </div>
                   </div>
                )}

                {/* Visual for Faculty: Schedule/Dashboard */}
                {activeTab === 'faculty' && (
                   <div className="relative w-72">
                      <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                         <div className="flex items-center justify-between mb-6">
                            <div className="font-bold text-gray-900">My Schedule</div>
                            <div className="text-xs text-gray-400">Today</div>
                         </div>
                         <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                               <div key={i} className="flex gap-3 items-center border-l-2 border-purple-200 pl-3 py-1">
                                  <div className="text-xs font-bold text-gray-400 w-10">0{8+i}:00</div>
                                  <div className="bg-purple-50 p-2 rounded-lg w-full">
                                     <div className="h-2 w-20 bg-purple-200 rounded mb-1"></div>
                                     <div className="h-1.5 w-12 bg-purple-100 rounded"></div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="absolute -bottom-6 -right-6 bg-yellow-50 p-4 rounded-xl shadow-lg border border-yellow-100 flex items-center gap-3">
                         <Star size={24} className="text-yellow-500 fill-yellow-500"/>
                         <div>
                            <div className="text-xs text-yellow-700 font-bold">Best Teacher</div>
                            <div className="text-[10px] text-yellow-600">Awarded this month</div>
                         </div>
                      </div>
                   </div>
                )}

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default StakeholderSection;