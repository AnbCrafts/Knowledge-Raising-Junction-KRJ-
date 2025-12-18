import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Star, 
  TrendingUp, 
  MessageCircle, 
  CheckCircle2, 
  Users, 
  Award 
} from 'lucide-react';

const FacultySection = () => {
  // Dummy Data for Faculty
  const teachers = [
    {
      name: "Amit Verma",
      subject: "Senior Physics Faculty",
      exp: "12+ Years",
      qualification: "M.Sc Physics, B.Ed",
      rating: 4.9,
      students: "2k+",
      color: "from-orange-400 to-red-500"
    },
    {
      name: "Priya Sharma",
      subject: "Mathematics Expert",
      exp: "8+ Years",
      qualification: "M.Sc Maths, Gold Medalist",
      rating: 4.8,
      students: "1.5k+",
      color: "from-purple-400 to-indigo-500"
    },
    {
      name: "Dr. R.K. Gupta",
      subject: "Chemistry Specialist",
      exp: "15+ Years",
      qualification: "Ph.D Chemistry",
      rating: 5.0,
      students: "3k+",
      color: "from-teal-400 to-emerald-500"
    },
    {
      name: "Neha Singh",
      subject: "Biology & NEET Prep",
      exp: "9+ Years",
      qualification: "M.Sc Biotech",
      rating: 4.9,
      students: "1.8k+",
      color: "from-blue-400 to-cyan-500"
    }
  ];

  const methodology = [
    { label: "Subject Experts", icon: GraduationCap },
    { label: "Performance Monitored", icon: TrendingUp },
    { label: "Feedback Driven", icon: MessageCircle },
    { label: "Qualified Educators", icon: CheckCircle2 }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn from <span className="text-orange-500">Experienced & Dedicated</span> Faculty
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            At KRJ, we believe a teacher is the backbone of success. Our faculty is handpicked, vigorously trained, and constantly evaluated.
          </p>

          {/* Methodology Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
            {methodology.map((item, index) => {
               const Icon = item.icon;
               return (
                 <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-gray-700">
                    <Icon size={16} className="text-orange-500" />
                    {item.label}
                 </div>
               )
            })}
          </div>
        </div>

        {/* --- Faculty Grid --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 border border-gray-100 transition-all duration-300 group"
            >
              {/* Avatar / Image Area */}
              <div className={`h-24 bg-gradient-to-r ${teacher.color} relative`}>
                 <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-md">
                       <span className="text-xl font-bold text-gray-400">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Card Body */}
              <div className="pt-12 pb-6 px-6 text-center">
                 <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
                 <p className="text-orange-600 font-medium text-sm mb-1">{teacher.subject}</p>
                 <p className="text-xs text-gray-400 mb-4">{teacher.qualification}</p>
                 
                 {/* Stats Row */}
                 <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
                    <div className="flex flex-col items-center">
                       <span className="text-xs text-gray-400 uppercase font-semibold">Exp</span>
                       <span className="font-bold text-gray-800 text-sm">{teacher.exp}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="flex flex-col items-center">
                       <span className="text-xs text-gray-400 uppercase font-semibold">Rating</span>
                       <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-800 text-sm">{teacher.rating}</span>
                          <Star size={10} className="fill-orange-400 text-orange-400" />
                       </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="flex flex-col items-center">
                       <span className="text-xs text-gray-400 uppercase font-semibold">Students</span>
                       <span className="font-bold text-gray-800 text-sm">{teacher.students}</span>
                    </div>
                 </div>
              </div>

              {/* Hover Action */}
              <div className="px-6 pb-6 pt-0">
                 <button className="w-full py-2 rounded-lg bg-gray-50 text-gray-600 text-sm font-semibold group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                    View Profile
                 </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FacultySection;