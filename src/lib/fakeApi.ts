// Fake API functions for SoulSync - to be replaced with real APIs later

export interface UserData {
  goals: string;
  dreams: string;
  challenges: string;
  inspiration: string;
  vision: string;
  avatar?: string;
  name?: string;
}

export type Mood = 'happy' | 'calm' | 'excited' | 'thoughtful' | 'sad' | 'anxious' | 'energetic';

export interface MoodResult {
  mood: Mood;
  emoji: string;
}

export interface FutureSelfResponse {
  message: string;
  advice: string;
  encouragement: string;
}

// Fake API: Generate avatar from uploaded image
export const FAKE_API_GENERATE_AVATAR = async (imageFile?: File): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a cute generated avatar URL (placeholder)
  const avatarStyles = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=soul1&backgroundColor=b6e3f4,c0aede,d1d4f9&clothesColor=25557c,65c9ff,5199e4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=soul2&backgroundColor=ffd5dc,ffdfba,d1d4f9&clothesColor=ff6b9d,65c9ff,5199e4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=soul3&backgroundColor=c7ceea,ffd3e4,d1d4f9&clothesColor=662d91,ff6b9d,65c9ff"
  ];
  
  return avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
};

// API: Detect mood from journal text using Groq
export const FAKE_API_DETECT_MOOD = async (journal: string): Promise<MoodResult> => {
  try {
    const response = await fetch('/api/detect-mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ journal }),
    });

    if (!response.ok) {
      throw new Error('Failed to detect mood');
    }

    return await response.json();
  } catch (error) {
    console.error('Error detecting mood:', error);
    
    // Fallback to local detection
    const moodMapping: Record<Mood, { emoji: string; keywords: string[] }> = {
      happy: { emoji: "😊", keywords: ["good", "great", "amazing", "love", "joy", "excited", "wonderful"] },
      calm: { emoji: "😌", keywords: ["peaceful", "calm", "serene", "quiet", "meditate", "relax"] },
      excited: { emoji: "🤩", keywords: ["excited", "can't wait", "thrilled", "pumped", "awesome"] },
      thoughtful: { emoji: "🤔", keywords: ["thinking", "wonder", "curious", "question", "ponder"] },
      sad: { emoji: "😢", keywords: ["sad", "down", "depressed", "hurt", "cry", "upset"] },
      anxious: { emoji: "😰", keywords: ["worried", "anxious", "stress", "nervous", "scared"] },
      energetic: { emoji: "⚡", keywords: ["energy", "motivated", "ready", "go", "action"] }
    };
    
    const lowerJournal = journal.toLowerCase();
    let detectedMood: Mood = 'thoughtful';
    let maxMatches = 0;
    
    for (const [mood, { keywords }] of Object.entries(moodMapping)) {
      const matches = keywords.filter(keyword => lowerJournal.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedMood = mood as Mood;
      }
    }
    
    return {
      mood: detectedMood,
      emoji: moodMapping[detectedMood].emoji
    };
  }
};

// API: Future Self Response using Groq
export const FAKE_API_FUTURE_SELF_RESPONSE = async (
  journal: string, 
  userData: UserData, 
  mood: Mood
): Promise<FutureSelfResponse> => {
  try {
    const response = await fetch('/api/future-self', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ journal, userData, mood }),
    });

    if (!response.ok) {
      throw new Error('Failed to get future self response');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting future self response:', error);
    
    // Fallback responses
    const responses: Record<Mood, FutureSelfResponse[]> = {
      happy: [
        {
          message: `I love seeing you this joyful! 💫 Your happiness today is building the foundation for all our future adventures.`,
          advice: "Keep nurturing this positive energy - it's your superpower!",
          encouragement: "You're absolutely glowing today, and I'm so proud of how far we've come! ✨"
        }
      ],
      calm: [
        {
          message: "This peaceful energy you're cultivating is exactly what our future self needed. 🌸",
          advice: "These moments of calm are when our best ideas bloom. Trust the process.",
          encouragement: "Your inner peace today is creating ripples of wisdom for tomorrow. Keep flowing! 🌊"
        }
      ],
      excited: [
        {
          message: "Your excitement is infectious! 🚀 I can feel the momentum building toward something incredible.",
          advice: "Channel this energy into those dreams we talked about - now's the perfect time!",
          encouragement: "This enthusiasm is pure magic - ride this wave as far as it takes you! ⭐"
        }
      ],
      thoughtful: [
        {
          message: "I love how deeply you're reflecting today. 🌙 These thoughts are seeds of wisdom.",
          advice: "Trust your intuition - it's guiding us exactly where we need to go.",
          encouragement: "Your thoughtfulness today is shaping our most beautiful tomorrows. Keep questioning! 💭"
        }
      ],
      sad: [
        {
          message: `I see you, and I feel this with you. 💙 You have to do this — not just for you, but for me.`,
          advice: "Let yourself feel this fully - it's part of our journey to joy.",
          encouragement: "You're so much stronger than you know. I'm here, and we'll get through this together. 🫂"
        }
      ],
      anxious: [
        {
          message: "I understand this anxiety, and I want you to know - everything works out beautifully. 🌈",
          advice: "Take three deep breaths with me. Focus on what you can control right now.",
          encouragement: "Your courage in facing these feelings is exactly what makes us unstoppable. You've got this! 💪"
        }
      ],
      energetic: [
        {
          message: "This energy is EVERYTHING! ⚡ I can feel you're ready to conquer the world today.",
          advice: "Use this momentum to tackle one thing that's been on your mind - you're unstoppable right now!",
          encouragement: "Your energy today is literally changing our future timeline. Keep going, superstar! 🌟"
        }
      ]
    };
    
    const moodResponses = responses[mood];
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  }
};

