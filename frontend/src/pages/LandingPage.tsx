import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeatureIndicators } from '@/components/FeatureIndicators';
import { MarketingSections } from '@/components/MarketingSections';
import type { MarketingSection } from '@/components/Header';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<MarketingSection | null>(null);

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      {/* Top Navigation */}
      <Header 
        onStartBuilding={() => navigate('/login')}
        onSelectSection={setActiveSection}
      />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-end pt-20">
        <Hero 
          onStartBuilding={() => navigate('/login')}
          onExploreFeatures={() => setActiveSection('features')}
        />
      </div>

      {/* Understated Feature Indicators */}
      <FeatureIndicators />

      {activeSection && <MarketingSections section={activeSection} />}
    </main>
  );
};

