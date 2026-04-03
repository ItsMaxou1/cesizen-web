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
  const [erreur, setErreur] = useState('')
  const [reload, setReload] = useState(false)
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [duree, setDuree] = useState<number | ''>('')
  const [inspiration, setInspiration] = useState<number | ''>('')
  const [apnee, setApnee] = useState<number | ''>('')
  const [expiration, setExpiration] = useState<number | ''>('')
  const [categorieId, setCategorieId] = useState<number | ''>('')
  const [editId, setEditId] = useState<number | null>(null)
  const [type, setType] = useState<'bulle' | 'barre'>('bulle')

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setErreur('Session expirée, veuillez vous reconnecter')
        setExercices([])
        return
      }

      try {
        const res = await fetch('http://localhost:3001/api/exercices', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()

        if (!res.ok) {
          setErreur(data?.message || 'Erreur lors du chargement des exercices')
          setExercices([])
          return
        }

        setExercices(Array.isArray(data)
          ? data.map((exercice) => ({
              ...exercice,
              type: exercice.type === 'barre' ? 'barre' : 'bulle'
            }))
          : [])
      } catch {
        setErreur('Erreur serveur lors du chargement des exercices')
        setExercices([])
      }
    }
    load()
  }, [reload, token])

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setCategories([])
        return
      }

      try {
        const res = await fetch('http://localhost:3001/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : [])
      } catch {
        setCategories([])
      }
    }
    load()
  }, [token])

  const handleSubmit = async () => {
    if (!token) {
      setErreur('Session expirée, veuillez vous reconnecter')
      return
    }

    const url = editId ? `http://localhost:3001/api/exercices/${editId}` : 'http://localhost:3001/api/exercices'
    const method = editId ? 'PUT' : 'POST'

    try {
      setErreur('')
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ titre, description, duree_secondes: duree, inspiration, apnee, expiration, categorieId, type })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setErreur(data?.message || 'Erreur lors de l\'enregistrement de l\'exercice')
        return
      }

      setTitre('')
      setDescription('')
      setDuree('')
      setInspiration('')
      setApnee('')
      setExpiration('')
      setCategorieId('')
      setType('bulle')
      setEditId(null)
      setReload(r => !r)
    } catch {
      setErreur('Erreur serveur lors de l\'enregistrement de l\'exercice')
    }
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
    setType(exercice.type === 'barre' ? 'barre' : 'bulle')
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
      {erreur && <p>{erreur}</p>}

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

      <select value={type} onChange={e => setType(e.target.value === 'barre' ? 'barre' : 'bulle')}>
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
            <th>Type</th>
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
              <td>{exercice.type === 'barre' ? 'Barre de progression' : 'Bulle (cercle)'}</td>
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