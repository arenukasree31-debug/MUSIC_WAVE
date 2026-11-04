import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { starterSongs } from '../data'
const MusicContext = createContext(null)
export function MusicProvider({ children }) {
  const [songs, setSongs] = useState(() => { try { return JSON.parse(localStorage.getItem('musicwave_songs')) || starterSongs } catch { return starterSongs } })
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(.75)
  const audioRef = useRef(null)
  useEffect(() => localStorage.setItem('musicwave_songs', JSON.stringify(songs)), [songs])
  useEffect(() => { const a=audioRef.current; if (!a) return; if (isPlaying) a.play().catch(()=>setIsPlaying(false)); else a.pause() }, [isPlaying, currentSong])
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])
  const playSong = (song) => { if (currentSong?.id === song.id) setIsPlaying(true); else { setCurrentSong(song); setCurrentTime(0); setIsPlaying(true) } }
  const nextSong = () => { if (!songs.length) return; const i=songs.findIndex(s=>s.id===currentSong?.id); playSong(songs[(i+1+songs.length)%songs.length]) }
  const previousSong = () => { if (!songs.length) return; const i=songs.findIndex(s=>s.id===currentSong?.id); playSong(songs[(i-1+songs.length)%songs.length]) }
  const addSong = song => setSongs(prev=>[...prev, { ...song, id:crypto.randomUUID() }])
  const updateSong = song => setSongs(prev=>prev.map(s=>s.id===song.id?song:s))
  const deleteSong = id => { setSongs(prev=>prev.filter(s=>s.id!==id)); if(currentSong?.id===id){setIsPlaying(false);setCurrentSong(null)} }
  return <MusicContext.Provider value={{ songs, setSongs, currentSong, isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration, volume, setVolume, playSong, nextSong, previousSong, addSong, updateSong, deleteSong, audioRef }}>
    {children}<audio ref={audioRef} src={currentSong?.audio || ''} onTimeUpdate={e=>setCurrentTime(e.currentTarget.currentTime)} onLoadedMetadata={e=>setDuration(e.currentTarget.duration || 0)} onEnded={nextSong} onError={()=>setIsPlaying(false)} />
  </MusicContext.Provider>
}
export const useMusic = () => useContext(MusicContext)
