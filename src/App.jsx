import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import { Login, Signup } from './pages/Auth'
import { Admin, Home, Library, SearchPage } from './pages/Pages'
function Protected({children}){const {currentUser}=useAuth();return currentUser?children:<Navigate to="/login" replace/>}
function App(){return <Routes><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route path="/" element={<Protected><Layout><Home/></Layout></Protected>}/><Route path="/search" element={<Protected><Layout><SearchPage/></Layout></Protected>}/><Route path="/library" element={<Protected><Layout><Library/></Layout></Protected>}/><Route path="/favorites" element={<Navigate to="/library" replace/>}/><Route path="/admin" element={<Protected><Layout><Admin/></Layout></Protected>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
export default App
