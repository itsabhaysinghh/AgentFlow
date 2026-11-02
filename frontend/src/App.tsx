import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeatureIndicators } from '@/components/FeatureIndicators';
import { WorkflowModal } from '@/components/WorkflowModal';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      {/* Top Navigation */}
      <Header 
        onStartBuilding={() => setIsModalOpen(true)}
        onExploreWorkflows={() => setIsModalOpen(true)}
      />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-end pt-20">
        <Hero 
          onStartBuilding={() => setIsModalOpen(true)}
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
}

export default App;
