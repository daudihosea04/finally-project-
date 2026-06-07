import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import HeroSection from './HeroSection';
import PlatformOverview from './PlatformOverview';
import HowItWorks from './HowItWorks';
import KeyBenefits from './KeyBenefits';
import TargetAudience from './TargetAudience';
import UpcomingEvents from './UpcomingEvents';
import Testimonials from './Testimonials';
import FeaturedResources from './FeaturedResources';
import Newsletter from './Newsletter';
import AnimatedBackground from './AnimatedBackground';

const Home = () => {
  const { colors } = useTheme();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <AnimatedBackground />
      <HeroSection setShowVideo={setShowVideo} />
      <PlatformOverview />
      <HowItWorks />
      <KeyBenefits />
      <TargetAudience />
      <UpcomingEvents />
      <Testimonials />
      <FeaturedResources />
      <Newsletter />
      
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}>
          <div className="relative max-w-4xl w-full">
            <button onClick={() => setShowVideo(false)} className="absolute -top-12 right-0 hover:opacity-70" style={{ color: colors.textPrimary }}>✖</button>
            <div className="aspect-video bg-black rounded-xl overflow-hidden" style={{ border: `2px solid ${colors.primary}` }}>
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="UCC Connect Hub Demo" frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;