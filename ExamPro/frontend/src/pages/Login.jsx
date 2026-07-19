import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/v1/auth/login', formData);
      const user = response.data;
      
      if (isAdminLogin && user.role !== 'admin') {
        setError('Access denied. You are not an administrator.');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            {isAdminLogin ? 'Admin Portal Login' : 'Sign in to ExamPro'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isAdminLogin ? 'For administrators only' : 'For registered students'}
          </p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mt-6">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isAdminLogin ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setIsAdminLogin(false); setError(''); }}
          >
            Student
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isAdminLogin ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setIsAdminLogin(true); setError(''); }}
          >
            Administrator
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 font-medium">{error}</div>}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address / Username</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={isAdminLogin ? "admin@example.com" : "student@example.com"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="••••••••" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors">
              {loading ? 'Authenticating...' : (isAdminLogin ? 'Login to Admin Portal' : 'Sign In')}
            </button>
          </div>
          
          {!isAdminLogin && (
            <div className="text-center text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500">Register now</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
