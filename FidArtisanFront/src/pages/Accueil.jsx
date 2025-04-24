import React from 'react';
import Header  from '../components/Header';
import HeroSection from '../components/HeroSection';
import StatisticsSection from '../components/StatisticsSection';
import ProcessSection from '../components/ProcessSection';
import PopularServicesSection from '../components/PopularServicesSection';
import ValuePropositionSection from '../components/ValueProposition';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import CallToActionSection from '../components/CallToActionSection';
import Layout from './Layout';
export function Accueil() {
  return ( 
   
  <Layout>
      <HeroSection />
      <StatisticsSection />
      <ProcessSection />
      <PopularServicesSection />
      <ValuePropositionSection />
      <TestimonialsSection />
      <CallToActionSection />
      </ Layout >  
  );
}

