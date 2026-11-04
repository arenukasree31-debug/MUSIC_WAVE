import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'musicwave_users'
const SESSION_KEY = 'musicwave_session'
const ADMIN = { id:'admin-1', name:'MusicWave Admin', email:'admin@musicwave.com', password:'Admin@123', role:'admin' }

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); return [ADMIN, ...saved.filter(u => u.email !== ADMIN.email)] }
    catch { return [ADMIN] }
  })
  const [currentUser, setCurrentUser] = useState(() => {
    try { const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); if (!session) return null; return session.email === ADMIN.email ? ADMIN : (JSON.parse(localStorage.getItem(USERS_KEY) || '[]').find(u => u.email === session.email) || null) }
    catch { return null }
  })
  useEffect(() => { localStorage.setItem(USERS_KEY, JSON.stringify(users.filter(u => u.email !== ADMIN.email))) }, [users])
  const signup = ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase()
    if (!name.trim() || !cleanEmail || password.length < 6) return { ok:false, message:'Enter all details. Password must be at least 6 characters.' }
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) return { ok:false, message:'An account with this email already exists.' }
    const user = { id:crypto.randomUUID(), name:name.trim(), email:cleanEmail, password, role:'user', favorites:[] }
    setUsers(prev => [...prev, user]); setCurrentUser(user); localStorage.setItem(SESSION_KEY, JSON.stringify({ email:user.email })); return { ok:true }
  }
  const login = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password)
    if (!user) return { ok:false, message:'Incorrect email or password.' }
    setCurrentUser(user); localStorage.setItem(SESSION_KEY, JSON.stringify({ email:user.email })); return { ok:true, role:user.role }
  }
  const logout = () => { setCurrentUser(null); localStorage.removeItem(SESSION_KEY) }
  const updateUsers = (updater) => setUsers(prev => { const next = typeof updater === 'function' ? updater(prev) : updater; if (currentUser && currentUser.role !== 'admin') setCurrentUser(next.find(u => u.id === currentUser.id) || null); return next })
  return <AuthContext.Provider value={{ users, currentUser, signup, login, logout, updateUsers }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
