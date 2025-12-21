import React from 'react'
import HeroSection from '../Components/Hero'
import TrustBar from '../Components/TrustBar'
import AboutSection from '../Components/AboutSection'
import CoursesSection from '../Components/CourseSection'
import FacultySection from '../Components/FacultySection'
import StudentSystem from '../Components/StudentSystem'
import InstituteManagement from '../Components/InstituteManagement'
import ProcessSection from '../Components/ProcessSection'
import ResultsSection from '../Components/ResultSection'
import CTASection from '../Components/CTA'
import FounderSection from '../Components/Founder'
import WhyChooseSection from '../Components/WhySection'
import MethodologySection from '../Components/Methodology'
import StudentJourneySection from '../Components/StudentJourney'
import InfrastructureSection from '../Components/Infrastructure'
import AdmissionCTA from '../Components/AdmissionCTA'
import StakeholderSection from '../Components/StakeHolderSection'

const Gateway = () => {
  return (
    <div>
      {/* 1. ATTENTION: Hook them immediately */}
      <HeroSection/>                 {/* The promise */}
      <TrustBar/>                    {/* "Trusted by..." social proof */}
      
      {/* 2. INTEREST: Prove you are good, then show what you sell */}
      <ResultsSection/>              {/* MOVE UP: In education, Toppers/Results are the #1 selling point */}
      <AboutSection/>                {/* Brief context on who you are */}
      <CoursesSection/>              {/* MOVE UP: The Product. What can I actually buy/study? */}
      
      {/* 3. DESIRE (Logic): Why are you better than others? */}
      <WhyChooseSection/>            {/* The USP (Unique Selling Propositions) */}
      <FacultySection/>              {/* The "Star Power" - Teachers are critical */}
      <MethodologySection/>          {/* How you teach (your secret sauce) */}
      <StudentSystem/>               {/* Tech advantage (LMS, Portals, etc.) */}
      
      {/* 4. DESIRE (Emotion/Trust): Build deeper connection */}
      <FounderSection/>              {/* Authority and Vision */}
      <InfrastructureSection/> 
       <InstituteManagement/>                       {/* Physical facilities/Labs */}
      <StudentJourneySection/>       {/* "Imagine yourself here" */}
      
      {/* 5. ACTION: How to join */}
      <ProcessSection/>              {/* Steps to join */}
      <AdmissionCTA/>                {/* The specific "Apply Now" block */}
      
      {/* 6. SUPPORTING INFO (Optional/Lower Priority) */}
      <StakeholderSection/>          {/* Good for footer area or specific stakeholders */}
      {/* <InstituteManagement/> */}{/* WARNING: Is this for students? If it's backend admin stuff, hide it. If it's "Efficiency", keep it low. */}
      
      {/* 7. FINAL PUSH */}
      <CTASection/>                  {/* Final "Don't miss out" wrapper */}
    </div>
  )
}

export default Gateway
