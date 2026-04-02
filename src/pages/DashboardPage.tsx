import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import UtilisateursPage from '../pages/UtilisateursPage'
import CategoriesPage from '../pages/CategoriesPage'
import ExercicesPage from '../pages/ExercicesPage'
import ContenusPage from '../pages/ContenusPage'
import CommentairesPage from '../pages/CommentairesPage'

const DashboardPage = () => {
  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='dashboard-content'>
        <Routes>
          <Route path='/' element={<UtilisateursPage />} />
          <Route path='/categories' element={<CategoriesPage />} />
          <Route path='/exercices' element={<ExercicesPage />} />
          <Route path='/contenus' element={<ContenusPage />} />
          <Route path='/commentaires' element={<CommentairesPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default DashboardPage