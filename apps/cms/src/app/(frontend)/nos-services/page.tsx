import { HeroSection } from '@frontend/nos-services/sections/hero-section';
import { CoachesSection } from '@frontend/nos-services/sections/coaches-section';
import { ActivitiesSection } from '@frontend/nos-services/sections/activities-section';
import { SpacesSection } from '@frontend/nos-services/sections/spaces-section';

export default function NosServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <CoachesSection />
      <ActivitiesSection />
      <SpacesSection />
    </div>
  );
}