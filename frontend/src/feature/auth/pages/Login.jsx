import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import ContinueWithGoogle from '../components/ContinueWithGoogle';
import { useSelector } from 'react-redux';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector(state => state.auth?.user);

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedUser = await handleLogin({
      email: formData.email,
      password: formData.password
    });

    if (loggedUser?.role === 'buyyer') {
      navigate('/');
    } else if (loggedUser?.role === 'seller') {
      navigate('/seller/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#1A1A1A] flex flex-col justify-between selection:bg-[#EAE4D3] selection:text-[#1A1A1A] antialiased">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-[#E8E6DF] bg-white/90 backdrop-blur-md px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold tracking-[0.25em] uppercase text-[#1A1A1A] font-serif">
              SNITCH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
          </Link>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#757470]">
              Spring / Summer 26
            </span>
            <Link
              to="/register"
              className="text-xs uppercase tracking-wider text-[#1A1A1A] hover:bg-[#F5F4EE] transition-colors py-1.5 px-3.5 rounded-md border border-[#E8E6DF] font-semibold"
            >
              Join Privé
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-16 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-center">

          {/* LEFT COLUMN: Editorial Brand Showcase */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A880]/30 bg-white text-[11px] font-medium tracking-[0.2em] text-[#B89758] uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
                <span>Member Portal • Atelier Privé</span>
              </div>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif text-[#1A1A1A] leading-[1.15] font-normal">
                Curated Fashion. <br />
                <span className="italic text-[#B89758]">Uncompromising Style.</span>
              </h2>

              <p className="text-sm md:text-base text-[#5C5A55] font-light leading-relaxed max-w-lg">
                Sign in to manage your private orders, access reserved atelier drops, and explore tailored designer releases.
              </p>
            </div>

            {/* Privileges Highlight Card */}
            <div className="rounded-2xl border border-[#E8E6DF] bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB] text-xs">
                <span className="tracking-[0.15em] uppercase text-[#1A1A1A] font-semibold">Member Privileges</span>
                <span className="text-[#B89758] font-medium">Privé Access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1">
                  <p className="text-[10px] text-[#757470] uppercase tracking-wider">Fast Checkout</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">One-Tap Vault</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#757470] uppercase tracking-wider">Saved Fits</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">Tailored Profiles</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#757470] uppercase tracking-wider">Seller Suite</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">Partner Portal</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EFEB] flex items-center justify-between text-[11px] text-[#757470]">
                <span>Encrypted &amp; Secure Authentication</span>
                <span className="text-[#1A1A1A] font-medium">256-bit SSL</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Minimalist Login Form Card */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto order-1 lg:order-2">
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#E8E6DF] p-6 sm:p-10 shadow-[0_12px_44px_rgba(26,26,26,0.06)] relative">
              <div className="mb-7">
                <h3 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] mb-2 font-serif">
                  Welcome Back
                </h3>
                <p className="text-xs sm:text-sm text-[#757470] font-light">
                  Enter your credentials to access your Snitch account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#1A1A1A] uppercase">
                    Email Address <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="julian.vance@example.com"
                    className="w-full bg-[#FAF9F5] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C8A85] px-4 py-3 rounded-lg border border-[#E8E6DF] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold tracking-wider text-[#1A1A1A] uppercase">
                      Password <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <a
                      href="#forgot-password"
                      className="text-[11px] text-[#757470] hover:text-[#1A1A1A] transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full bg-[#FAF9F5] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C8A85] px-4 py-3 pr-12 rounded-lg border border-[#E8E6DF] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 text-[#757470] hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Sign In</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                <ContinueWithGoogle />
              </form>

              <div className="my-6 h-[1px] bg-[#E8E6DF]" />

              <div className="text-center text-xs text-[#757470]">
                New to Snitch?{' '}
                <Link
                  to="/register"
                  className="text-[#1A1A1A] font-semibold underline underline-offset-4 hover:text-[#B89758] transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-[#E8E6DF] py-5 px-6 md:px-12 text-center text-[11px] text-[#757470] tracking-wider uppercase bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SNITCH APPAREL ATELIER. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#1A1A1A] transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#support" className="hover:text-[#1A1A1A] transition-colors">Concierge</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
