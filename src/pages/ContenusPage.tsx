import { useEffect, useState } from 'react'

interface Categorie {
  id: number
  nom: string
}

interface Contenu {
  id: number
  titre: string
  contenu: string
  isActive: boolean
  categorie: Categorie
}

const ContenusPage = () => {
  const token = localStorage.getItem('token')
  const [contenus, setContenus] = useState<Contenu[]>([])
  const [categories, setCategories] = useState<Categorie[]>([])
  const [reload, setReload] = useState(false)
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [categorieId, setCategorieId] = useState(0)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://localhost:3001/api/contenus')
      const data = await res.json()
      setContenus(data)
    }
    load()
  }, [reload])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://localhost:3001/api/categories')
      const data = await res.json()
      setCategories(data)
    }
    load()
  }, [])

  const handleSubmit = async () => {
    const url = editId ? `http://localhost:3001/api/contenus/${editId}` : 'http://localhost:3001/api/contenus'
    const method = editId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ titre, contenu, categorieId })
    })
    setTitre('')
    setContenu('')
    setCategorieId(0)
    setEditId(null)
    setReload(r => !r)
  }

  const handleEdit = (c: Contenu) => {
    setEditId(c.id)
    setTitre(c.titre)
    setContenu(c.contenu)
    setCategorieId(c.categorie.id)
  }

  const handleToggle = async (id: number) => {
    await fetch(`http://localhost:3001/api/contenus/${id}/toggle`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    setReload(r => !r)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce contenu ?')) return
    await fetch(`http://localhost:3001/api/contenus/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setReload(r => !r)
  }

  return (
    <div>
      <h1>Contenus informatifs</h1>

      <h2>{editId ? 'Modifier' : 'Ajouter'} un contenu</h2>
      <input placeholder='Titre' value={titre} onChange={e => setTitre(e.target.value)} />
      <textarea placeholder='Contenu' value={contenu} onChange={e => setContenu(e.target.value)} />
      <select value={categorieId} onChange={e => setCategorieId(Number(e.target.value))}>
        <option value={0}>Choisir une catégorie</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>
      <button 
        className='warning' 
        onClick={handleSubmit}>{editId ? 'Modifier' : 'Ajouter'}
      </button>

      {editId && 
        <button
          className='secondary' 
          onClick={() => setEditId(null)}>Annuler
        </button>
      }

      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Actif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contenus.map(c => (
            <tr key={c.id}>
              <td>{c.titre}</td>
              <td>{c.categorie.nom}</td>
              <td>{c.isActive ? 'Oui' : 'Non'}</td>
              <td>
                <button 
                  className='warning' 
                  onClick={() => handleEdit(c)}>Modifier
                </button>
                <button
                  className={c.isActive ? 'toggle-off' : 'toggle-on'} 
                  onClick={() => handleToggle(c.id)}>{c.isActive ? 'Désactiver' : 'Activer'}
                </button>

                <button 
                  className='danger' 
                  onClick={() => handleDelete(c.id)}>Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ContenusPage