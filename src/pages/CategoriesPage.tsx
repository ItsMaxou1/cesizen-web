import { useEffect, useState } from 'react'

interface Categorie {
  id: number
  nom: string
  description: string
}

const CategoriesPage = () => {
  const token = localStorage.getItem('token')
  const [categories, setCategories] = useState<Categorie[]>([])
  const [erreur, setErreur] = useState('')
  const [reload, setReload] = useState(false)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setErreur('Session expirée, veuillez vous reconnecter')
        setCategories([])
        return
      }

      setErreur('')

      try {
        const res = await fetch('http://localhost:3001/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()

        if (!res.ok) {
          setErreur(data?.message || 'Erreur lors du chargement des catégories')
          setCategories([])
          return
        }

        setCategories(Array.isArray(data) ? data : [])
      } catch {
        setErreur('Erreur serveur lors du chargement des catégories')
        setCategories([])
      }
    }

    load()
  }, [reload, token])

  const handleSubmit = async () => {
    if (!token) {
      setErreur('Session expirée, veuillez vous reconnecter')
      return
    }

    const url = editId ? `http://localhost:3001/api/categories/${editId}` : 'http://localhost:3001/api/categories'
    const method = editId ? 'PUT' : 'POST'

    try {
      setErreur('')
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nom, description })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setErreur(data?.message || 'Erreur lors de l\'enregistrement de la catégorie')
        return
      }

      setNom('')
      setDescription('')
      setEditId(null)
      setReload(r => !r)
    } catch {
      setErreur('Erreur serveur lors de l\'enregistrement de la catégorie')
    }
  }

  const handleEdit = (categorie: Categorie) => {
    setEditId(categorie.id)
    setNom(categorie.nom)
    setDescription(categorie.description)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return

    if (!token) {
      setErreur('Session expirée, veuillez vous reconnecter')
      return
    }

    try {
      setErreur('')
      const res = await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setErreur(data?.message || 'Erreur lors de la suppression de la catégorie')
        return
      }

      setReload(r => !r)
    } catch {
      setErreur('Erreur serveur lors de la suppression de la catégorie')
    }
  }

  return (
    <div>
      <h1>Catégories</h1>
      {erreur && <p>{erreur}</p>}

      <h2>{editId ? 'Modifier' : 'Ajouter'} une catégorie</h2>
      <input placeholder='Nom' value={nom} onChange={e => setNom(e.target.value)} />
      <input placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
      <button 
        className='warning' 
        onClick={handleSubmit}>{editId ? 'Modifier' : 'Ajouter'}
      </button>
      
      {editId && 
        <button
          className='secondary' 
          onClick={() => { setEditId(null); setNom(''); setDescription('') }}>Annuler
        </button>
      }

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(categorie => (
            <tr key={categorie.id}>
              <td>{categorie.nom}</td>
              <td>{categorie.description}</td>
              <td>
                <button 
                  className='warning' 
                  onClick={() => handleEdit(categorie)}>Modifier
                </button>

                <button 
                  className='danger' 
                  onClick={() => handleDelete(categorie.id)}>Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoriesPage