import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Sparkles } from 'lucide-react';
import { UserData, FAKE_API_GENERATE_AVATAR } from '@/lib/fakeApi';
import Avatar from '@/components/Avatar';
import DynamicBackground from '@/components/DynamicBackground';

const Onboard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string>('');
  
  const [userData, setUserData] = useState<UserData>({
    goals: '',
    dreams: '',
    challenges: '',
    inspiration: '',
    vision: '',
    name: ''
  });
  
  const questions = [
    {
      id: 'name',
      title: 'What should your Future Self call you? ✨',
      placeholder: 'Your name or nickname...',
      emoji: '👋',
      gradient: 'gradient-soul'
    },
    {
      id: 'goals',
      title: 'What dreams are you manifesting this year? 🌟',
      placeholder: 'Share your biggest goals and aspirations...',
      emoji: '🎯',
      gradient: 'gradient-energy'
    },
    {
      id: 'dreams',
      title: 'If anything was possible, what would you create? 💫',
      placeholder: 'Let your imagination run wild...',
      emoji: '🦄',
      gradient: 'gradient-dreamy'
    },
    {
      id: 'challenges',
      title: 'What challenges are you ready to transform? 💪',
      placeholder: 'Share what you want to overcome...',
      emoji: '🔥',
      gradient: 'gradient-excited'
    },
    {
      id: 'inspiration',
      title: 'What fills your soul with pure joy? 🌈',
      placeholder: 'Tell me about what inspires you...',
      emoji: '✨',
      gradient: 'gradient-happy'
    },
    {
      id: 'vision',
      title: 'Paint me a picture of your future self 🖼️',
      placeholder: 'Describe who you\'re becoming...',
      emoji: '🔮',
      gradient: 'gradient-calm'
    }
  ];
  
  const currentQuestion = questions[currentStep];
  
  const handleInputChange = (value: string) => {
    setUserData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadedImage(file);
    setIsGeneratingAvatar(true);
    
    try {
      const avatarUrl = await FAKE_API_GENERATE_AVATAR(file);
      setGeneratedAvatar(avatarUrl);
      setUserData(prev => ({ ...prev, avatar: avatarUrl }));
    } catch (error) {
      console.error('Error generating avatar:', error);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };
  
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save user data and navigate to journal
      localStorage.setItem('soulSyncUserData', JSON.stringify(userData));
      navigate('/journal');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const isStepComplete = userData[currentQuestion.id as keyof UserData]?.trim() !== '';
  const progress = ((currentStep + 1) / questions.length) * 100;
  
  return (
    <DynamicBackground mood="thoughtful">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold gradient-soul bg-clip-text text-transparent mb-4">
              SoulSync ✨
            </h1>
            <p className="text-lg text-foreground/80 mb-6">
              Let's connect you with your Future Self
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-background/30 rounded-full h-2 mb-6">
              <div 
                className="h-full gradient-energy rounded-full transition-soul"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-foreground/60">
              Step {currentStep + 1} of {questions.length}
            </p>
          </div>
          
          {/* Question Card */}
          <Card className="bg-card/60 backdrop-blur-lg border-border/50 shadow-dreamy">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 emoji-bounce">{currentQuestion.emoji}</div>
                <h2 className={`text-2xl md:text-3xl font-bold ${currentQuestion.gradient} bg-clip-text text-transparent mb-4`}>
                  {currentQuestion.title}
                </h2>
              </div>
              
              {/* Avatar Upload (only on first step) */}
              {currentStep === 0 && (
                <div className="mb-6 text-center">
                  <Label className="text-sm font-medium mb-4 block">
                    Upload a photo for your AI avatar (optional) 📸
                  </Label>
                  
                  <div className="flex items-center justify-center gap-6">
                    <Avatar 
                      src={generatedAvatar} 
                      size="xl" 
                      className={isGeneratingAvatar ? 'animate-pulse' : ''} 
                    />
                    
                    <div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isGeneratingAvatar}
                      />
                      <Label
                        htmlFor="avatar-upload"
                        className="cursor-pointer"
                      >
                        <Button variant="dreamy" asChild disabled={isGeneratingAvatar}>
                          <span>
                            {isGeneratingAvatar ? (
                              <div className="typing-dots">Generating</div>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Photo
                              </>
                            )}
                          </span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Input */}
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  value={userData[currentQuestion.id as keyof UserData] || ''}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full h-16 text-lg rounded-xl border-border/50 focus:ring-primary/50 focus:border-primary/50 bg-background/50"
                />
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-8"
                >
                  Back
                </Button>
                
                <Button
                  variant="soul"
                  onClick={handleNext}
                  disabled={!isStepComplete}
                  className="px-8"
                >
                  {currentStep === questions.length - 1 ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Journey
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DynamicBackground>
  );
};

export default Onboard;