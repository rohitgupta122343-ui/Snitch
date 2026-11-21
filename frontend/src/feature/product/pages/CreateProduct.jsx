import React, { useState, useRef } from 'react';
import { useProduct } from '../hook/useProduct';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';

const MAX_IMAGES = 7;

const CURRENCIES = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'AED', label: 'AED (د.إ)' },
];

/* ─────────────────────────────────────────
   Color Types & Presets
───────────────────────────────────────── */
export const COLOR_TYPES = [
  // Classic & Neutrals
  { name: 'Noir Black', hex: '#0e0e12', category: 'Neutrals', border: 'border-white/20' },
  { name: 'Pure White', hex: '#ffffff', category: 'Neutrals', border: 'border-black/30' },
  { name: 'Ivory Cream', hex: '#fdfbf7', category: 'Neutrals', border: 'border-black/25' },
  { name: 'Slate Charcoal', hex: '#334155', category: 'Neutrals', border: 'border-white/20' },
  { name: 'Heather Grey', hex: '#64748b', category: 'Neutrals', border: 'border-white/20' },
  { name: 'Pearl Silver', hex: '#cbd5e1', category: 'Neutrals', border: 'border-white/30' },

  // Earthy & Warm
  { name: 'Camel Tan', hex: '#c19a6b', category: 'Earthy', border: 'border-white/20' },
  { name: 'Warm Mocha', hex: '#4a2c11', category: 'Earthy', border: 'border-white/20' },
  { name: 'Sandstone Beige', hex: '#d4b996', category: 'Earthy', border: 'border-black/20' },
  { name: 'Terracotta', hex: '#c85a32', category: 'Earthy', border: 'border-white/20' },
  { name: 'Olive Green', hex: '#556b2f', category: 'Earthy', border: 'border-white/20' },
  { name: 'Sage Moss', hex: '#8a9a86', category: 'Earthy', border: 'border-white/20' },

  // Royals & Jewel Tones
  { name: 'Royal Gold', hex: '#e5a93c', category: 'Jewel', border: 'border-white/20' },
  { name: 'Midnight Navy', hex: '#0f172a', category: 'Jewel', border: 'border-white/20' },
  { name: 'Cobalt Blue', hex: '#1d4ed8', category: 'Jewel', border: 'border-white/20' },
  { name: 'Crimson Velvet', hex: '#881337', category: 'Jewel', border: 'border-white/20' },
  { name: 'Deep Burgundy', hex: '#581845', category: 'Jewel', border: 'border-white/20' },
  { name: 'Emerald Silk', hex: '#064e3b', category: 'Jewel', border: 'border-white/20' },
  { name: 'Royal Amethyst', hex: '#581c87', category: 'Jewel', border: 'border-white/20' },

  // Pastel & Accents
  { name: 'Dusty Rose', hex: '#d4a5a5', category: 'Pastel', border: 'border-white/20' },
  { name: 'Champagne', hex: '#f7e7ce', category: 'Pastel', border: 'border-black/20' },
  { name: 'Lavender Mist', hex: '#c4b5fd', category: 'Pastel', border: 'border-white/20' },
  { name: 'Mint Frost', hex: '#a7f3d0', category: 'Pastel', border: 'border-black/20' },
  { name: 'Sky Whisper', hex: '#bae6fd', category: 'Pastel', border: 'border-black/20' },
  { name: 'Sunset Amber', hex: '#ea580c', category: 'Pastel', border: 'border-white/20' },
];

const COLOR_CATEGORIES = ['All', 'Neutrals', 'Earthy', 'Jewel', 'Pastel'];

