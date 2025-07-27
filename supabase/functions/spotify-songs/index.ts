import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SPOTIFY_CLIENT_ID = Deno.env.get('VITE_SPOTIFY_CLIENT_ID')
const SPOTIFY_CLIENT_SECRET = Deno.env.get('VITE_SPOTIFY_CLIENT_SECRET')

// Get Spotify access token
async function getSpotifyToken() {
  const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  })
  
  const data = await response.json()
  return data.access_token
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { mood } = await req.json()

    // Map mood to search queries
    const moodQueries: Record<string, string> = {
      happy: 'upbeat happy pop',
      calm: 'chill relaxing ambient',
      excited: 'energetic pump up',
      thoughtful: 'reflective indie folk',
      sad: 'melancholy sad ballad',
      anxious: 'calming anxiety relief',
      energetic: 'workout high energy'
    }

    const query = moodQueries[mood] || 'chill music'
    
    try {
      const token = await getSpotifyToken()
      
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      const searchData = await searchResponse.json()
      
      const songs = searchData.tracks?.items?.map((track: any) => ({
        name: track.name,
        artist: track.artists[0]?.name,
        preview_url: track.preview_url,
        external_url: track.external_urls?.spotify,
        image: track.album?.images?.[0]?.url
      })) || []

      return new Response(
        JSON.stringify(songs),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    } catch (spotifyError) {
      console.error('Spotify API error:', spotifyError)
      
      // Fallback hardcoded songs
      const fallbackSongs: Record<string, any[]> = {
        happy: [
          { name: "Happy", artist: "Pharrell Williams", preview_url: "https://example.com/happy1.mp3" },
          { name: "Good 4 U", artist: "Olivia Rodrigo", preview_url: "https://example.com/happy2.mp3" }
        ],
        calm: [
          { name: "Weightless", artist: "Marconi Union", preview_url: "https://example.com/calm1.mp3" },
          { name: "River", artist: "Leon Bridges", preview_url: "https://example.com/calm2.mp3" }
        ],
        excited: [
          { name: "Can't Stop the Feeling", artist: "Justin Timberlake", preview_url: "https://example.com/excited1.mp3" },
          { name: "Uptown Funk", artist: "Bruno Mars", preview_url: "https://example.com/excited2.mp3" }
        ],
        thoughtful: [
          { name: "The Night We Met", artist: "Lord Huron", preview_url: "https://example.com/thoughtful1.mp3" },
          { name: "Mad World", artist: "Gary Jules", preview_url: "https://example.com/thoughtful2.mp3" }
        ],
        sad: [
          { name: "Someone Like You", artist: "Adele", preview_url: "https://example.com/sad1.mp3" },
          { name: "Hurt", artist: "Johnny Cash", preview_url: "https://example.com/sad2.mp3" }
        ],
        anxious: [
          { name: "Breathe", artist: "Telepopmusik", preview_url: "https://example.com/anxious1.mp3" },
          { name: "Stress Relief", artist: "Nature Sounds", preview_url: "https://example.com/anxious2.mp3" }
        ],
        energetic: [
          { name: "Thunder", artist: "Imagine Dragons", preview_url: "https://example.com/energetic1.mp3" },
          { name: "Eye of the Tiger", artist: "Survivor", preview_url: "https://example.com/energetic2.mp3" }
        ]
      }
      
      return new Response(
        JSON.stringify(fallbackSongs[mood] || fallbackSongs.thoughtful),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

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