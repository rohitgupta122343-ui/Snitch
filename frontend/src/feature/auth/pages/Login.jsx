import React, { useState } from 'react';
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';
import { useSelector } from 'react-redux';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector(state => state.auth.user)

  const {handleLogin} = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const user = await handleLogin({
        email:formData.email,
        password:formData.password
    })

    if(user.role == 'buyyer'){
      navigate('/')
    }else if(user.role == 'seller'){
      navigate('/seller/dashboard')
    }
    
      
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0c10] text-[#e4e1e7] relative flex flex-col justify-between overflow-x-hidden selection:bg-[#fabc4d]/30 selection:text-[#ffd700]">
      {/* Background Ambient Golden Glows */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[500px] h-[500px] bg-[#e5a93c]/8 rounded-full blur-[160px]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 w-[500px] h-[500px] bg-[#ffd700]/8 rounded-full blur-[160px]" />
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#e5a93c]/3 rounded-full blur-[200px]" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full border-b border-[#2a2c35]/70 bg-[#0b0c10]/80 backdrop-blur-md px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl md:text-2xl font-black tracking-[0.35em] uppercase text-white font-sans">
              SNITCH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#8e909a]">
              Autumn / Winter 26
            </span>
            <Link
              to="/register"
              className="text-xs uppercase tracking-wider text-[#fabc4d] hover:text-[#ffd700] transition-colors py-1.5 px-3 rounded border border-[#e5a93c]/30 hover:border-[#ffd700]/60"
            >
              Join Privé
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container - Responsive Editorial Split on Desktop / Stacked on Mobile */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-16 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-center">

          {/* LEFT COLUMN: Editorial Brand Showcase (Desktop/Tablet) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e5a93c]/25 bg-[#e5a93c]/8 text-[11px] font-medium tracking-[0.2em] text-[#fabc4d] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d] animate-pulse" />
                <span>Member Portal • Autumn 26</span>
              </div>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif text-white leading-[1.15] font-normal">
                Curated Fashion. <br />
                <span className="italic text-[#fabc4d]">Uncompromising Style.</span>
              </h2>

              <p className="text-sm md:text-base text-[#8e909a] font-light leading-relaxed max-w-lg">
                Sign in to manage your private orders, track tailored releases, and access exclusive member privileges.
              </p>
            </div>

            {/* Privileges Highlight Card */}
            <div className="relative rounded-2xl overflow-hidden border border-[#e5a93c]/20 bg-gradient-to-b from-[#1a1c23]/80 to-[#121216]/90 p-5 sm:p-6 backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-[#2a2c35]/80 text-xs">
                <span className="tracking-[0.15em] uppercase text-[#ffd700] font-medium">Member Benefits</span>
                <span className="text-[#8e909a]">Privé Access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                <div className="space-y-1">
                  <p className="text-xs text-[#8e909a] uppercase tracking-wider">Fast Checkout</p>
                  <p className="text-sm text-white font-medium">One-Tap Vault</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8e909a] uppercase tracking-wider">Saved Fits</p>
                  <p className="text-sm text-white font-medium">Tailored Profiles</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8e909a] uppercase tracking-wider">Seller Console</p>
                  <p className="text-sm text-white font-medium">Partner Portal</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#2a2c35]/60 flex items-center justify-between text-xs text-[#8e909a]">
                <span>Discreet & Secure Sign-In</span>
                <span className="text-[#fabc4d]">256-bit SSL</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Minimalist Login Form Card */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto order-1 lg:order-2">
            <div className="rounded-2xl sm:rounded-3xl bg-[#131317]/90 backdrop-blur-2xl border border-[#e5a93c]/20 p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.7)] relative">

              {/* Top Specular Gold Edge Light */}
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/50 to-transparent" />

              {/* Form Title & Header */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-2 sm:hidden">
                  <span className="text-lg font-black tracking-[0.3em] uppercase text-white">
                    SNITCH
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-2">
                  Welcome Back
                </h3>
                <p className="text-xs sm:text-sm text-[#8e909a] font-light">
                  Enter your credentials to access your Snitch account.
                </p>
              </div>

              {/* Form: Email & Password Only */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email Address Field */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#d4c4b0] uppercase">
                    Email Address <span className="text-[#fabc4d]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="julian.vance@example.com"
                    className="w-full bg-[#121216] text-sm text-[#e4e1e7] placeholder-[#5c5e69] px-4 py-3 rounded-lg border border-[#2a2c35] focus:outline-none focus:border-[#fabc4d] focus:ring-1 focus:ring-[#fabc4d]/40 transition-all duration-300"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold tracking-wider text-[#d4c4b0] uppercase">
                      Password <span className="text-[#fabc4d]">*</span>
                    </label>
                    <a
                      href="#forgot-password"
                      className="text-[11px] text-[#8e909a] hover:text-[#fabc4d] transition-colors"
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
                      className="w-full bg-[#121216] text-sm text-[#e4e1e7] placeholder-[#5c5e69] px-4 py-3 pr-12 rounded-lg border border-[#2a2c35] focus:outline-none focus:border-[#fabc4d] focus:ring-1 focus:ring-[#fabc4d]/40 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 text-[#8e909a] hover:text-[#fabc4d] transition-colors duration-200 focus:outline-none"
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
                      
                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full relative group overflow-hidden rounded-lg p-[1px] font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300"
                  >
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] rounded-lg transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(250,188,77,0.4)]" />
                    <div className="relative px-6 py-3.5 bg-gradient-to-r from-[#ffd700] to-[#e5a93c] text-[#0b0c10] font-semibold rounded-lg flex items-center justify-center gap-2 group-hover:bg-opacity-95 transition-all">
                      <span className="flex items-center gap-1.5">
                        Sign In
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </button>
                </div>
                <ContinueWithGoogle/>
              </form>

              {/* Golden Thread Divider */}
              <div className="my-6 h-[1px] bg-gradient-to-r from-transparent via-[#e5a93c]/20 to-transparent" />

              {/* Navigation to Register */}
              <div className="text-center text-xs text-[#8e909a]">
                New to Snitch?{' '}
                <Link
                  to="/register"
                  className="text-[#fabc4d] hover:text-[#ffd700] font-medium transition-colors underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 border-t border-[#2a2c35]/50 py-5 px-6 md:px-12 text-center text-[11px] text-[#5c5e69] tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SNITCH APPAREL LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4 text-[#8e909a]">
            <a href="#privacy" className="hover:text-[#fabc4d] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#fabc4d] transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#support" className="hover:text-[#fabc4d] transition-colors">Concierge</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
