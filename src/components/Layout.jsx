import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Search, Library, Heart, Shield, LogOut, Music2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Player from './Player'
export default function Layout({ children }) {
  const { currentUser, logout } = useAuth(); const navigate=useNavigate()
  const leave=()=>{logout();navigate('/login')}
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-icon"><Music2 size={23}/></span> musicwave</div><nav className="nav-links"><NavLink to="/" end><Home/>Home</NavLink><NavLink to="/search"><Search/>Search</NavLink><NavLink to="/library"><Library/>Your Library</NavLink><NavLink to="/favorites"><Heart/>Liked Songs</NavLink>{currentUser?.role==='admin'&&<NavLink to="/admin"><Shield/>Admin Panel</NavLink>}</nav><div className="sidebar-bottom"><div className="user-chip"><div className="avatar">{currentUser?.name?.[0]?.toUpperCase() || 'U'}</div><div className="user-meta"><b>{currentUser?.name}</b><small>{currentUser?.role==='admin'?'Administrator':'Listener'}</small></div><button className="icon-btn" title="Log out" onClick={leave}><LogOut size={17}/></button></div></div></aside><main className="main-area">{children}</main><Player/></div>
}
