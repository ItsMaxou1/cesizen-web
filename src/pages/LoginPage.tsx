import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErreur('')

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe: motDePasse })
      })

      const data = await res.json()

      if (!res.ok) {
        setErreur(data.message)
        return
      }

      if (data.user.role !== 'ADMIN') {
        setErreur('Accès refusé, vous n\'êtes pas administrateur')
        return
      }

      login(data.user, data.token)
      navigate('/')
    } catch {
        setErreur('Erreur serveur')
    }
  }

  return (
    <div className='login-container'>
      <h1>CESIZen - Administration</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Mot de passe'
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
        {erreur && <p className='erreur'>{erreur}</p>}
        <button type='submit'>Se connecter</button>
      </form>
    </div>
  )
}

export default LoginPage