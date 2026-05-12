import { useState } from 'react'
import API from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import "../styles/signup.css";
export default function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    try {
      const res = await API.post('/auth/register', form)

      setSuccess(res.data.message)
      setError('')

      setTimeout(() => navigate('/login'), 1500)

    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className='auth-page'>
      <form className='auth-card' onSubmit={submit}>
        <h1>Create Account</h1>

        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}

        <input
          type='text'
          placeholder='Name'
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type='email'
          placeholder='Email'
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type='password'
          placeholder='Password'
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button>Signup</button>

        <p>
          Already registered? <Link to='/login'>Login</Link>
        </p>
      </form>
    </div>
  )
}