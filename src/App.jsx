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
import ProductsInfinitePage from './pages/ProductsInfinitePage'
import ProductsSearchPage from './pages/ProductsSearchPage'
import ProductsFilteringPage from './pages/ProductsFilteringPage'

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/products-1' element={<ProductsPage />}/>
            <Route path='/products-2' element={<ProductsInfinitePage />}/>
            <Route path='/products-3' element={<ProductsSearchPage />}/>
            <Route path='/products-4' element={<ProductsFilteringPage />}/>
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
            <Route path='*' element={<Page404 />}/>
          </Route>
        </Routes>
      </BrowserRouter>
   </AuthProvider>
  )
}

export default App
