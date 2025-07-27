import { Mood } from '@/lib/fakeApi';

interface DynamicBackgroundProps {
  mood: Mood;
  children: React.ReactNode;
}

const DynamicBackground = ({ mood, children }: DynamicBackgroundProps) => {
  const moodBackgrounds: Record<Mood, string> = {
    happy: 'gradient-happy',
    calm: 'gradient-calm', 
    excited: 'gradient-excited',
    thoughtful: 'gradient-dreamy',
    sad: 'gradient-calm',
    anxious: 'gradient-dreamy',
    energetic: 'gradient-energy'
  };
  
  return (
    <div className={`min-h-screen ${moodBackgrounds[mood]} transition-soul relative overflow-hidden`}>
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 float">✨</div>
      <div className="absolute top-32 right-20 text-4xl opacity-30 float" style={{ animationDelay: '1s' }}>🌙</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-25 float" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-32 right-10 text-3xl opacity-35 float" style={{ animationDelay: '0.5s' }}>⭐</div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DynamicBackground;