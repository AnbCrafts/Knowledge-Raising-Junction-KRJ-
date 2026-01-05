import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Trophy, TrendingUp, Users, Crown } from 'lucide-react';

const ResultsSection = () => {
  // 1. Impact Metrics
  const stats = [
    { label: "Selections in 2024", value: "150+", icon: Trophy },
    { label: "Board Exam Avg", value: "88%", icon: TrendingUp },
    { label: "Happy Parents", value: "500+", icon: Users },
    { label: "Top Rankers", value: "25+", icon: Crown },
  ];

  // 2. Testimonials Data
  const testimonials = [
    {
      name: "Rohan Das",
      role: "Class 12 Student (PCM)",
      content: "The concepts of Physics were always hard for me, but the faculty at KRJ made them so easy to visualize. My marks improved from 60% to 92% in pre-boards.",
      rating: 5,
      type: "Student"
    },
    {
      name: "Mrs. Sunita Verma",
      role: "Parent of Class 10 Student",
      content: "I love the transparency. The KRJ app keeps me updated on my son's attendance and test scores. I never have to worry about how he is performing.",
      rating: 5,
      type: "Parent"
    },
    {
      name: "Anjali Gupta",
      role: "NEET Aspirant",
      content: "The test series is very structured. We get detailed analysis after every exam which helped me identify my weak areas in Biology. Highly recommended!",
      rating: 4.5,
      type: "Student"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-orange-600 font-bold tracking-wider uppercase text-xs"
          >
            Hall of Fame
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6"
          >
            Our Students, <span className="text-orange-500">Our Success</span>
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We don't just teach; we transform potential into performance. Here is what our community has to say.
          </p>
        </div>

        {/* --- Metrics Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:border-orange-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                  <Icon size={24} />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* --- Testimonials Grid --- */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (index * 0.2) }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-6 text-gray-100 group-hover:text-orange-100 transition-colors">
                <Quote size={60} strokeWidth={0} fill="currentColor" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < Math.floor(item.rating) ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}`} 
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 leading-relaxed mb-8 relative z-10">
                "{item.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-lg">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Bottom CTA Badge --- */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full shadow-lg">
                <Trophy size={18} className="text-yellow-400" />
                <span className="font-medium">Join the league of toppers today!</span>
            </div>
        </div>

      </div>
    </section>
  );
};

export default ResultsSection;