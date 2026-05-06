import { Metadata } from 'next';
import { HeroSection } from './home-page/hero-section';
import { ServicesSection } from './home-page/services-section';
import Subscriptions from '@frontend/components/home/subscriptions';
import { ValuesSection } from './home-page/values-section';
import { TheyTalkAboutUsSection } from './home-page/they-talk-about-us-section';

export default function HomePage() {
  return (
    <main role="main">
      <HeroSection />
      <ServicesSection />
      <Subscriptions />
      <ValuesSection />
      <TheyTalkAboutUsSection />
    </main>
  );
}
