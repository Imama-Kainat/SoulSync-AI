import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, ExternalLink, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mood, FAKE_API_GET_AI_MUSIC, FAKE_API_GET_SPOTIFY_SONGS, spotifyPlaylists } from '@/lib/fakeApi';

interface MusicPlayerProps {
  mood: Mood;
}

const MusicPlayer = ({ mood }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [spotifySongs, setSpotifySongs] = useState<any[]>([]);
  const [currentSpotifyIndex, setCurrentSpotifyIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const moodEmojis: Record<Mood, string> = {
    happy: '😊',
    calm: '😌', 
    excited: '🤩',
    thoughtful: '🤔',
    sad: '😢',
    anxious: '😰',
    energetic: '⚡'
  };
  
  // Auto-load AI music and Spotify songs when mood changes
  useEffect(() => {
    const loadMusicForMood = async () => {
      setIsLoadingAI(true);
      setIsLoadingSpotify(true);
      
      try {
        // Load AI music
        const aiUrl = await FAKE_API_GET_AI_MUSIC(mood);
        setAudioUrl(aiUrl);
        
        // Load Spotify songs
        const songs = await FAKE_API_GET_SPOTIFY_SONGS(mood);
        setSpotifySongs(songs);
        setCurrentSpotifyIndex(0);
        
        // Auto-play AI music
        if (audioRef.current) {
          audioRef.current.src = aiUrl;
          setTimeout(() => {
            audioRef.current?.play();
            setIsPlaying(true);
          }, 500);
        }
      } catch (error) {
        console.error('Error loading music:', error);
      } finally {
        setIsLoadingAI(false);
        setIsLoadingSpotify(false);
      }
    };
    
    loadMusicForMood();
  }, [mood]);

  const handlePlayAIMusic = async () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePlaySpotifySong = async (songUrl: string) => {
    if (audioRef.current && songUrl) {
      audioRef.current.src = songUrl;
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  const openSpotifyPlaylist = () => {
    window.open(spotifyPlaylists[mood], '_blank');
  };
  
  return (
    <div className="bg-card/60 backdrop-blur-lg rounded-2xl p-6 shadow-dreamy border border-border/50">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold gradient-soul bg-clip-text text-transparent mb-2">
          Music for your {mood} mood {moodEmojis[mood]}
        </h3>
        <p className="text-muted-foreground text-sm">
          Let the vibes match your soul ✨
        </p>
      </div>
      
      <div className="space-y-4">
        {/* AI Generated Music */}
        <div className="flex items-center gap-3">
          <Button
            variant="energy"
            size="lg"
            onClick={handlePlayAIMusic}
            disabled={isLoadingAI || !audioUrl}
            className="flex-1"
          >
            {isLoadingAI ? (
              <div className="typing-dots">Loading AI Vibes</div>
            ) : (
              <>
                🎧 Play AI Music
              </>
            )}
          </Button>
        </div>
        
        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-background/50 rounded-xl p-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="shrink-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1">
              <div className="text-sm font-medium">AI Generated Vibes</div>
              <div className="text-xs text-muted-foreground">Perfect for your {mood} energy</div>
            </div>
            
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            
            <audio
              ref={audioRef}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            />
          </div>
        )}
        
        {/* Spotify Songs */}
        {spotifySongs.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Music className="w-4 h-4" />
              Spotify Recommendations
            </h4>
            {spotifySongs.slice(0, 3).map((song, index) => (
              <div key={index} className="bg-background/30 rounded-lg p-3 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlaySpotifySong(song.preview_url)}
                  disabled={!song.preview_url}
                  className="shrink-0 w-8 h-8"
                >
                  <Play className="w-3 h-3" />
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{song.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Spotify Playlist */}
        <Button
          variant="dreamy"
          size="lg"
          onClick={openSpotifyPlaylist}
          className="w-full"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          🔗 Open Full Playlist
        </Button>
      </div>
    </div>
  );
};

export default MusicPlayer;