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
    <div className="min-h-screen flex flex-col md:flex-row items-stretch justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-white">
      {/* Left: Logo and Welcome */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 text-white relative">
        <div className="absolute top-2 left-2 md:top-4 md:left-4 hidden md:block z-10">
          <img src="images/tooth-logo.svg" alt="Tooth Icon" className="h-10 w-10 md:h-16 md:w-16 drop-shadow-xl" />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 mt-4 mb-4 md:mt-6 md:mb-6">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">K-Health</h1>
          <p className="text-lg md:text-2xl font-medium opacity-90 mb-4 text-center max-w-xs md:max-w-md">
            Welcome Back!<br />
            Log in to manage your appointments and patient records.
          </p>
        </div>
        <div className="flex-1 flex items-end justify-center w-full pb-2 md:pb-0">
          <img src="images/dental.svg" alt="Dental Illustration" className="w-32 h-32 sm:w-40 sm:h-40 md:w-72 md:h-72 lg:w-96 lg:h-96 opacity-80 max-h-[40vh] md:max-h-[60vh]" />
        </div>
      </div>
      {/* Right: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-0 md:p-0 min-h-screen bg-transparent">
        <div className="flex-1 flex items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Sign in to your account</h2>
            {(loginError || error) && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700 text-center">
                {loginError || error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-1">
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
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-900 placeholder-blue-400"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-1">
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
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-900 placeholder-blue-400"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-blue-900">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary text-white w-full py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-8 text-center text-xs text-blue-400">
              Demo accounts:<br />
              <span className="font-medium text-blue-700">Admin:</span> admin@example.com &nbsp;|&nbsp;
              <span className="font-medium text-blue-700">Dentist:</span> dentist@example.com &nbsp;|&nbsp;
              <span className="font-medium text-blue-700">Receptionist:</span> receptionist@example.com <br />
              Password: <span className="font-mono">password123</span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
