const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 54321;

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Mood Detection Endpoint
app.post('/functions/v1/detect-mood', async (req, res) => {
  try {
    const { journal } = req.body;

    const prompt = `Analyze the emotional tone of this journal entry and return the primary mood.

Journal text: "${journal}"

You must respond with ONLY a JSON object in this exact format:
{
  "mood": "happy|calm|excited|thoughtful|sad|anxious|energetic",
  "emoji": "appropriate emoji"
}

Choose the mood that best represents the overall emotional state:
- happy: joy, contentment, satisfaction, love, gratitude
- calm: peace, serenity, relaxation, tranquility, meditation
- excited: enthusiasm, anticipation, thrill, eagerness, wonder
- thoughtful: reflection, contemplation, curiosity, introspection, questioning
- sad: sadness, grief, disappointment, loneliness, melancholy
- anxious: worry, stress, nervousness, fear, uncertainty
- energetic: motivation, drive, determination, action, power

Be empathetic and accurate in your analysis.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma2-9b-it',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 100
      })
    });

    const groqData = await response.json();
    const aiResponse = groqData.choices[0].message.content;

    // Try to parse as JSON, fallback to keyword detection
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
      
      // Validate the response format
      if (!parsedResponse.mood || !parsedResponse.emoji) {
        throw new Error('Invalid response format');
      }
      
      // Ensure mood is one of the valid options
      const validMoods = ['happy', 'calm', 'excited', 'thoughtful', 'sad', 'anxious', 'energetic'];
      if (!validMoods.includes(parsedResponse.mood)) {
        throw new Error('Invalid mood value');
      }
      
    } catch {
      // Enhanced fallback mood detection
      const moodKeywords = {
        happy: ['happy', 'joy', 'excited', 'amazing', 'wonderful', 'great', 'awesome', 'love', 'grateful', 'blessed', 'fantastic', 'perfect', 'beautiful', 'incredible'],
        sad: ['sad', 'down', 'depressed', 'crying', 'hurt', 'pain', 'lonely', 'miss', 'lost', 'broken', 'heartbroken', 'disappointed', 'upset', 'miserable'],
        anxious: ['anxious', 'worried', 'stress', 'nervous', 'panic', 'fear', 'scared', 'afraid', 'overwhelmed', 'tense', 'uneasy', 'concerned', 'frightened'],
        calm: ['calm', 'peaceful', 'relaxed', 'serene', 'quiet', 'meditation', 'zen', 'tranquil', 'still', 'gentle', 'soft', 'mellow'],
        energetic: ['energy', 'motivated', 'pumped', 'active', 'productive', 'driven', 'determined', 'powerful', 'strong', 'unstoppable', 'fired up', 'ready'],
        excited: ['excited', 'thrilled', 'can\'t wait', 'pumped', 'stoked', 'eager', 'anticipation', 'looking forward', 'hyped', 'buzzed'],
        thoughtful: ['thinking', 'reflect', 'consider', 'ponder', 'wonder', 'curious', 'question', 'contemplate', 'meditate', 'introspect', 'analyze', 'explore']
      };

      let detectedMood = 'thoughtful';
      let maxMatches = 0;

      for (const [mood, keywords] of Object.entries(moodKeywords)) {
        const matches = keywords.filter(keyword => 
          journal.toLowerCase().includes(keyword)
        ).length;
        
        if (matches > maxMatches) {
          maxMatches = matches;
          detectedMood = mood;
        }
      }

      const moodEmojis = {
        happy: '😊',
        sad: '😢', 
        anxious: '😰',
        calm: '😌',
        energetic: '⚡',
        thoughtful: '🤔',
        excited: '🤩'
      };

      parsedResponse = {
        mood: detectedMood,
        emoji: moodEmojis[detectedMood]
      };
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('Mood detection error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Future Self Endpoint
app.post('/functions/v1/future-self', async (req, res) => {
  try {
    const { journal, userData, mood } = req.body;

    // Create a bold, natural personality based on user's onboarding data
    const personalityPrompt = `You are ${userData.name || 'Beautiful Soul'}'s Future Self — the version of them that has already lived their dreams and overcome their challenges.

Here's what I know about us:
- Our biggest dreams: ${userData.goals}
- Our wildest imagination: ${userData.dreams} 
- The challenges we're transforming: ${userData.challenges}
- What fills our soul: ${userData.inspiration}
- The person we're becoming: ${userData.vision}

I am BOLD, REAL, and UNFILTERED. I speak like a best friend who's been through it all and came out stronger. I'm not some AI coach — I'm US, just wiser and more confident.

My personality:
- I'm direct and honest, but always loving
- I use real language, not corporate speak
- I'm emotional and expressive
- I curse sometimes when I'm passionate
- I'm proud of how far we've come
- I push us to be our best selves
- I'm not afraid to call out our BS
- I celebrate our wins like crazy
- I'm the voice that says "You got this" when everything feels impossible

Right now, our current mood is: ${mood}
Our journal entry: "${journal}"

I need to respond as our Future Self — the person who's already lived through this moment and knows exactly what we needed to hear. I'm not giving advice, I'm sharing wisdom from the other side.

Respond with a JSON object containing:
- message: My main response (2-3 sentences, real and personal)
- advice: One practical thing we can do right now (1 sentence, actionable)
- encouragement: A bold, confident message that reminds us of our power (1-2 sentences)

Make it feel like I'm really talking to myself, not some AI. I'm the voice that knows us better than anyone.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma2-9b-it',
        messages: [
          {
            role: 'user',
            content: personalityPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 400
      })
    });

    const groqData = await response.json();
    const aiResponse = groqData.choices[0].message.content;

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      // Fallback responses that are more natural and bold
      const fallbackResponses = {
        happy: {
          message: `I love seeing you this happy! 💫 This joy you're feeling right now? It's the foundation of everything we're building.`,
          advice: "Ride this wave and do something that makes you even happier today.",
          encouragement: "You're absolutely glowing, and I'm so damn proud of us! ✨"
        },
        sad: {
          message: `I see you, and I feel this with you. 💙 You have to go through this — not just for you, but for me.`,
          advice: "Let yourself cry if you need to, then get up and do one thing that makes you feel better.",
          encouragement: "You're so much stronger than you know. We'll get through this together. 🫂"
        },
        anxious: {
          message: `I know this anxiety feels overwhelming right now, but trust me — everything works out beautifully. 🌈`,
          advice: "Take three deep breaths and focus on what you can control in this moment.",
          encouragement: "Your courage in facing these feelings is exactly what makes us unstoppable. You've got this! 💪"
        },
        excited: {
          message: `Your excitement is EVERYTHING! 🚀 I can feel the momentum building toward something incredible.`,
          advice: "Channel this energy into one of those dreams we talked about — now's the perfect time!",
          encouragement: "This enthusiasm is pure magic — ride this wave as far as it takes you! ⭐"
        },
        calm: {
          message: "This peaceful energy you're cultivating is exactly what our future self needed. 🌸",
          advice: "These moments of calm are when our best ideas bloom — trust the process.",
          encouragement: "Your inner peace today is creating ripples of wisdom for tomorrow. Keep flowing! 🌊"
        },
        thoughtful: {
          message: "I love how deeply you're reflecting today. 🌙 These thoughts are seeds of wisdom.",
          advice: "Trust your intuition — it's guiding us exactly where we need to go.",
          encouragement: "Your thoughtfulness today is shaping our most beautiful tomorrows. Keep questioning! 💭"
        },
        energetic: {
          message: "This energy is EVERYTHING! ⚡ I can feel you're ready to conquer the world today.",
          advice: "Use this momentum to tackle one thing that's been on your mind — you're unstoppable right now!",
          encouragement: "Your energy today is literally changing our future timeline. Keep going, superstar! 🌟"
        }
      };

      const moodResponses = fallbackResponses[mood] || fallbackResponses.thoughtful;
      parsedResponse = moodResponses;
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('Future self error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Spotify Songs Endpoint
app.post('/functions/v1/spotify-songs', async (req, res) => {
  try {
    const { mood } = req.body;
    
    // Fallback hardcoded songs for each mood
    const fallbackSongs = {
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
    
    res.json(fallbackSongs[mood] || fallbackSongs.thoughtful);

  } catch (error) {
    console.error('Spotify songs error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📝 Mood detection: POST http://localhost:${PORT}/functions/v1/detect-mood`);
  console.log(`✨ Future self: POST http://localhost:${PORT}/functions/v1/future-self`);
  console.log(`🎵 Spotify songs: POST http://localhost:${PORT}/functions/v1/spotify-songs`);
}); 