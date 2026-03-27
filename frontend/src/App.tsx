import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/home'
import LinkPage from './pages/LinkPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/:id' element={<LinkPage/>}/>
    </Routes>
  )
}

export default App