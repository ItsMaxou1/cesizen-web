import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import UtilisateursPage from './UtilisateursPage'
import CategoriesPage from './CategoriesPage'
import ExercicesPage from './ExercicesPage'
import ContenusPage from './ContenusPage'
import CommentairesPage from './CommentairesPage'

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