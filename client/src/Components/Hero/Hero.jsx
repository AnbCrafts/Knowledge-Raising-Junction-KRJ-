import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Play,
  CheckCircle,
  Users,
  BarChart3,
} from "lucide-react";
import { assets } from "../../assets/assets";

const HeroSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-orange-50/30">
      {/* --- Abstract Background Shapes --- */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* --- Left Column: Text Content --- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Tagline Badge */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-purple-100 shadow-sm text-purple-700 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                Admissions Open for 2025-26 Batch
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6"
            >
              Empowering Students Through{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-500">
                Quality Education
              </span>{" "}
              & Expert Guidance
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 leading-relaxed mb-8 pr-4"
            >
              KRJ (Knowledge Raising Junction) is a modern coaching institute
              committed to academic excellence, structured learning, and
              student-focused growth —{" "}
              <span className="text-gray-900 font-medium">
                supported by smart digital management.
              </span>
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Primary CTA: Enquire Now */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all"
              >
                Enquire Now
                <ArrowRight size={18} className="ml-2" />
              </motion.button>

              {/* Secondary CTA: Explore Courses */}
              <motion.button
                whileHover={{
                  backgroundColor: "#ffffff",
                  borderColor: "#9333ea",
                }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-purple-200 text-base font-bold rounded-xl text-purple-700 bg-white/60 hover:text-purple-800 transition-all backdrop-blur-sm"
              >
                <BookOpen size={18} className="mr-2" />
                Explore Courses
              </motion.button>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex items-center gap-8 text-gray-500 text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Expert Faculty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Hybrid Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Proven Results</span>
              </div>
            </motion.div>
          </motion.div>

          {/* --- Right Column: Visual Composition (Classroom + Dashboard) --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative lg:ml-6"
          >
            {/* VISUAL COMPOSITION:
                Base: A rounded rectangle representing a "Live Class/Video" frame
                Overlay: Floating cards representing the "Digital Dashboard" aspect
             */}

            {/* Base Layer: The "Classroom" View */}
            <div className="relative z-10 bg-gray-900 rounded-2xl shadow-2xl border-4 border-white overflow-hidden aspect-[4/3] group">
              {/* --- 1. Background Video --- */}
              <video
                src={assets.intro}
                className="absolute inset-0 w-full h-full object-cover z-0"
                autoPlay
                loop
                muted
                playsInline
              />

              {/* Optional: Dark Overlay to ensure white text is readable over the video */}
              <div className="absolute inset-0 bg-black/20 z-10"></div>

              {/* --- 2. Mock Video UI Header --- */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-20">
                <div className="flex items-center gap-2">
                  <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                    LIVE
                  </div>
                  <span className="text-white text-xs font-medium drop-shadow-md">
                    Physics: Advanced Mechanics
                  </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              </div>

              {/* --- 3. Center Play Button (Optional - appears on hover) --- */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play size={32} className="fill-white text-white" />
                </div>
              </div>

              {/* --- 4. Mock Video UI Footer --- */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20 flex gap-4">
                {/* Fake User Avatars */}
                <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-white/20 overflow-hidden">
                  <img
                    src="https://i.pravatar.cc/100?img=1"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-white/20 overflow-hidden">
                  <img
                    src="https://i.pravatar.cc/100?img=2"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Count Badge */}
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white/20 shadow-lg shadow-orange-500/20">
                  +42
                </div>
              </div>
            </div>

            {/* Floating Card 1: Student Progress (Dashboard aspect) */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 -bottom-6 bg-white p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-purple-50 z-20 w-48"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Performance</p>
                  <p className="text-sm font-bold text-gray-900">+24% Growth</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[75%] rounded-full"></div>
              </div>
            </motion.div>

            {/* Floating Card 2: Attendance/Batch (Management aspect) */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -right-6 top-10 bg-white p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-orange-50 z-20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Batch Strength</p>
                  <p className="text-sm font-bold text-gray-900">
                    120 Students
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