/* ─────────────────────────────────────────
   Image Slot — filled or empty
───────────────────────────────────────── */
const ImageSlot = ({ index, file, onRemove, onAdd }) => {
  const isFirst = index === 0;

  if (file) {
    return (
      <div className="relative group aspect-square rounded-xl border border-[#e5a93c]/40 bg-[#121216] overflow-hidden">
        <img
          src={URL.createObjectURL(file)}
          alt={`slot-${index + 1}`}
          className="w-full h-full object-cover"
        />
        {isFirst && (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#e5a93c]/90 text-[8px] font-mono tracking-tight text-[#0b0c10]">
            Cover
          </span>
        )}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0b0c10]/80 text-[#e4e1e7] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onAdd}
      className={`relative group aspect-square rounded-xl border border-dashed bg-[#121216] flex flex-col items-center justify-center cursor-pointer transition-all duration-200
        ${isFirst
          ? 'border-[#e5a93c]/45 text-[#fabc4d]/70 hover:border-[#ffd700]/70 hover:text-[#ffd700] hover:bg-[#1a1810]'
          : 'border-[#2a2c35] text-[#d4c4b0]/30 hover:border-[#e5a93c]/35 hover:text-[#fabc4d]/60 hover:bg-[#161618]'
        }`}
    >
      {isFirst && (
        <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-[#e5a93c]/15 text-[8px] font-mono text-[#fabc4d]/65 border border-[#e5a93c]/25">
          Cover
        </span>
      )}
      <svg className="w-4 h-4 mb-0.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-[9px] font-medium">{index + 1}</span>
    </div>
  );
};

/* ─────────────────────────────────────────
   Shared input class
───────────────────────────────────────── */
const inputCls =
  'w-full bg-[#121216] border border-[#2a2c35] text-[#e4e1e7] placeholder-[#e4e1e7]/25 text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#fabc4d] focus:ring-2 focus:ring-[#fabc4d]/15 hover:border-[#3a3c47] transition-all duration-200';

/* ─────────────────────────────────────────
   Section heading row helper
───────────────────────────────────────── */
const SectionHeading = ({ children }) => (
  <h2 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#d4c4b0]/55 mb-5 flex items-center gap-2">
    <span className="w-4 h-[1px] bg-[#e5a93c]/45" />
    {children}
  </h2>
);

/* ─────────────────────────────────────────
   Field label helper
───────────────────────────────────────── */
const FieldLabel = ({ htmlFor, children, hint }) => (
  <div className="flex items-center justify-between mb-2">
    <label htmlFor={htmlFor} className="block text-[11px] font-semibold tracking-wider uppercase text-[#d4c4b0]">
      {children}
    </label>
    {hint && <span className="text-[10px] text-[#d4c4b0]/40">{hint}</span>}
  </div>
);

/* ═══════════════════════════════════════════════════════
   CreateProduct
   ═══════════════════════════════════════════════════════ */
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    color: '',
  });

  const [activeColorCategory, setActiveColorCategory] = useState('All');
  const [customHex, setCustomHex] = useState('#e5a93c');
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectColor = (colorObj) => {
    if (formData.color.toLowerCase() === colorObj.name.toLowerCase()) {
      setFormData((prev) => ({ ...prev, color: '' }));
    } else {
      setFormData((prev) => ({ ...prev, color: colorObj.name }));
      if (colorObj.hex) setCustomHex(colorObj.hex);
    }
  };

  const addImages = (files) => {
    const incoming = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setImages((prev) => [...prev, ...incoming].slice(0, MAX_IMAGES));
  };

  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); addImages(e.dataTransfer.files); };
  const handleFileChange = (e) => addImages(e.target.files);

  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault();

    // Create a real browser FormData instance
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("priceAmount", formData.priceAmount);
    payload.append("priceCurrency", formData.priceCurrency);
    if (formData.color) {
      payload.append("color", formData.color);
    }
    payload.append("isDraft", asDraft);

    // Append each File object under the exact key 'images' expected by Multer
    images.forEach((file) => {
      payload.append("images", file);
    });

    await handleCreateProduct(payload);
    navigate('/seller/dashboard')
  };


  /* Shared publish/draft buttons */
  const PublishBtn = ({ full }) => (
    <button
      type="submit"
      className={`${full ? 'w-full' : 'flex-1 sm:flex-none sm:px-10'} px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] hover:brightness-110 text-[#0b0c10] font-semibold text-xs tracking-wider uppercase shadow-[0_4px_18px_rgba(229,169,60,0.3)] hover:shadow-[0_6px_26px_rgba(229,169,60,0.45)] transition-all duration-200 flex items-center justify-center gap-2 group`}
    >
      Publish Product
      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );

  const DraftBtn = ({ full }) => (
    <button
      type="button"
      onClick={(e) => handleSubmit(e, true)}
      className={`${full ? 'w-full' : 'w-full sm:w-auto'} px-6 py-3.5 rounded-xl border border-[#e5a93c]/38 text-[#fabc4d] hover:text-[#ffd700] hover:border-[#ffd700]/65 bg-transparent hover:bg-[#e5a93c]/5 font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2`}
    >
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
      Save as Draft
    </button>
  );

  return (
    <div
      className="min-h-screen w-full bg-[#0b0c10] text-[#e4e1e7] flex flex-col selection:bg-[#fabc4d]/20 selection:text-[#ffd700] antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Ambient Glow ── */}
      <div className="fixed top-0 left-0 w-[540px] h-[540px] bg-[radial-gradient(circle_at_20%_20%,rgba(229,169,60,0.08),transparent_70%)] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_80%_80%,rgba(250,188,77,0.06),transparent_70%)] pointer-events-none -z-10" />

      {/* ════════════════════════════════════
          HEADER — sticky top bar
          ════════════════════════════════════ */}
      <header className="w-full border-b border-[#e5a93c]/15 bg-[#0b0c10]/85 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">

          {/* Back link */}
          <Link
            to="/seller/dashboard"
            className="group inline-flex items-center gap-2 text-xs tracking-wider uppercase font-medium text-[#d4c4b0]/65 hover:text-[#ffd700] transition-colors duration-200 flex-shrink-0"
          >
            <span className="w-8 h-8 rounded-full border border-[#e5a93c]/20 bg-[#131317] flex items-center justify-center group-hover:border-[#fabc4d]/55 group-hover:bg-[#fabc4d]/8 transition-all duration-200">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {/* Logo */}
          <div
            className="flex items-center gap-2 tracking-[0.22em] text-lg sm:text-xl font-bold text-[#e5a93c]"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
          >
            SNITCH
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_6px_rgba(255,215,0,0.9)]" />
            <span
              className="hidden md:inline text-[9px] tracking-[0.22em] font-semibold text-[#d4c4b0]/40 uppercase ml-1 px-2 py-0.5 border border-[#e5a93c]/20 rounded bg-[#131317]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Seller
            </span>
          </div>

          {/* Draft badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#e5a93c]/25 bg-[#131317]/90 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#fabc4d] flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d] animate-pulse" />
            Draft
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          PAGE BODY
          ════════════════════════════════════ */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-7 sm:py-10">

        {/* Page heading */}
        <div className="mb-7">
          <span className="inline-block mb-2 text-[10px] font-semibold tracking-[0.25em] uppercase text-[#fabc4d]/75 bg-[#fabc4d]/10 px-2.5 py-1 rounded-full border border-[#fabc4d]/20">
            Catalogue Entry
          </span>
          <h1
            className="text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl text-white font-semibold tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            List a New Product
          </h1>
          <p className="mt-1.5 text-sm text-[#d4c4b0]/60 font-light leading-relaxed">
            Fill in the details below to publish your item to the Snitch catalogue.
          </p>
        </div>

        {/* ── FORM ── */}
        <form onSubmit={(e) => handleSubmit(e, false)}>

          {/*
            Responsive layout:
            • mobile / tablet (<lg): single column, stacked
            • desktop (≥lg):         left flex-1 | right fixed 390px, right col sticky
          */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-7">

            {/* ══════════════════════════════════════
                LEFT — form fields
                ══════════════════════════════════════ */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* ── Card: Basic Info ── */}
              <div className="relative bg-[#131317] border border-[#e5a93c]/20 rounded-2xl p-5 sm:p-7 shadow-[0_8px_36px_-10px_rgba(0,0,0,0.65)]">
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/25 to-transparent" />

                <SectionHeading>Basic Information</SectionHeading>

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <FieldLabel htmlFor="title" hint={`${formData.title.length} / 80`}>
                      Product Title <span className="text-[#fabc4d]">*</span>
                    </FieldLabel>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      maxLength={80}
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Classic Oversized Tee"
                      className={inputCls}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <FieldLabel htmlFor="description" hint="Markdown supported">
                      Description <span className="text-[#fabc4d]">*</span>
                    </FieldLabel>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your product — material, fit, occasion..."
                      className={`${inputCls} resize-y leading-relaxed min-h-[120px]`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ── Card: Pricing ── */}
              <div className="relative bg-[#131317] border border-[#e5a93c]/20 rounded-2xl p-5 sm:p-7 shadow-[0_8px_36px_-10px_rgba(0,0,0,0.65)]">
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/25 to-transparent" />

                <SectionHeading>Pricing</SectionHeading>

                {/* On xs: stacked (each col-span-2). On sm+: side-by-side 2:1 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Amount — takes full width on xs, left 2/3 on sm */}
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <FieldLabel htmlFor="priceAmount">
                      Price Amount <span className="text-[#fabc4d]">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <input
                        id="priceAmount"
                        name="priceAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.priceAmount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`${inputCls} pr-[5.5rem]`}
                        required
                      />
                      <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[10px] text-[#d4c4b0]/40 font-mono tracking-widest">
                        TAX INCL.
                      </span>
                    </div>
                  </div>

                  {/* Currency — full width on xs, right 1/3 on sm */}
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <FieldLabel htmlFor="priceCurrency">
                      Currency <span className="text-[#fabc4d]">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <select
                        id="priceCurrency"
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        className={`${inputCls} pr-10 appearance-none cursor-pointer`}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.value} value={c.value} className="bg-[#121216]">
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#fabc4d]/65">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Card: Color & Palette (Below Pricing) ── */}
              <div className="relative bg-[#131317] border border-[#e5a93c]/20 rounded-2xl p-5 sm:p-7 shadow-[0_8px_36px_-10px_rgba(0,0,0,0.65)]">
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/25 to-transparent" />

                <div className="flex items-center justify-between mb-5">
                  <SectionHeading>Color &amp; Palette</SectionHeading>
                  {formData.color ? (
                    <div className="flex items-center gap-2 -mt-5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a1810] border border-[#ffd700]/30 text-xs text-[#ffd700]">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/30"
                          style={{
                            backgroundColor:
                              COLOR_TYPES.find((c) => c.name.toLowerCase() === formData.color.toLowerCase())?.hex ||
                              customHex,
                          }}
                        />
                        <span className="font-semibold text-[11px]">{formData.color}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, color: '' }))}
                        className="text-[10px] text-[#d4c4b0]/40 hover:text-[#ff6b6b] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#d4c4b0]/35 uppercase tracking-wider -mt-5">
                      Optional
                    </span>
                  )}
                </div>

                {/* Category filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
                  {COLOR_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveColorCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium tracking-wider transition-all duration-200 border flex-shrink-0 cursor-pointer ${
                        activeColorCategory === cat
                          ? 'bg-[#e5a93c]/20 border-[#ffd700] text-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.2)]'
                          : 'bg-[#121216] border-[#2a2c35] text-[#d4c4b0]/60 hover:border-[#e5a93c]/40 hover:text-[#e4e1e7]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Color swatches grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mb-5 max-h-[220px] overflow-y-auto pr-1">
                  {COLOR_TYPES.filter(
                    (c) => activeColorCategory === 'All' || c.category === activeColorCategory
                  ).map((color) => {
                    const isSelected = formData.color.toLowerCase() === color.name.toLowerCase();
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={`group relative flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1a1810] border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.25)] ring-1 ring-[#ffd700]/30'
                            : 'bg-[#121216] border-[#2a2c35] hover:border-[#e5a93c]/45 hover:bg-[#16161a]'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex-shrink-0 border ${color.border} shadow-sm transition-transform group-hover:scale-110`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`text-xs truncate ${isSelected ? 'text-[#ffd700] font-semibold' : 'text-[#e4e1e7]/80'}`}>
                          {color.name}
                        </span>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-[#ffd700] ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input row */}
                <div className="pt-4 border-t border-[#2a2c35]/80">
                  <FieldLabel htmlFor="customColor" hint="Or type any custom shade">
                    Custom Color Name / Shade
                  </FieldLabel>
                  <div className="flex items-center gap-3">
                    {/* Native Color Picker swatch */}
                    <div className="relative flex-shrink-0">
                      <input
                        type="color"
                        value={customHex}
                        onChange={(e) => {
                          setCustomHex(e.target.value);
                          if (!formData.color) {
                            setFormData((prev) => ({ ...prev, color: e.target.value }));
                          }
                        }}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border border-[#e5a93c]/40 p-0.5 overflow-hidden"
                        title="Pick custom hex color"
                      />
                    </div>

                    {/* Text input for custom color name */}
                    <input
                      id="customColor"
                      name="color"
                      type="text"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g. Sage Green, Metallic Rose, Champagne"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* ── Action bar — MOBILE ONLY (<lg) ── */}
              <div className="lg:hidden flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                <DraftBtn full={false} />
                <PublishBtn full={false} />
              </div>

            </div>
            {/* END left col */}

            {/* ══════════════════════════════════════
                RIGHT — images panel + desktop actions
                Sticky on desktop
                ══════════════════════════════════════ */}
            <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 flex flex-col gap-5 lg:sticky lg:top-20">

              {/* ── Card: Images ── */}
              <div className="relative bg-[#131317] border border-[#e5a93c]/20 rounded-2xl p-5 sm:p-7 shadow-[0_8px_36px_-10px_rgba(0,0,0,0.65)]">
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/25 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <SectionHeading>Product Images</SectionHeading>
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-[#fabc4d] font-mono bg-[#fabc4d]/10 px-2 py-0.5 rounded-full border border-[#fabc4d]/20 -mt-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]" />
                    {images.length} / 7
                  </div>
                </div>

                {/* Drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`group cursor-pointer border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all duration-250 mb-5
                    ${isDragging
                      ? 'border-[#ffd700] bg-[#1a1810]'
                      : 'border-[#e5a93c]/28 bg-[#121216]/55 hover:border-[#ffd700]/65 hover:bg-[#121216]'
                    }`}
                >
                  <div className="w-11 h-11 rounded-full border border-[#e5a93c]/30 bg-[#131317] flex items-center justify-center mb-2.5 text-[#ffd700] group-hover:scale-105 group-hover:border-[#fabc4d]/65 transition-all duration-250 shadow-[0_0_12px_rgba(229,169,60,0.1)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#e4e1e7] mb-0.5 leading-snug">
                    Drag &amp; drop or{' '}
                    <span className="text-[#ffd700] underline underline-offset-4 decoration-[#ffd700]/35">
                      browse
                    </span>
                  </p>
                  <p className="text-[11px] text-[#d4c4b0]/40 leading-relaxed">
                    PNG · JPG · WebP · max 10 MB<br />
                    <span className="text-[10px]">Portrait (3:4 / 4:5) preferred</span>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Image grid — 4 cols top row, 3 + spacer bottom row */}
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#d4c4b0]/45 mb-3">
                    Image Slots
                  </div>
                  {/* Row 1: 0–3 */}
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[0, 1, 2, 3].map((i) => (
                      <ImageSlot
                        key={i}
                        index={i}
                        file={images[i]}
                        onRemove={removeImage}
                        onAdd={() => fileInputRef.current?.click()}
                      />
                    ))}
                  </div>
                  {/* Row 2: 4–6 + filler */}
                  <div className="grid grid-cols-4 gap-2">
                    {[4, 5, 6].map((i) => (
                      <ImageSlot
                        key={i}
                        index={i}
                        file={images[i]}
                        onRemove={removeImage}
                        onAdd={() => fileInputRef.current?.click()}
                      />
                    ))}
                    <div /> {/* filler cell */}
                  </div>
                </div>
              </div>

              {/* ── Card: Actions — DESKTOP ONLY (≥lg) ── */}
              <div className="hidden lg:block relative bg-[#131317] border border-[#e5a93c]/20 rounded-2xl p-5 sm:p-6 shadow-[0_8px_36px_-10px_rgba(0,0,0,0.65)]">
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/25 to-transparent" />
                <div className="flex flex-col gap-3">
                  <PublishBtn full />
                  <DraftBtn full />
                </div>
                <p className="mt-4 text-center text-[10px] text-[#d4c4b0]/30 tracking-wide leading-relaxed">
                  Drafts are only visible to you.<br />Published items go live immediately.
                </p>
              </div>

            </div>
            {/* END right col */}

          </div>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-[10px] tracking-widest text-[#d4c4b0]/25 uppercase">
          Snitch Privé Atelier &bull; Seller Partner Suite &bull; Curated Haute Tailoring
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
