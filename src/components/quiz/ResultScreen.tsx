import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowRight } from 'lucide-react';

import HeroResult from '@/components/quiz/result/HeroResult';
import MeaningCard from '@/components/quiz/result/MeaningCard';
import ProjectionCard from '@/components/quiz/result/ProjectionCard';
import ProtocolBrandCard from '@/components/quiz/result/ProtocolBrandCard';
import LockedReportCard from '@/components/quiz/result/LockedReportCard';
import OfferCard from '@/components/quiz/result/OfferCard';
import Testimonials from '@/components/quiz/result/Testimonials';
import MiniFAQ from '@/components/quiz/result/MiniFAQ';

interface ResultScreenProps {
  profile: any;
  onRedo: () => void;
  onAccess: () => void;
}

export default function ResultScreen({ profile, onRedo, onAccess }: ResultScreenProps) {
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="app-frame relative safe-bottom animate-fade-in-up">
        <HeroResult skinAge={profile.skinAge} scores={profile.scores} />

        <div className="w-full space-y-6 mt-4">
          <MeaningCard skinAge={profile.skinAge} />
          <ProjectionCard s
