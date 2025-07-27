import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import DynamicBackground from '@/components/DynamicBackground';

const Welcome = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Check if user has onboarded
    const userData = localStorage.getItem('soulSyncUserData');
    if (userData) {
      navigate('/journal');
      return;
    }
    
    // Show content with delay for smooth animation
    setTimeout(() => setShowContent(true), 500);
  }, [navigate]);
  
  const startOnboarding = () => {
    navigate('/onboard');
  };
  
  return (
    <DynamicBackground mood="thoughtful">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`text-center max-w-2xl transition-soul duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo & Title */}
          <div className="mb-8">
            <div className="text-8xl mb-6 emoji-bounce">✨</div>
            <h1 className="text-5xl md:text-7xl font-bold gradient-soul bg-clip-text text-transparent mb-4">
              SoulSync
            </h1>
            <p className="text-xl md:text-2xl gradient-energy bg-clip-text text-transparent font-semibold mb-6">
              Connect with Your Future Self
            </p>
          </div>
          
          {/* Description */}
          <div className="mb-12 space-y-4">
            <p className="text-lg text-foreground/80 leading-relaxed">
              Welcome to a journaling experience like no other 💫
            </p>
            <p className="text-base text-foreground/70 leading-relaxed">
              Share your thoughts, dreams, and struggles. Get wisdom, encouragement, 
              and guidance from your Future Self powered by AI. Plus enjoy mood-based 
              music and a vibe that matches your soul.
            </p>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card/60 backdrop-blur-lg rounded-2xl p-6 shadow-soul border border-border/50">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-bold mb-2">AI Future Self</h3>
              <p className="text-sm text-muted-foreground">Get personalized wisdom from your future self</p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-lg rounded-2xl p-6 shadow-soul border border-border/50">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-bold mb-2">Mood Music</h3>
              <p className="text-sm text-muted-foreground">AI-generated tunes that match your vibe</p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-lg rounded-2xl p-6 shadow-soul border border-border/50">
              <div className="text-3xl mb-3">🌈</div>
              <h3 className="font-bold mb-2">Vibes & Aesthetics</h3>
              <p className="text-sm text-muted-foreground">Beautiful, mood-responsive design</p>
            </div>
          </div>
          
          {/* CTA */}
          <Button 
            variant="soul" 
            size="xl" 
            onClick={startOnboarding}
            className="group"
          >
            <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Start Your Soul Journey
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Takes 2 minutes to set up ⏰
          </p>
        </div>
      </div>
    </DynamicBackground>
  );
};

export default Welcome;