// Hardcoded AI-generated music URLs for each mood
export const hardcodedAIMusic: Record<Mood, string> = {
  happy: "https://youtu.be/Kz2MJwtoAHw",
  calm: "https://youtu.be/kBhQjYqOG10", 
  excited: "https://youtu.be/RWr3RJDOb2g",
  thoughtful: "https://youtu.be/RWr3RJDOb2g",
  sad: "https://youtu.be/LtHyBr1xxT8",
  anxious: "https://youtu.be/LtHyBr1xxT8",
  energetic: "https://youtu.be/ylC2XELKS0I"
};

// API: Get AI-generated music based on mood
export const FAKE_API_GET_AI_MUSIC = async (mood: Mood): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return hardcodedAIMusic[mood];
};

// API: Get Spotify songs based on mood
export const FAKE_API_GET_SPOTIFY_SONGS = async (mood: Mood): Promise<any[]> => {
  try {
    const response = await fetch('/api/spotify-songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood }),
    });

    if (!response.ok) throw new Error('Failed to get Spotify songs');
    return await response.json();
  } catch (error) {
    console.error('Error getting Spotify songs:', error);
    
    // Fallback hardcoded songs
    const fallbackSongs: Record<Mood, any[]> = {
      happy: [
        { name: "Happy", artist: "Pharrell Williams", preview_url: "https://example.com/spotify/happy1.mp3" },
        { name: "Good 4 U", artist: "Olivia Rodrigo", preview_url: "https://example.com/spotify/happy2.mp3" }
      ],
      calm: [
        { name: "Weightless", artist: "Marconi Union", preview_url: "https://example.com/spotify/calm1.mp3" },
        { name: "River", artist: "Leon Bridges", preview_url: "https://example.com/spotify/calm2.mp3" }
      ],
      excited: [
        { name: "Can't Stop the Feeling", artist: "Justin Timberlake", preview_url: "https://example.com/spotify/excited1.mp3" },
        { name: "Uptown Funk", artist: "Bruno Mars", preview_url: "https://example.com/spotify/excited2.mp3" }
      ],
      thoughtful: [
        { name: "The Night We Met", artist: "Lord Huron", preview_url: "https://example.com/spotify/thoughtful1.mp3" },
        { name: "Mad World", artist: "Gary Jules", preview_url: "https://example.com/spotify/thoughtful2.mp3" }
      ],
      sad: [
        { name: "Someone Like You", artist: "Adele", preview_url: "https://example.com/spotify/sad1.mp3" },
        { name: "Hurt", artist: "Johnny Cash", preview_url: "https://example.com/spotify/sad2.mp3" }
      ],
      anxious: [
        { name: "Breathe", artist: "Telepopmusik", preview_url: "https://example.com/spotify/anxious1.mp3" },
        { name: "Stress Relief", artist: "Nature Sounds", preview_url: "https://example.com/spotify/anxious2.mp3" }
      ],
      energetic: [
        { name: "Thunder", artist: "Imagine Dragons", preview_url: "https://example.com/spotify/energetic1.mp3" },
        { name: "Eye of the Tiger", artist: "Survivor", preview_url: "https://example.com/spotify/energetic2.mp3" }
      ]
    };
    
    return fallbackSongs[mood] || fallbackSongs.thoughtful;
  }
};

// Spotify playlist mapping
export const spotifyPlaylists: Record<Mood, string> = {
  happy: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
  calm: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
  excited: "https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda",
  thoughtful: "https://open.spotify.com/playlist/37i9dQZF1DX4E3UdUs7fUx",
  sad: "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1",
  anxious: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
  energetic: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP"
};