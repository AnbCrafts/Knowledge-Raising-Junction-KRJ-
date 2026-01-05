import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Star, 
  TrendingUp, 
  MessageCircle, 
  CheckCircle2, 
  Users, 
  Award, 
  Facebook,
  Instagram,
  Mail,
  Phone
} from 'lucide-react';
import { getTeachers } from '../../Services/ServeStaticTeacherData';

const FacultySection = () => {
  // Dummy Data for Faculty
 

  const methodology = [
    { label: "Subject Experts", icon: GraduationCap },
    { label: "Performance Monitored", icon: TrendingUp },
    { label: "Feedback Driven", icon: MessageCircle },
    { label: "Qualified Educators", icon: CheckCircle2 }
  ];

  const [teachers,setTeachers] = useState([]);
  useEffect(()=>{
    getTeachers().then(setTeachers);
  })

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
          {teachers?.map((teacher, index) => {
  // Fallback gradients since 'color' is missing in new data
  const gradients = [
    "from-orange-400 to-pink-500",
    "from-blue-400 to-cyan-500", 
    "from-emerald-400 to-teal-500",
    "from-violet-400 to-purple-500"
  ];

  return (
    <motion.div 
      key={teacher.id || index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 border border-gray-100 transition-all duration-300 group flex flex-col"
    >
      {/* Avatar Area with dynamic gradient */}
      <div className={`h-24 bg-gradient-to-r ${gradients[index % gradients.length]} relative`}>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-gray-400 uppercase">
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </span>
            </div>
          </div>
      </div>

      {/* Card Body */}
      <div className="pt-12 pb-6 px-6 text-center flex-grow">
          <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
          <p className="text-orange-600 font-medium text-sm mb-4">{teacher.faculty}</p>
          
          {/* Info Row: Experience | Phone | Email */}
          <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
            <div className="flex flex-col items-center w-1/3">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Exp</span>
                <span className="font-bold text-gray-800 text-sm">{teacher.experienceYears} Yrs</span>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            
            {/* Phone Button */}
            <a href={`tel:${teacher.phone}`} className="flex flex-col items-center w-1/3 group/item cursor-pointer">
                <span className="text-[10px] text-gray-400 uppercase font-semibold group-hover/item:text-green-600 transition-colors">Call</span>
                <div className="mt-1 p-1.5 rounded-full bg-green-50 text-green-600 group-hover/item:bg-green-500 group-hover/item:text-white transition-all">
                  <Phone size={14} />
                </div>
            </a>
            <div className="w-px h-8 bg-gray-100"></div>

            {/* Email Button */}
            <a href={`mailto:${teacher.email}`} className="flex flex-col items-center w-1/3 group/item cursor-pointer">
                <span className="text-[10px] text-gray-400 uppercase font-semibold group-hover/item:text-blue-600 transition-colors">Email</span>
                <div className="mt-1 p-1.5 rounded-full bg-blue-50 text-blue-600 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all">
                  <Mail size={14} />
                </div>
            </a>
          </div>
      </div>

      {/* Footer Actions (Social Links) */}
      <div className="px-6 pb-6 pt-0 flex gap-3">
          {teacher.socialLinks?.instagram && (
            <a 
              href={teacher.socialLinks.instagram}
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-2 rounded-lg bg-pink-50 text-pink-600 text-sm font-semibold hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Instagram size={16} /> <span className="text-xs">Insta</span>
            </a>
          )}
          {teacher.socialLinks?.facebook && (
            <a 
              href={teacher.socialLinks.facebook}
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Facebook size={16} /> <span className="text-xs">Facebook</span>
            </a>
          )}
      </div>
    </motion.div>
  );
})}
        </div>

      </div>
    </section>
  );
};

export default FacultySection;