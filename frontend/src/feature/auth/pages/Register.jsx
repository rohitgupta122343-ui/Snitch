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
    <div className="min-h-screen w-full bg-[#0b0c10] text-[#e4e1e7] relative flex flex-col justify-between overflow-x-hidden selection:bg-[#fabc4d]/30 selection:text-[#ffd700]">
      {/* Background Ambient Golden Light Spots */}
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
              to="/login"
              className="text-xs uppercase tracking-wider text-[#fabc4d] hover:text-[#ffd700] transition-colors py-1.5 px-3 rounded border border-[#e5a93c]/30 hover:border-[#ffd700]/60"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container - Split on Desktop / Stacked on Mobile & Tablet */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-16 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-center">

          {/* LEFT COLUMN: Editorial Showcase & Brand Story (visible desktop/tablet, concise on mobile) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 order-2 lg:order-1">

            {/* Tag / Badge */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e5a93c]/25 bg-[#e5a93c]/8 text-[11px] font-medium tracking-[0.2em] text-[#fabc4d] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d] animate-pulse" />
                <span>Snitch Privé • Member Club</span>
              </div>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif text-white leading-[1.15] font-normal">
                Redefining Fast Fashion <br />
                <span className="italic text-[#fabc4d]">& Contemporary Fit.</span>
              </h2>

              <p className="text-sm md:text-base text-[#8e909a] font-light leading-relaxed max-w-lg">
                Step into the vanguard of modern apparel. Experience weekly curated drops, precision silhouettes, and members-only preview privileges.
              </p>
            </div>

            {/* Editorial Showcase Card (Hidden on smallest mobile for sleekness, visible on sm and up) */}
            <div className="relative rounded-2xl overflow-hidden border border-[#e5a93c]/20 bg-gradient-to-b from-[#1a1c23]/80 to-[#121216]/90 p-5 sm:p-6 backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-[#2a2c35]/80 text-xs">
                <span className="tracking-[0.15em] uppercase text-[#ffd700] font-medium">Limited Edition Drop</span>
                <span className="text-[#8e909a]">AW26 Collection</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                <div className="space-y-1">
                  <p className="text-xs text-[#8e909a] uppercase tracking-wider">Priority Access</p>
                  <p className="text-sm text-white font-medium">48h Early Drops</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8e909a] uppercase tracking-wider">Fit Assurance</p>
                  <p className="text-sm text-white font-medium">100% Exchange</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8e909a] uppercase tracking-wider">Express Dispatch</p>
                  <p className="text-sm text-white font-medium">White-Glove Care</p>
                </div>
              </div>

              {/* Quote Footer */}
              <div className="mt-5 pt-4 border-t border-[#2a2c35]/60 flex items-center justify-between text-xs text-[#8e909a]">
                <span>250K+ fashion-forward patrons</span>
                <span className="text-[#fabc4d]">★★★★★ 4.9/5</span>
              </div>
            </div>

            {/* Partner Teaser */}
            <div className="hidden lg:flex items-center gap-4 text-xs text-[#8e909a]">
              <span className="w-8 h-[1px] bg-[#e5a93c]/40" />
              <span>Are you a designer or fashion atelier? Check 'Register as Seller'</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Minimalist Seamless Registration Form Card */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto order-1 lg:order-2">
            <div className="rounded-2xl sm:rounded-3xl bg-[#131317]/90 backdrop-blur-2xl border border-[#e5a93c]/20 p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.7)] relative">

              {/* Top Specular Gold Edge Light */}
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/50 to-transparent" />

              {/* Header */}
              <div className="mb-7">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-2">
                  Create Account
                </h3>
                <p className="text-xs sm:text-sm text-[#8e909a] font-light">
                  Join Snitch for curated menswear and seamless checkout.
                </p>
              </div>

              {/* Alerts */}
              {(localError || authError) && (
                <div className="mb-5 px-4 py-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 text-xs tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  {localError || authError}
                </div>
              )}

              {successMsg && (
                <div className="mb-5 px-4 py-3 rounded-lg border border-[#fabc4d]/40 bg-[#fabc4d]/10 text-[#ffd700] text-xs tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]" />
                  {successMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#d4c4b0] uppercase">
                    Full Name <span className="text-[#fabc4d]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Julian Vance"
                    className="w-full bg-[#121216] text-sm text-[#e4e1e7] placeholder-[#5c5e69] px-4 py-3 rounded-lg border border-[#2a2c35] focus:outline-none focus:border-[#fabc4d] focus:ring-1 focus:ring-[#fabc4d]/40 transition-all duration-300"
                  />
                </div>

                {/* Email Address */}
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

                {/* Contact Number with Country Code Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#d4c4b0] uppercase">
                    Contact Number <span className="text-[#fabc4d]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="contactCountry"
                      value={formData.contactCountry}
                      onChange={handleChange}
                      className="bg-[#121216] text-xs sm:text-sm text-[#e4e1e7] px-2.5 sm:px-3 py-3 rounded-lg border border-[#2a2c35] focus:outline-none focus:border-[#fabc4d] transition-all duration-300 cursor-pointer"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code} className="bg-[#131317] text-[#e4e1e7]">
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
                      className="flex-1 bg-[#121216] text-sm text-[#e4e1e7] placeholder-[#5c5e69] px-4 py-3 rounded-lg border border-[#2a2c35] focus:outline-none focus:border-[#fabc4d] focus:ring-1 focus:ring-[#fabc4d]/40 transition-all duration-300 tracking-wide"
                    />
                  </div>
                </div>

                {/* Password with Eye Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#d4c4b0] uppercase">
                    Password <span className="text-[#fabc4d]">*</span>
                  </label>
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
                      
                     

                {/* Is Seller Checkbox Card */}
                <div className="pt-1 ">
                  <label className="group flex items-start gap-3 p-3 sm:p-3.5 rounded-xl border border-[#2a2c35] hover:border-[#e5a93c]/40 bg-[#121216]/70 cursor-pointer transition-all duration-300">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        name="isSeller"
                        checked={formData.isSeller}
                        onChange={handleChange}
                        className="peer appearance-none w-5 h-5 rounded border border-[#504535] checked:bg-gradient-to-br checked:from-[#ffd700] checked:to-[#e5a93c] checked:border-transparent transition-all duration-200 cursor-pointer focus:outline-none"
                      />
                      <svg
                        className="absolute w-3 h-3 text-[#0b0c10] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 select-none">
                      <span className="block text-xs font-semibold text-[#e4e1e7] group-hover:text-[#fabc4d] transition-colors duration-200">
                        Register as Seller / Brand Partner
                      </span>
                      <p className="text-[11px] text-[#8e909a] font-light mt-0.5 leading-snug">
                        Sell apparel, manage designer drops, and access the Snitch seller console.
                      </p>
                    </div>
                  </label>
                </div>
                       
                {/* Submit Action */}
                <div className="pt-2 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden rounded-lg p-[1px] font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] rounded-lg transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(250,188,77,0.4)]" />
                    <div className="relative px-6 py-3.5 bg-gradient-to-r from-[#ffd700] to-[#e5a93c] text-[#0b0c10] font-semibold rounded-lg flex items-center justify-center gap-2 group-hover:bg-opacity-95 transition-all">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-[#0b0c10]" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Joining Snitch Privé...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          Create Account
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                </div>
                <ContinueWithGoogle/>
              </form>

              {/* Divider */}
              <div className="my-6 h-[1px] bg-gradient-to-r from-transparent via-[#e5a93c]/20 to-transparent" />

              {/* Sign In Link */}
              <div className="text-center text-xs text-[#8e909a]">
                Already part of the Snitch community?{' '}
                <Link
                  to="/login"
                  className="text-[#fabc4d] hover:text-[#ffd700] font-medium transition-colors underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
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

export default Register;
