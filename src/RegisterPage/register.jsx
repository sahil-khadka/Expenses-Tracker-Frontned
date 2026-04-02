import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import image from '../assets/image.png'
import google from '../assets/google.png'
import axios from 'axios'

  import { ToastContainer, toast } from 'react-toastify';


const Register = () => {
  const navigate = useNavigate()


  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState({ password: false, confirm: false })
  const [focused, setFocused] = useState('')
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agree) return
    try {
  

  setLoading(true)

  const data= await axios.post(' https://expenses-tracker-backend-ki3x.onrender.com/api/register', {
    userName: form.name,
    email: form.email,
    password: form.password,
    conformpassword:form.confirm,
  },
{  withCredentials: true}
)
  console.log('Registration success:', data)
 toast("Registration Sucessfull", { type: "success",autoClose: 1000 });
    setTimeout(() => {
    navigate('/otp', { state: { email: form.email } })
}, 1000);


} catch (error) {
  console.log("err",error.response.data.message)
   toast(error.response.data.message || "Registration failed. Please try again.", { type: "error" })
  if (error.response) {
    // Backend responded with an error
    console.log("erxxr",error.response.data.errors[0].message)
    console.error("Registration error:", error.response.data.message);
      toast(error.response.data.errors[0].message|| "Registration failed. Please try again.", { type: "error" });
      toast(error.response.data.errors[1].message|| "Registration failed. Please try again.", { type: "error" });
  } else if (error.request) {
    // Request was made but no response
    console.error("No response received:", error.request);
  } else {
    // Something else happened
    console.error("Error setting up request:", error.message);
  }

}
finally{
  setLoading(false)
}



  }

  const handleGoogleLogin = async () => {
  try {
    setLoading(true);

    const response = await axios.get(
      "https://expenses-tracker-backend-ki3x.onrender.com/api/loginwithgoogle",
      { withCredentials: true }
    );

    console.log("Google login success:", response.data);
    toast("Login Successful with Google", { type: "success", autoClose: 1000 });

    setTimeout(() => {
      navigate("/dashboard"); // or wherever you want to redirect after login
    }, 1000);
  } catch (error) {
    console.error("Google login error:", error.response?.data || error.message);
    toast(error.response?.data?.message || "Google login failed. Please try again.", { type: "error" });
  } finally {
    setLoading(false);
  }
};


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


      <div style={{ width: '45%', height: '100%', flexShrink: 0 }}>
        <img
          src={image}
          alt="Budget Planner"
          style={{ width: '100%', height: '96%', objectFit: 'cover', display: 'block' }}
        />
      </div>


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


            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#222', display: 'block', marginBottom: 7 }}>
                Full Name
              </label>
              <input
                type="text"
                required={true}
               
                value={form.name}
                onChange={set('name')}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
                style={inputStyle('name')}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#222', display: 'block', marginBottom: 7 }}>
                Email
              </label>
              <input
                type="email"
            required={true}
                value={form.email}
                onChange={set('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                style={inputStyle('email')}
              />
            </div>

            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#222', display: 'block', marginBottom: 7 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show.password ? 'text' : 'password'}
                  value={form.password}
                         required={true}
                  onChange={set('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('password', { paddingRight: 46 })}
                />
                <button type="button" onClick={() => setShow(s => ({ ...s, password: !s.password }))}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
                  <EyeIcon visible={show.password} />
                </button>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#222', margin: 0 }}>
                  Confirm Password
                </label>
                <span style={{ fontSize: 13, color: '#2d6a3f', fontWeight: 700, cursor: 'pointer' }}>
                  Forgot Password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={show.confirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('confirm', { paddingRight: 46 })}
                />
                <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
                  <EyeIcon visible={show.confirm} />
                </button>
              </div>
            </div>


            <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', fontSize: 13, color: '#555' }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#2d6a3f', flexShrink: 0, cursor: 'pointer' }}
              />
              <span>
                I agree to the{' '}
                <span style={{ color: '#2d6a3f', fontWeight: 700, cursor: 'pointer' }}>Terms of Service</span>
                {' '}and{' '}
                <span style={{ color: '#2d6a3f', fontWeight: 700, cursor: 'pointer' }}>Privacy Policy</span>
              </span>
            </label>  


            <button
              type="submit"
              disabled={loading || !agree}
              style={{
                padding: '13px', borderRadius: 10, border: 'none',
                background: loading || !agree ? '#86a892' : '#2d6a3f',
                color: '#fff', fontSize: 15, fontWeight: 600,
                cursor: loading || !agree ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', letterSpacing: 0.3,
                marginTop: 2,
              }}
              onMouseEnter={e => { if (!loading && agree) e.currentTarget.style.background = '#245534' }}
              onMouseLeave={e => { if (!loading && agree) e.currentTarget.style.background = '#2d6a3f' }}
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </button>


            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>Or continue with:</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>


            <button type="button"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, padding: '12px 16px', borderRadius: 10,
                border: '1.5px solid #e5e7eb', background: '#fff',
                cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
               onClick={handleGoogleLogin} 
            >
              <img src={google} alt="Google" style={{ width: 40, height: 20 }} />
              Google
            </button>

          </form>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#888', marginBottom: 0 }}>
            Already have an account? {' '}
            <span
              onClick={() => navigate('/Login')}
              style={{ color: '#2d6a3f', fontWeight: 700, cursor: 'pointer' }}
            >
              Log in
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}
export default Register
