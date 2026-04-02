import { useEffect, useState } from 'react'

interface Categorie {
  id: number
  nom: string
}

interface Exercice {
  id: number
  titre: string
  description: string
  duree_secondes: number
  inspiration: number
  apnee: number
  expiration: number
  isActive: boolean
  categorie: Categorie
  type: string
  //categorie: Categorie veut dire que chaque exercice contient un objet catégorie avec id et nom
}

const ExercicesPage = () => {
  const token = localStorage.getItem('token')
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [categories, setCategories] = useState<Categorie[]>([])
  const [reload, setReload] = useState(false)
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [duree, setDuree] = useState<number | ''>('')
  const [inspiration, setInspiration] = useState<number | ''>('')
  const [apnee, setApnee] = useState<number | ''>('')
  const [expiration, setExpiration] = useState<number | ''>('')
  const [categorieId, setCategorieId] = useState<number | ''>('')
  const [editId, setEditId] = useState<number | null>(null)
  const [type, setType] = useState('bulle')

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://localhost:3001/api/exercices')
      const data = await res.json()
      setExercices(data)
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
    const url = editId ? `http://localhost:3001/api/exercices/${editId}` : 'http://localhost:3001/api/exercices'
    const method = editId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ titre, description, duree_secondes: duree, inspiration, apnee, expiration, categorieId, type })
    })
    setTitre('')
    setDescription('')
    setDuree(0)
    setInspiration(0)
    setApnee(0)
    setExpiration(0)
    setCategorieId(0)
    setEditId(null)
    setReload(r => !r)
  }

  const handleEdit = (exercice: Exercice) => {
    setEditId(exercice.id)
    setTitre(exercice.titre)
    setDescription(exercice.description)
    setDuree(exercice.duree_secondes)
    setInspiration(exercice.inspiration)
    setApnee(exercice.apnee)
    setExpiration(exercice.expiration)
    setCategorieId(exercice.categorie.id)
    setType(exercice.type)
  }

  const handleToggle = async (id: number) => {
    await fetch(`http://localhost:3001/api/exercices/${id}/toggle`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    setReload(r => !r)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet exercice ?')) return
    await fetch(`http://localhost:3001/api/exercices/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setReload(r => !r)
  }

  return (
    <div>
      <h1>Exercices de respiration</h1>

      <h2>{editId ? 'Modifier' : 'Ajouter'} un exercice</h2>
      <input placeholder='Titre' value={titre} onChange={e => setTitre(e.target.value)} />
      <input placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
      <input type='number' placeholder='Durée totale en secondes' value={duree} onChange={e => setDuree(e.target.value === '' ? '' : Number(e.target.value))} />
      <input type='number' placeholder='Inspiration en secondes' value={inspiration} onChange={e => setInspiration(e.target.value === '' ? '' : Number(e.target.value))} />
      <input type='number' placeholder='Apnée en secondes' value={apnee} onChange={e => setApnee(e.target.value === '' ? '' : Number(e.target.value))} />
      <input type='number' placeholder='Expiration en secondes' value={expiration} onChange={e => setExpiration(e.target.value === '' ? '' : Number(e.target.value))} />

      <select value={categorieId} onChange={e => setCategorieId(Number(e.target.value))}>
        <option value={0}>Choisir une catégorie</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>

      <select value={type} onChange={e => setType(e.target.value)}>
        <option value='bulle'>Bulle (cercle)</option>
        <option value='barre'>Barre de progression</option>
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
            <th>Inspiration</th>
            <th>Apnée</th>
            <th>Expiration</th>
            <th>Actif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exercices.map(exercice => (
            <tr key={exercice.id}>
              <td>{exercice.titre}</td>
              <td>{exercice.categorie.nom}</td>
              <td>{exercice.inspiration}s</td>
              <td>{exercice.apnee}s</td>
              <td>{exercice.expiration}s</td>
              <td>{exercice.isActive ? 'Oui' : 'Non'}</td>
              <td>
                <button 
                  className='warning' 
                  onClick={() => handleEdit(exercice)}>Modifier
                </button>

                <button
                  className={exercice.isActive ? 'toggle-off' : 'toggle-on'} 
                  onClick={() => handleToggle(exercice.id)}>{exercice.isActive ? 'Désactiver' : 'Activer'}
                </button>
                
                <button 
                  className='danger' 
                  onClick={() => handleDelete(exercice.id)}>Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExercicesPage