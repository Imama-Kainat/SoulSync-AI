import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { journal } = await req.json()

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

Be empathetic and accurate in your analysis.`

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
    })

    const groqData = await response.json()
    const aiResponse = groqData.choices[0].message.content

    // Try to parse as JSON, fallback to keyword detection
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse)
      
      // Validate the response format
      if (!parsedResponse.mood || !parsedResponse.emoji) {
        throw new Error('Invalid response format')
      }
      
      // Ensure mood is one of the valid options
      const validMoods = ['happy', 'calm', 'excited', 'thoughtful', 'sad', 'anxious', 'energetic']
      if (!validMoods.includes(parsedResponse.mood)) {
        throw new Error('Invalid mood value')
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
      }

      let detectedMood = 'thoughtful'
      let maxMatches = 0

      for (const [mood, keywords] of Object.entries(moodKeywords)) {
        const matches = keywords.filter(keyword => 
          journal.toLowerCase().includes(keyword)
        ).length
        
        if (matches > maxMatches) {
          maxMatches = matches
          detectedMood = mood
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
      }

      parsedResponse = {
        mood: detectedMood,
        emoji: moodEmojis[detectedMood as keyof typeof moodEmojis]
      }
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