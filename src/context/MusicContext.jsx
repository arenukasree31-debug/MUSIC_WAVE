
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { starterSongs } from '../data'

const MusicContext = createContext(null)

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('musicwave_songs_v6')) || starterSongs
    } catch {
      return starterSongs
    }
  })
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)

  const ytPlayerRef = useRef(null)
  const ytReadyRef = useRef(false)
  const songsRef = useRef(songs)
  const currentSongRef = useRef(currentSong)

  useEffect(() => {
    songsRef.current = songs
    localStorage.setItem('musicwave_songs_v6', JSON.stringify(songs))
  }, [songs])

  useEffect(() => {
    currentSongRef.current = currentSong
  }, [currentSong])

  useEffect(() => {
    const createPlayer = () => {
      if (ytPlayerRef.current || !window.YT?.Player) return
      ytPlayerRef.current = new window.YT.Player('yt-hidden-player', {
        height: '200',
        width: '200',
        playerVars: {
          autoplay: 1,
          controls: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin
        },
        events: {
          onReady: (e) => {
            ytReadyRef.current = true
            e.target.setVolume(volume * 100)
            if (currentSongRef.current?.youtubeId) {
              e.target.loadVideoById(currentSongRef.current.youtubeId)
            }
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
              setDuration(e.target.getDuration() || 0)
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false)
            } else if (e.data === window.YT.PlayerState.ENDED) {
              const list = songsRef.current
              if (!list.length) return
              const i = list.findIndex((s) => s.id === currentSongRef.current?.id)
              const next = list[(i + 1 + list.length) % list.length]
              setCurrentSong(next)
              setCurrentTime(0)
              setIsPlaying(true)
            }
          },
          onError: (err) => {
            console.warn('YouTube embed blocked for this video ID:', err.data)
            setIsPlaying(false)
          }
        }
      })
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      if (!existing) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
      }
      window.onYouTubeIframeAPIReady = createPlayer
    }
  }, [])

  useEffect(() => {
    const p = ytPlayerRef.current
    if (!p || !ytReadyRef.current || !currentSong?.youtubeId) return
    p.loadVideoById(currentSong.youtubeId)
    p.setVolume(volume * 100)
  }, [currentSong])

  useEffect(() => {
    const p = ytPlayerRef.current
    if (!p || !ytReadyRef.current || !currentSong) return
    if (isPlaying) p.playVideo()
    else p.pauseVideo()
  }, [isPlaying])

  useEffect(() => {
    const p = ytPlayerRef.current
    if (p && ytReadyRef.current) p.setVolume(volume * 100)
  }, [volume])

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      const p = ytPlayerRef.current
      if (p && ytReadyRef.current && typeof p.getCurrentTime === 'function') {
        setCurrentTime(p.getCurrentTime() || 0)
        setDuration(p.getDuration() || 0)
      }
    }, 500)
    return () => clearInterval(timer)
  }, [isPlaying])

  const audioRef = useRef({
    set currentTime(val) {
      const p = ytPlayerRef.current
      if (p && ytReadyRef.current && typeof p.seekTo === 'function') {
        p.seekTo(val, true)
      }
    },
    get currentTime() {
      const p = ytPlayerRef.current
      return p && ytReadyRef.current && typeof p.getCurrentTime === 'function'
        ? p.getCurrentTime()
        : 0
    }
  })

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(true)
    } else {
      setCurrentSong(song)
      setCurrentTime(0)
      setIsPlaying(true)
    }
  }

  const nextSong = () => {
    if (!songs.length) return
    const i = songs.findIndex((s) => s.id === currentSong?.id)
    playSong(songs[(i + 1 + songs.length) % songs.length])
  }

  const previousSong = () => {
    if (!songs.length) return
    const i = songs.findIndex((s) => s.id === currentSong?.id)
    playSong(songs[(i - 1 + songs.length) % songs.length])
  }

  const addSong = (song) =>
    setSongs((prev) => [...prev, { ...song, id: crypto.randomUUID() }])

  const updateSong = (song) =>
    setSongs((prev) => prev.map((s) => (s.id === song.id ? song : s)))

  const deleteSong = (id) => {
    setSongs((prev) => prev.filter((s) => s.id !== id))
    if (currentSong?.id === id) {
      setIsPlaying(false)
      setCurrentSong(null)
    }
  }

  return (
    <MusicContext.Provider
      value={{
        songs,
        setSongs,
        currentSong,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        volume,
        setVolume,
        playSong,
        nextSong,
        previousSong,
        addSong,
        updateSong,
        deleteSong,
        audioRef
      }}
    >
      {children}
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: 108,
          width: 200,
          height: 115,
          borderRadius: 10,
          overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          zIndex: 9,
          display: currentSong ? 'block' : 'none',
          background: '#000'
        }}
      >
        <div id="yt-hidden-player" />
      </div>
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)
