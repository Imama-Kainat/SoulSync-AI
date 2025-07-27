import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Send, Heart } from 'lucide-react';
import { 
  UserData, 
  Mood, 
  MoodResult, 
  FutureSelfResponse,
  FAKE_API_DETECT_MOOD, 
  FAKE_API_FUTURE_SELF_RESPONSE 
} from '@/lib/fakeApi';
import Avatar from '@/components/Avatar';
import DynamicBackground from '@/components/DynamicBackground';
import MusicPlayer from '@/components/MusicPlayer';
import Navigation from '@/components/Navigation';

const Journal = () => {
  const [journalText, setJournalText] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mood, setMood] = useState<MoodResult | null>(null);
  const [futureSelfResponse, setFutureSelfResponse] = useState<FutureSelfResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGettingResponse, setIsGettingResponse] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  
  useEffect(() => {
    const savedUserData = localStorage.getItem('soulSyncUserData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);
  
  const handleSubmit = async () => {
    if (!journalText.trim() || !userData) return;
    
    setIsAnalyzing(true);
    setMood(null);
    setFutureSelfResponse(null);
    setShowResponse(false);
    
    try {
      // Step 1: Detect mood
      const moodResult = await FAKE_API_DETECT_MOOD(journalText);
      setMood(moodResult);
      
      // Step 2: Get Future Self response with user data
      setIsGettingResponse(true);
      const response = await FAKE_API_FUTURE_SELF_RESPONSE(
        journalText, 
        userData, 
        moodResult.mood
      );
      setFutureSelfResponse(response);
      setShowResponse(true);
      
    } catch (error) {
      console.error('Error processing journal entry:', error);
    } finally {
      setIsAnalyzing(false);
      setIsGettingResponse(false);
    }
  };
  
  const currentMood: Mood = mood?.mood || 'thoughtful';
  
  return (
    <DynamicBackground mood={currentMood}>
      <div className="min-h-screen p-4 pb-20 md:pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-3xl md:text-5xl font-bold gradient-soul bg-clip-text text-transparent mb-4">
              SoulSync Journal ✨
            </h1>
            {userData && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <Avatar src={userData.avatar} size="md" />
                <p className="text-lg text-foreground/80">
                  Hey {userData.name || 'Beautiful Soul'}! Ready to connect with your Future Self? 💫
                </p>
              </div>
            )}
            {userData && (
              <div className="text-sm text-foreground/60 mb-4">
                <p>Dreaming of: {userData.goals}</p>
                <p>Inspired by: {userData.inspiration}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Journal Input */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card/60 backdrop-blur-lg border-border/50 shadow-dreamy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <span className="text-2xl">📝</span>
                    Today's Soul Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Pour your heart out... Share what's on your mind, your dreams, your struggles, your victories. Your Future Self is listening with love ❤️"
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    className="min-h-[200px] text-base resize-none rounded-xl border-border/50 focus:ring-primary/50 focus:border-primary/50 bg-background/50"
                  />
                  
                  <Button
                    variant="soul"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!journalText.trim() || isAnalyzing || isGettingResponse}
                    className="w-full"
                  >
                    {isAnalyzing || isGettingResponse ? (
                      <div className="typing-dots">
                        {isAnalyzing ? 'Reading your soul' : 'Your Future Self is responding'}
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Connect with Future Self
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
              
              {/* Mood Detection */}
              {mood && (
                <Card className="bg-card/60 backdrop-blur-lg border-border/50 shadow-dreamy animate-fade-in">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-4xl mb-2 emoji-bounce">{mood.emoji}</div>
                      <p className="text-lg font-medium capitalize">{mood.mood}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Future Self Response */}
              {showResponse && futureSelfResponse && (
                <Card className="bg-card/60 backdrop-blur-lg border-border/50 shadow-dreamy animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl gradient-soul bg-clip-text text-transparent">
                      <Sparkles className="w-5 h-5" />
                      Message from Your Future Self
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-background/50 rounded-xl p-4">
                        <p className="text-base leading-relaxed">{futureSelfResponse.message}</p>
                      </div>
                      
                      <div className="bg-accent/20 rounded-xl p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="text-lg">💡</span>
                          Soul Advice
                        </h4>
                        <p className="text-sm">{futureSelfResponse.advice}</p>
                      </div>
                      
                      <div className="bg-primary/10 rounded-xl p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Encouragement
                        </h4>
                        <p className="text-sm">{futureSelfResponse.encouragement}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Music Player */}
              {mood && <MusicPlayer mood={mood.mood} />}
              
              {/* Navigation */}
              <div className="hidden md:block">
                <Navigation />
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Navigation />
        </div>
      </div>
    </DynamicBackground>
  );
};

export default Journal;