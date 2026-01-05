import React from "react";
import HeroSection from "../../Components/Hero/Hero";
import TrustBar from "../../Components/Institute/TrustBar";
import AboutSection from "../../Components/About/AboutSection";
import CoursesSection from "../../Components/Course/CourseSection";
import FacultySection from "../../Components/Faculty/FacultySection";
import StudentSystem from "../../Components/Student/StudentSystem";
import InstituteManagement from "../../Components/Institute/InstituteManagement";
import ProcessSection from "../../Components/Institute/ProcessSection";
import ResultsSection from "../../Components/Institute/ResultSection";
import CTASection from "../../Components/Institute/CTA";
import FounderSection from "../../Components/Founder/Founder";
import WhyChooseSection from "../../Components/Institute/WhySection";
import MethodologySection from "../../Components/Institute/Methodology";
import StudentJourneySection from "../../Components/Student/StudentJourney";
import InfrastructureSection from "../../Components/Infrastructure/Infrastructure";
import AdmissionCTA from "../../Components/Admission/AdmissionCTA";
import StakeholderSection from "../../Components/Institute/StakeHolderSection";

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
 