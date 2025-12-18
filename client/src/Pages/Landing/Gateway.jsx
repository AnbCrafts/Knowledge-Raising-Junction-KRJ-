import React from "react";
import HeroSection from "./Components/Hero";
import TrustBar from "./Components/TrustBar";
import AboutSection from "./Components/AboutSection";
import CoursesSection from "./Components/CourseSection";
import FacultySection from "./Components/FacultySection";
import StudentSystem from "./Components/StudentSystem";
import InstituteManagement from "./Components/InstituteManagement";
import ProcessSection from "./Components/ProcessSection";
import ResultsSection from "./Components/ResultSection";
import CTASection from "./Components/CTA";
import FounderSection from "./Components/Founder";
import WhyChooseSection from "./Components/WhySection";
import MethodologySection from "./Components/Methodology";
import StudentJourneySection from "./Components/StudentJourney";
import InfrastructureSection from "./Components/Infrastructure";
import AdmissionCTA from "./Components/AdmissionCTA";
import StakeholderSection from "./Components/StakeHolderSection";

const Gateway = () => {
  return (
    <div>
      <HeroSection />
      <StakeholderSection />

      <TrustBar />
      <StudentJourneySection />
      <InfrastructureSection />
      <AdmissionCTA />

      <FounderSection />
      <AboutSection />
      <CoursesSection />
      <FacultySection />
      <StudentSystem />
      <MethodologySection />
      <InstituteManagement />
      <ProcessSection />
      <ResultsSection />
      <WhyChooseSection />
      <CTASection />
    </div>
  );
};

export default Gateway;
