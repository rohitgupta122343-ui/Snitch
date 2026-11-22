import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth.js';
import { Link } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle.jsx';

const countryCodes = [
  { code: '+91', country: 'IN', label: '+91 (IN)' },
  { code: '+1', country: 'US', label: '+1 (US)' },
  { code: '+44', country: 'UK', label: '+44 (UK)' },
  { code: '+971', country: 'AE', label: '+971 (UAE)' },
  { code: '+61', country: 'AU', label: '+61 (AU)' },
];

const Register = () => {
  const { handleRegister, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactCountry: '+91',
    contactNumber: '',
    password: '',
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.contactNumber.trim() || !formData.password.trim()) {
      setLocalError('Please complete all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    const fullContact = `${formData.contactCountry} ${formData.contactNumber.trim()}`;
    const result = await handleRegister({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      isSeller: formData.isSeller,
      contact: fullContact
    });

    if (result?.success) {
      setSuccessMsg('Welcome to Snitch Privé! Your account has been created.');
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
              to="/login"
              className="text-xs uppercase tracking-wider text-[#1A1A1A] hover:bg-[#F5F4EE] transition-colors py-1.5 px-3.5 rounded-md border border-[#E8E6DF] font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-16 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-center">

          {/* LEFT COLUMN: Editorial Showcase & Brand Story */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A880]/30 bg-white text-[11px] font-medium tracking-[0.2em] text-[#B89758] uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
                <span>Snitch Privé • Member Club</span>
              </div>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif text-[#1A1A1A] leading-[1.15] font-normal">
                Redefining Contemporary <br />
                <span className="italic text-[#B89758]">Fit &amp; Atelier Tailoring.</span>
              </h2>

              <p className="text-sm md:text-base text-[#5C5A55] font-light leading-relaxed max-w-lg">
                Step into the vanguard of refined apparel. Experience seasonal curated drops, bespoke silhouettes, and members-only preview privileges.
              </p>
            </div>

            {/* Editorial Showcase Card */}
            <div className="rounded-2xl border border-[#E8E6DF] bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB] text-xs">
                <span className="tracking-[0.15em] uppercase text-[#1A1A1A] font-semibold">Limited Atelier Drops</span>
                <span className="text-[#B89758] font-medium">SS26 Collection</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1">
                  <p className="text-[10px] text-[#757470] uppercase tracking-wider">Priority Access</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">48h Early Drops</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#757470] uppercase tracking-wider">Fit Assurance</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">Complimentary Alterations</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#757470] uppercase tracking-wider">Express Dispatch</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">Archival Packaging</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EFEB] flex items-center justify-between text-[11px] text-[#757470]">
                <span>250K+ discerning patrons worldwide</span>
                <span className="text-[#B89758] font-semibold">★ 4.9/5</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-xs text-[#757470]">
              <span className="w-6 h-[1px] bg-[#B89758]" />
              <span>Are you an independent designer or atelier? Register as a Seller partner below.</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Minimalist Seamless Registration Form Card */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto order-1 lg:order-2">
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#E8E6DF] p-6 sm:p-10 shadow-[0_12px_44px_rgba(26,26,26,0.06)] relative">
              <div className="mb-7">
                <h3 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] mb-2 font-serif">
                  Create Account
                </h3>
                <p className="text-xs sm:text-sm text-[#757470] font-light">
                  Join Snitch for curated tailoring and seamless checkout.
                </p>
              </div>

              {/* Alerts */}
              {(localError || authError) && (
                <div className="mb-5 px-4 py-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                  {localError || authError}
                </div>
              )}

              {successMsg && (
                <div className="mb-5 px-4 py-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#1A1A1A] uppercase">
                    Full Name <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Julian Vance"
                    className="w-full bg-[#FAF9F5] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C8A85] px-4 py-3 rounded-lg border border-[#E8E6DF] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all duration-200"
                    required
                  />
                </div>

                {/* Email Address */}
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

                {/* Contact Number with Country Code Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#1A1A1A] uppercase">
                    Contact Number <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="contactCountry"
                      value={formData.contactCountry}
                      onChange={handleChange}
                      className="bg-[#FAF9F5] text-xs sm:text-sm text-[#1A1A1A] px-3 py-3 rounded-lg border border-[#E8E6DF] focus:outline-none focus:border-[#1A1A1A] cursor-pointer"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="flex-1 bg-[#FAF9F5] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C8A85] px-4 py-3 rounded-lg border border-[#E8E6DF] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#1A1A1A] uppercase">
                    Password <span className="text-[#ba1a1a]">*</span>
                  </label>
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

                {/* Seller Checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isSeller"
                      checked={formData.isSeller}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-[#E8E6DF] accent-[#1A1A1A] cursor-pointer"
                    />
                    <span className="text-xs text-[#5C5A55]">
                      Register as a <strong className="text-[#1A1A1A]">Seller Partner</strong> (List garments &amp; manage inventory)
                    </span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                <ContinueWithGoogle />
              </form>

              <div className="my-6 h-[1px] bg-[#E8E6DF]" />

              <div className="text-center text-xs text-[#757470]">
                Already a member?{' '}
                <Link
                  to="/login"
                  className="text-[#1A1A1A] font-semibold underline underline-offset-4 hover:text-[#B89758] transition-colors"
                >
                  Sign in to your account
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

export default Register;
