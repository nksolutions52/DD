import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/layout/Footer';

const LoginPage = () => {
  const { login, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setLoginError(error || 'Failed to log in');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary-50 via-blue-50 to-accent-50">
      <div className="w-full max-w-md mx-auto p-4 sm:p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="images/tooth-logo.svg" alt="K-Health Logo" className="h-16 w-16 mb-2 drop-shadow-xl" />
          <h1 className="text-3xl font-extrabold text-primary-700 mb-1 tracking-tight">K-Health</h1>
          <p className="text-base text-neutral-600 text-center max-w-xs">Welcome back! Please sign in to continue.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-primary-700 mb-6 text-center">Sign in to your account</h2>
          {(loginError || error) && (
            <div className="mb-4 rounded-lg bg-error-50 border border-error-200 p-3 text-sm text-error-700 text-center">
              {loginError || error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full px-4 py-3 rounded-xl border border-primary-200 bg-primary-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-primary-900 placeholder-primary-400"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full px-4 py-3 rounded-xl border border-primary-200 bg-primary-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-primary-900 placeholder-primary-400"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-primary-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary text-white w-full py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center"><span className="spinner mr-2"></span>Signing in...</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        {/* Optional: Demo info as tooltip or info icon, not in main UI */}
      </div>
      <div className="w-full mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default LoginPage;
