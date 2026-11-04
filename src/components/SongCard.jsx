import { Play } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
export default function SongCard({song,index}){const {playSong}=useMusic();return <button className="song-card" onClick={()=>playSong(song)}><div className="cover-wrap"><img src={song.cover} alt=""/><span className="card-play"><Play size={20} fill="currentColor"/></span></div><b>{song.title}</b><small>{song.artist}</small></button>}
