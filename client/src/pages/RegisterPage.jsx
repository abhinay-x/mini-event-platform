import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';
import { useState } from 'react';

const RegisterPage = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await registerUser(form);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p>Spin up your own events and manage RSVPs.</p>
        {error && <p className="form-error">{error}</p>}
        <div className="field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Password (min 6 chars)</label>
          <input type="password" minLength={6} name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating…' : 'Register'}
        </button>
        <p>
          Already a member? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
