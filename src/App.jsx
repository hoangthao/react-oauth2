import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Login from './pages/Login'
import Page404 from './pages/Page404'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'
import ProductsPage from './pages/ProductsPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
            <Route path='/products' element={<ProductsPage />}/>
            <Route path='*' element={<Page404 />}/>
          </Route>
        </Routes>
      </BrowserRouter>
   </AuthProvider>
  )
}

export default App
