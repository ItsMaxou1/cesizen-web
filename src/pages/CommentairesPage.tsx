import { useEffect, useState } from 'react'

interface Commentaire {
  id: number
  contenu: string
  createdAt: string
  utilisateur: {
    nom: string
    prenom: string
  }
}

const CommentairesPage = () => {
  const token = localStorage.getItem('token')
  const [commentaires, setCommentaires] = useState<Commentaire[]>([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://localhost:3001/api/commentaires', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCommentaires(data)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce commentaire ?')) return
    await fetch(`http://localhost:3001/api/commentaires/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setReload(r => !r)
  }

  return (
    <div>
      <h1>Commentaires</h1>
      <table>
        <thead>
          <tr>
            <th>Auteur</th>
            <th>Commentaire</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commentaires.map(c => (
            <tr key={c.id}>
              <td>{c.utilisateur.prenom} {c.utilisateur.nom}</td>
              <td>{c.contenu}</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(c.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CommentairesPage