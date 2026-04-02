import { useEffect, useState } from 'react'

interface User {
  id: number
  email: string
  nom: string
  prenom: string
  role: string
  isActive: boolean
}

const UtilisateursPage = () => {
  const token = localStorage.getItem('token')
  const [users, setUsers] = useState<User[]>([])
  const [erreur, setErreur] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [reload, setReload] = useState(false)

  const toggleActif = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/users/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      loadUsers()
    } catch {
      setErreur('Erreur lors de la modification')
    }
  }

  const deleteUser = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      loadUsers()
    } catch {
      setErreur('Erreur lors de la suppression')
    }
  }

  const loadUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) {
        setErreur('Erreur lors du chargement des utilisateurs')
        return
      }
      setUsers(data)
    } catch {
      setErreur('Erreur lors du chargement des utilisateurs')
    }
  }

  const createAdmin = async () => {
    await fetch('http://localhost:3001/api/users/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nom, prenom, email, mot_de_passe: motDePasse })
    })
    setNom('')
    setPrenom('')
    setEmail('')
    setMotDePasse('')
    setReload(r => !r)
  }

  useEffect(() => {
    loadUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  return (
    <div>
      <h1>Utilisateurs</h1>
      {erreur && <p>{erreur}</p>}
      <h2>Créer un administrateur</h2>
      <input placeholder='Nom' value={nom} onChange={e => setNom(e.target.value)} />
      <input placeholder='Prénom' value={prenom} onChange={e => setPrenom(e.target.value)} />
      <input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
      <input type='password' placeholder='Mot de passe' value={motDePasse} onChange={e => setMotDePasse(e.target.value)} />
      <button onClick={createAdmin}>Créer un admin</button>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Oui' : 'Non'}</td>
              <td>
                <button
                  className={user.isActive ? 'toggle-off' : 'toggle-on'}
                  onClick={() => toggleActif(user.id)}>
                  {user.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button className='danger' onClick={() => deleteUser(user.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UtilisateursPage