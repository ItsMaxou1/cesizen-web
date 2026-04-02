import { useEffect, useState } from 'react'

interface Categorie {
  id: number
  nom: string
  description: string
}

const CategoriesPage = () => {
  const token = localStorage.getItem('token')
  const [categories, setCategories] = useState<Categorie[]>([])
  const [reload, setReload] = useState(false)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://localhost:3001/api/categories')
      const data = await res.json()
      setCategories(data)
    }
    load()
  }, [reload])

  const handleSubmit = async () => {
    const url = editId ? `http://localhost:3001/api/categories/${editId}` : 'http://localhost:3001/api/categories'
    const method = editId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nom, description })
    })
    setNom('')
    setDescription('')
    setEditId(null)
    setReload(r => !r)
  }

  const handleEdit = (categorie: Categorie) => {
    setEditId(categorie.id)
    setNom(categorie.nom)
    setDescription(categorie.description)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    await fetch(`http://localhost:3001/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setReload(r => !r)
  }

  return (
    <div>
      <h1>Catégories</h1>

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