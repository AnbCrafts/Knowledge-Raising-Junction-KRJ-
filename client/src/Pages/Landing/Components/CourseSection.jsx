import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Trophy, Microscope, ArrowRight, Monitor, Users, Wifi } from 'lucide-react';

const CoursesSection = () => {
  const courses = [
    {
      title: "Foundation Courses",
      description: "Building strong concepts early for future success.",
      icon: BookOpen,
      details: {
        classes: "Class 8 - 10",
        subjects: "Maths, Science, Mental Ability",
        mode: "Hybrid",
      },
    },
    {
      title: "Board Exam Prep",
      description: "Rigorous preparation for 10th & 12th Board Exams.",
      icon: GraduationCap,
      details: {
        classes: "Class 10 & 12",
        subjects: "Physics, Chem, Maths, Bio",
        mode: "Offline / Hybrid",
      },
    },
    {
      title: "Competitive Coaching",
      description: "Specialized training for JEE, NEET, and Olympiads.",
      icon: Trophy,
      details: {
        classes: "Class 11 - 12",
        subjects: "PCM / PCB",
        mode: "Offline",
      },
    },
    {
      title: "Subject Specialized",
      description: "In-depth modules for specific subject mastery.",
      icon: Microscope,
      details: {
        classes: "All Classes",
        subjects: "Single Subject Choice",
        mode: "Online / Offline",
      },
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header --- */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-orange-600 font-bold tracking-wider uppercase text-xs">Academic Excellence</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Our Courses & <span className="text-orange-500">Academic Programs</span>
          </h2>
          <p className="text-gray-500">
            Expertly designed curriculums to meet the diverse learning needs of every student.
          </p>
        </div>

        {/* --- Course Cards Grid --- */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 transition-all duration-300 flex flex-col h-full"
              >
                {/* Icon Header */}
                <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <Icon size={28} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {course.description}
                </p>

                {/* Details List */}
                <div className="mt-auto space-y-3 pt-6 border-t border-gray-50">
                  <div className="flex items-start text-sm">
                    <span className="text-gray-400 w-20 font-medium text-xs uppercase">Class</span>
                    <span className="font-semibold text-gray-800">{course.details.classes}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-gray-400 w-20 font-medium text-xs uppercase">Subjects</span>
                    <span className="font-semibold text-gray-800">{course.details.subjects}</span>
                  </div>
                  <div className="flex items-center text-sm">
                     <span className="text-gray-400 w-20 font-medium text-xs uppercase">Mode</span>
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                        <Wifi size={10} className="mr-1" />
                        {course.details.mode}
                     </span>
                  </div>
                </div>

                {/* Hover Action */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                   <ArrowRight size={20} className="text-orange-500" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default CoursesSection;