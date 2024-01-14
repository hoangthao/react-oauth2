import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Login from './pages/Login'
import Page404 from './pages/Page404'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'
import ProductsPage from './pages/lab/ProductsPage'
import ProfilePage from './pages/ProfilePage'
import ProductsInfinitePage from './pages/lab/ProductsInfinitePage'
import ProductsSearchPage from './pages/lab/ProductsSearchPage'
import ProductsFilteringPage from './pages/lab/ProductsFilteringPage'
import ProductsInfiniteFilterPage from './pages/lab/ProductsInfiniteFilterPage'
import EnglishPage from './pages/toeic/EnglishPage'
import ToeicBookPage from './pages/toeic/ToeicBookPage'
import EnglishLayout from './pages/toeic/EnglishLayout'
import ToeicUnitPage from './pages/toeic/ToeicUnitPage'
import ToeicQuestionPage from './pages/toeic/ToeicQuestionPage'
import ToeicPartPage from './pages/toeic/ToeicPartPage'

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
            <Route path='/english' element={<EnglishLayout />}>
              <Route index element={<EnglishPage/>} />
              <Route path='toeic'>
                <Route index  element={<ToeicBookPage />} />
                <Route path=':bookId'>
                  <Route index element={<ToeicUnitPage />} />
                  <Route path=':unitId'>
                    <Route index element={<ToeicPartPage />} />
                    <Route path=':partId' element={<ToeicQuestionPage />}/>
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path='/lab'>
              <Route path='products-1' element={<ProductsPage />}/>
              <Route path='products-2' element={<ProductsInfinitePage />}/>
              <Route path='products-3' element={<ProductsSearchPage />}/>
              <Route path='products-4' element={<ProductsFilteringPage />}/>
              <Route path='products-5' element={<ProductsInfiniteFilterPage />}/>
            </Route>
            <Route path='*' element={<Page404 />}/>
          </Route>
        </Routes>
      </BrowserRouter>
   </AuthProvider>
  )
}

export default App
