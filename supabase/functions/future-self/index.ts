import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

interface UserData {
  name?: string;
  goals: string;
  dreams: string; 
  challenges: string;
  inspiration: string;
  vision: string;
}

interface RequestBody {
  journal: string;
  userData: UserData;
  mood: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { journal, userData, mood }: RequestBody = await req.json()

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

Make it feel like I'm really talking to myself, not some AI. I'm the voice that knows us better than anyone.`

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
    })

    const groqData = await response.json()
    const aiResponse = groqData.choices[0].message.content

    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
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
      }

      const moodResponses = fallbackResponses[mood as keyof typeof fallbackResponses] || fallbackResponses.thoughtful
      parsedResponse = moodResponses
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})