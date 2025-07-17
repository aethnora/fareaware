import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// <<< THIS IS THE FIX: Import auth persistence functions >>>
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  setPersistence,
  browserLocalPersistence // Use local storage for persistence
} from 'firebase/auth';
// <<< END OF FIX >>>
import { auth } from '../firebase';
import Input from '../components/ui/Input';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // <<< THIS IS THE FIX: Set persistence before signing in >>>
      await setPersistence(auth, browserLocalPersistence);
      // <<< END OF FIX >>>
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setGoogleLoading(true);
    try {
      // <<< THIS IS THE FIX: Set persistence before signing in >>>
      await setPersistence(auth, browserLocalPersistence);
      // <<< END OF FIX >>>
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        
        <div className="mt-8">
            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
                {googleLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 
                <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 399.9 0 261.8 0 123.7 111.8 11.8 244 11.8c70.3 0 129.8 27.8 174.4 72.4l-69.8 69.8C314.3 119.5 282.5 102 244 102c-84.3 0-152.3 68.2-152.3 152.3s68 152.3 152.3 152.3c97.8 0 130.2-73.3 134.8-110.2H244v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                }
                Sign in with Google
            </button>
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or sign in with email</span>
            </div>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
            <Input id="email" label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email address" />
            <Input id="password" label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

          <div>
            <button type="submit" disabled={loading || googleLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400">
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center">
            <p className="text-sm">Don't have an account? <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
