import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import UtilisateursPage from '../components/UtilisateursPage'
import CategoriesPage from '../components/CategoriesPage'
import ExercicesPage from '../components/ExercicesPage'
import ContenusPage from '../components/ContenusPage'
import CommentairesPage from '../components/CommentairesPage'

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