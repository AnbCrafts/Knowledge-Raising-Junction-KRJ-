import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarCheck, 
  ClipboardList, 
  BarChart3, 
  Clock, 
  Smartphone, 
  CheckCircle2,
  Bell
} from 'lucide-react';

const StudentSystem = () => {
  const features = [
    {
      title: "Digital Attendance",
      desc: "Instant notification to parents regarding student presence.",
      icon: CalendarCheck,
    },
    {
      title: "Assignment & Test Tracking",
      desc: "Complete record of homework submission and test marks.",
      icon: ClipboardList,
    },
    {
      title: "Performance Reports",
      desc: "Detailed graphical analysis of student's growth curve.",
      icon: BarChart3,
    },
    {
      title: "Timetable Access",
      desc: "Real-time updates on class schedules and extra sessions.",
      icon: Clock,
    },
    {
      title: "Parent Transparency",
      desc: "Dedicated app access for parents to monitor progress.",
      icon: Smartphone,
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Left Column: Content & Features --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-orange-600 font-bold tracking-wider uppercase text-xs mb-2 block">
              Student Success System
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              A Structured Learning Experience for <span className="text-orange-500">Every Student</span>
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              We ensure every student’s progress is monitored and supported. Our digital ecosystem bridges the gap between the classroom and home.
            </p>

            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-orange-50/50 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mt-1">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* --- Right Column: Mobile App Mockup (CSS Art) --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* The Phone Frame */}
            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden z-10">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-gray-800 rounded-b-xl z-20"></div>

              {/* Screen Content */}
              <div className="w-full h-full bg-gray-50 pt-10 px-5 pb-6 flex flex-col">
                
                {/* App Header */}
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h5 className="text-xs text-gray-500 uppercase font-bold">Welcome Back</h5>
                      <h4 className="text-lg font-bold text-gray-900">Anubhaw G.</h4>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center relative">
                      <Bell size={16} />
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                   </div>
                </div>

                {/* Stat Card: Attendance */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-400">Attendance</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Good</span>
                   </div>
                   <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-gray-900">92%</span>
                      <span className="text-xs text-gray-400 mb-1">this month</span>
                   </div>
                   {/* Mini Progress Bar */}
                   <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                      <div className="h-full w-[92%] bg-orange-500 rounded-full"></div>
                   </div>
                </div>

                {/* Stat Card: Recent Test */}
                <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-500/20 mb-4 text-white relative overflow-hidden">
                   <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                   <h5 className="text-xs font-medium text-orange-100 mb-1">Recent Test Result</h5>
                   <h3 className="text-xl font-bold mb-2">Physics: Mechanics</h3>
                   <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold">45<span className="text-sm text-orange-200">/50</span></div>
                      <div className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">Top 10%</div>
                   </div>
                </div>

                {/* Timeline / Upcoming */}
                <div className="flex-1">
                   <h5 className="text-sm font-bold text-gray-900 mb-3">Today's Schedule</h5>
                   <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex gap-3 items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                           <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-gray-50 text-xs font-bold text-gray-500">
                              <span>0{3+i}</span><span>PM</span>
                           </div>
                           <div>
                              <h6 className="text-sm font-bold text-gray-900">Mathematics</h6>
                              <p className="text-xs text-gray-400">Hall A • Mr. Sharma</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Bottom Nav Mock */}
                <div className="mt-auto h-12 bg-white rounded-2xl flex justify-around items-center shadow-sm border border-gray-100 px-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><Smartphone size={18}/></div>
                    <div className="w-8 h-8 flex items-center justify-center text-gray-300"><Clock size={18}/></div>
                    <div className="w-8 h-8 flex items-center justify-center text-gray-300"><BarChart3 size={18}/></div>
                </div>

              </div>
            </div>

            {/* Decorative Background Elements behind Phone */}
            <div className="absolute top-20 -right-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30 z-0"></div>
            <div className="absolute bottom-10 -left-10 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-30 z-0"></div>

            {/* Floating Badge */}
            <motion.div 
               animate={{ y: [-10, 10, -10] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/2 -left-12 bg-white p-3 rounded-xl shadow-xl z-20 flex items-center gap-3 border border-gray-100 max-w-[180px]"
            >
               <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <CheckCircle2 size={20} />
               </div>
               <div>
                  <p className="text-xs text-gray-500">Parent Alert</p>
                  <p className="text-xs font-bold text-gray-900">Attendance Marked</p>
               </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default StudentSystem;