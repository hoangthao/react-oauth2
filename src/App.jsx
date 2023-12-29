import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Login from './pages/Login'
import Page404 from './pages/Page404'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>}/>
            <Route path='/login' element={<Login />}/>
            <Route path='*' element={<Page404 />}/>
          </Route>
        </Routes>
      </BrowserRouter>
   </AuthProvider>
  )
}

export default App
