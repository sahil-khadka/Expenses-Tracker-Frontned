import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import image from '../assets/image.png'
import google from '../assets/google.png'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('https://expenses-tracker-backend-86b9.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        console.log('Login success:', data)
        navigate('/otp') 
      } else {
        console.log('Login error:', data.message)
      }
    } catch (error) {
      console.error('Network error:', error)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (name, extra = {}) => ({
    width: '100%',
    padding: '13px 16px',
    borderRadius: 10,
    border: `2px solid ${focused === name ? '#2d6a3f' : 'transparent'}`,
    background: '#f2f2f2',
    fontSize: 14,
    color: '#222',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    ...extra,
  })

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
      margin: 0,
      padding: 0,
    }}>

      {/* ── Left: Full height image ── */}
      <div style={{ width: '45%', height: '100%', flexShrink: 0 }}>
        <img
          src={image}
          alt="Budget Planner"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* ── Right: Login Form ── */}
      <div style={{
        flex: 1,
        height: '100%',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 60px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{
              margin: '0 0 6px', fontSize: 36, fontWeight: 700,
              fontStyle: 'italic', color: '#2d6a3f',
              fontFamily: 'Georgia, serif', letterSpacing: '-0.5px',
            }}>
              Spend Wise
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#999' }}>
              Where your spending finds balance
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#222', display: 'block', marginBottom: 7 }}>
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                style={inputStyle('email')}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#222', margin: 0 }}>
                  Password
                </label>
                <span style={{ fontSize: 13, color: '#2d6a3f', fontWeight: 700, cursor: 'pointer' }}>
                  Forgot Password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={set('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('password', { paddingRight: 46 })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', fontSize: 13, color: '#555' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#2d6a3f', flexShrink: 0, cursor: 'pointer' }}
              />
              Remember me
            </label>

            {/* Log in button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '13px', borderRadius: 10, border: 'none',
                background: loading ? '#86a892' : '#2d6a3f',
                color: '#fff', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', letterSpacing: 0.3,
                marginTop: 2,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#245534' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2d6a3f' }}
            >
              {loading ? 'Signing in…' : 'Log in'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>Or continue with:</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            {/* Google button */}
            <button
              type="button"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, padding: '12px 16px', borderRadius: 10,
                border: '1.5px solid #e5e7eb', background: '#fff',
                cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <img src={google} alt="Google" style={{ width: 40, height: 20 }} />
              Google
            </button>

          </form>


          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#888', marginBottom: 0 }}>
            Don't have an account?    {''}
            <span
              onClick={() => navigate('/')}
              style={{ color: '#2d6a3f', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
