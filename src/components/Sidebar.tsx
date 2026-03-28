import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const Sidebar = () => {
  const { user, logout } = useAuth()

  return (
    <div className='sidebar'>
      <h2>CESIZen</h2>
      <p>Bonjour {user?.prenom}</p>
      <nav>
        <NavLink to='/'>Utilisateurs</NavLink>
        <NavLink to='/categories'>Catégories</NavLink>
        <NavLink to='/exercices'>Exercices</NavLink>
        <NavLink to='/contenus'>Contenus</NavLink>
        <NavLink to='/commentaires'>Commentaires</NavLink>
      </nav>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  )
}

export default Sidebar