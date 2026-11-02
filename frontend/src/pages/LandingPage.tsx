import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeatureIndicators } from '@/components/FeatureIndicators';
import { WorkflowModal } from '@/components/WorkflowModal';

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      {/* Top Navigation */}
      <Header 
        onStartBuilding={() => navigate('/app')}
        onExploreWorkflows={() => navigate('/app/workflows')}
      />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-end pt-20">
        <Hero 
          onStartBuilding={() => navigate('/app')}
          onExploreWorkflows={() => setIsModalOpen(true)}
        />
      </div>

      {/* Understated Feature Indicators */}
      <FeatureIndicators />

      {/* Interactive Workflow Pipeline Preview Modal */}
      <WorkflowModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};
