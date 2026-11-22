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
  { name: 'Noir Black', hex: '#0e0e12', category: 'Neutrals', border: 'border-black/30' },
  { name: 'Pure White', hex: '#ffffff', category: 'Neutrals', border: 'border-black/20' },
  { name: 'Ivory Cream', hex: '#fdfbf7', category: 'Neutrals', border: 'border-black/20' },
  { name: 'Slate Charcoal', hex: '#334155', category: 'Neutrals', border: 'border-black/20' },
  { name: 'Heather Grey', hex: '#64748b', category: 'Neutrals', border: 'border-black/20' },
  { name: 'Pearl Silver', hex: '#cbd5e1', category: 'Neutrals', border: 'border-black/20' },

  // Earthy & Warm
  { name: 'Camel Tan', hex: '#c19a6b', category: 'Earthy', border: 'border-black/20' },
  { name: 'Warm Mocha', hex: '#4a2c11', category: 'Earthy', border: 'border-black/20' },
  { name: 'Sandstone Beige', hex: '#d4b996', category: 'Earthy', border: 'border-black/20' },
  { name: 'Terracotta', hex: '#c85a32', category: 'Earthy', border: 'border-black/20' },
  { name: 'Olive Green', hex: '#556b2f', category: 'Earthy', border: 'border-black/20' },
  { name: 'Sage Moss', hex: '#8a9a86', category: 'Earthy', border: 'border-black/20' },

  // Royals & Jewel Tones
  { name: 'Royal Gold', hex: '#e5a93c', category: 'Jewel', border: 'border-black/20' },
  { name: 'Midnight Navy', hex: '#0f172a', category: 'Jewel', border: 'border-black/20' },
  { name: 'Cobalt Blue', hex: '#1d4ed8', category: 'Jewel', border: 'border-black/20' },
  { name: 'Crimson Velvet', hex: '#881337', category: 'Jewel', border: 'border-black/20' },
  { name: 'Deep Burgundy', hex: '#581845', category: 'Jewel', border: 'border-black/20' },
  { name: 'Emerald Silk', hex: '#064e3b', category: 'Jewel', border: 'border-black/20' },
  { name: 'Royal Amethyst', hex: '#581c87', category: 'Jewel', border: 'border-black/20' },

  // Pastel & Accents
  { name: 'Dusty Rose', hex: '#d4a5a5', category: 'Pastel', border: 'border-black/20' },
  { name: 'Champagne', hex: '#f7e7ce', category: 'Pastel', border: 'border-black/20' },
  { name: 'Lavender Mist', hex: '#c4b5fd', category: 'Pastel', border: 'border-black/20' },
  { name: 'Mint Frost', hex: '#a7f3d0', category: 'Pastel', border: 'border-black/20' },
  { name: 'Sky Whisper', hex: '#bae6fd', category: 'Pastel', border: 'border-black/20' },
  { name: 'Sunset Amber', hex: '#ea580c', category: 'Pastel', border: 'border-black/20' },
];

const COLOR_CATEGORIES = ['All', 'Neutrals', 'Earthy', 'Jewel', 'Pastel'];

/* ─────────────────────────────────────────
   Image Slot
───────────────────────────────────────── */
const ImageSlot = ({ index, file, onRemove, onAdd }) => {
  const isFirst = index === 0;

  if (file) {
    return (
      <div className="relative group aspect-square rounded-xl border border-[#E8E6DF] bg-[#F5F4EE] overflow-hidden shadow-xs">
        <img
          src={URL.createObjectURL(file)}
          alt={`slot-${index + 1}`}
          className="w-full h-full object-cover"
        />
        {isFirst && (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-semibold text-[#1A1A1A] uppercase border border-[#E8E6DF]">
            Cover
          </span>
        )}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity hover:bg-rose-600 cursor-pointer"
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
      className={`relative group aspect-square rounded-xl border border-dashed bg-[#FAF9F5] flex flex-col items-center justify-center cursor-pointer transition-all duration-200
        ${isFirst
          ? 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-white'
          : 'border-[#E8E6DF] text-[#8C8A85] hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-white'
        }`}
    >
      {isFirst && (
        <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-white text-[8px] font-semibold text-[#1A1A1A] uppercase border border-[#E8E6DF]">
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
  'w-full bg-[#FAF9F5] border border-[#E8E6DF] text-[#1A1A1A] placeholder-[#8C8A85] text-xs sm:text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all duration-200';

/* ─────────────────────────────────────────
   Section heading helper
───────────────────────────────────────── */
const SectionHeading = ({ children }) => (
  <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#757470] mb-5 flex items-center gap-2">
    <span className="w-3 h-[1px] bg-[#B89758]" />
    {children}
  </h2>
);

/* ─────────────────────────────────────────
   Field label helper
───────────────────────────────────────── */
const FieldLabel = ({ htmlFor, children, hint }) => (
  <div className="flex items-center justify-between mb-2">
    <label htmlFor={htmlFor} className="block text-[11px] font-semibold tracking-wider uppercase text-[#1A1A1A]">
      {children}
    </label>
    {hint && <span className="text-[10px] text-[#757470]">{hint}</span>}
  </div>
);

/* ═══════════════════════════════════════════════════════
   CreateProduct Page
   ═══════════════════════════════════════════════════════ */
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    color: '',
  });

  const [activeColorCategory, setActiveColorCategory] = useState('All');
  const [customHex, setCustomHex] = useState('#1A1A1A');
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

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("priceAmount", formData.priceAmount);
    payload.append("priceCurrency", formData.priceCurrency);
    if (formData.color) {
      payload.append("color", formData.color);
    }
    payload.append("isDraft", asDraft);

    images.forEach((file) => {
      payload.append("images", file);
    });

    await handleCreateProduct(payload);
    navigate('/seller/dashboard');
  };

  const PublishBtn = ({ full }) => (
    <button
      type="submit"
      className={`${full ? 'w-full' : 'flex-1 sm:flex-none sm:px-10'} px-7 py-3.5 rounded-lg bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer shadow-xs active:scale-[0.99]`}
    >
      Publish Piece
      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );

  const DraftBtn = ({ full }) => (
    <button
      type="button"
      onClick={(e) => handleSubmit(e, true)}
      className={`${full ? 'w-full' : 'w-full sm:w-auto'} px-6 py-3.5 rounded-lg border border-[#E8E6DF] hover:border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F5F4EE] bg-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs`}
    >
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
      Save as Draft
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#1A1A1A] flex flex-col selection:bg-[#EAE4D3] selection:text-[#1A1A1A] antialiased">
      {/* ════════════════════════════════════
          HEADER
          ════════════════════════════════════ */}
      <header className="w-full border-b border-[#E8E6DF] bg-white/90 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between gap-4">

          <Link
            to="/seller/dashboard"
            className="group inline-flex items-center gap-2 text-xs tracking-wider uppercase font-semibold text-[#5C5A55] hover:text-[#1A1A1A] transition-colors duration-200 flex-shrink-0"
          >
            <span className="w-8 h-8 rounded-full border border-[#E8E6DF] bg-white flex items-center justify-center group-hover:border-[#1A1A1A] group-hover:bg-[#F5F4EE] transition-all shadow-xs">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 tracking-[0.25em] text-xl sm:text-2xl font-bold text-[#1A1A1A]"
          >
            <span className="font-serif">SNITCH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
            <span className="hidden md:inline text-[9px] tracking-[0.2em] font-semibold text-[#757470] uppercase ml-1 px-2 py-0.5 border border-[#E8E6DF] rounded bg-[#F5F4EE]">
              Seller
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E8E6DF] bg-white text-[11px] font-semibold tracking-wider uppercase text-[#1A1A1A] flex-shrink-0 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
            New Garment
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          PAGE BODY
          ════════════════════════════════════ */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">

        <div className="mb-8">
          <span className="inline-block mb-2 text-[10px] font-semibold tracking-[0.25em] uppercase text-[#B89758] bg-white px-3 py-1 rounded-full border border-[#C5A880]/30 shadow-xs">
            Catalogue Entry
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] font-normal tracking-tight font-serif">
            List a New Garment Piece
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5A55] font-light leading-relaxed">
            Specify tailoring details, pricing, palette, and lookbook imagery to publish to the Snitch marketplace.
          </p>
        </div>

        {/* ── FORM ── */}
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">

            {/* LEFT COLUMN — Form Fields */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Card: Basic Info */}
              <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6 sm:p-8 shadow-xs">
                <SectionHeading>Basic Information</SectionHeading>

                <div className="space-y-5">
                  <div>
                    <FieldLabel htmlFor="title" hint={`${formData.title.length} / 80`}>
                      Garment Title <span className="text-[#ba1a1a]">*</span>
                    </FieldLabel>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      maxLength={80}
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Double-Faced Oat Cashmere Overcoat"
                      className={inputCls}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="description" hint="Detailed composition & tailoring">
                      Description <span className="text-[#ba1a1a]">*</span>
                    </FieldLabel>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the fabric origin, silhouette, fit, and artisan details..."
                      className={`${inputCls} resize-y leading-relaxed min-h-[120px]`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Card: Pricing */}
              <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6 sm:p-8 shadow-xs">
                <SectionHeading>Pricing &amp; Valuation</SectionHeading>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <FieldLabel htmlFor="priceAmount">
                      Base Price Amount <span className="text-[#ba1a1a]">*</span>
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
                        className={`${inputCls} pr-20`}
                        required
                      />
                      <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[10px] text-[#757470] tracking-wider uppercase">
                        Tax Incl.
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <FieldLabel htmlFor="priceCurrency">
                      Currency <span className="text-[#ba1a1a]">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <select
                        id="priceCurrency"
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        className={`${inputCls} appearance-none cursor-pointer pr-10`}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#757470]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Color & Palette */}
              <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <SectionHeading>Color &amp; Palette</SectionHeading>
                  {formData.color ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] text-xs text-[#1A1A1A]">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
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
                        className="text-[10px] text-[#757470] hover:text-[#ba1a1a] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#757470] uppercase tracking-wider">
                      Optional
                    </span>
                  )}
                </div>

                {/* Category filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4">
                  {COLOR_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveColorCategory(cat)}
                      className={`px-3 py-1 rounded-md text-xs font-medium tracking-wider transition-all duration-200 border flex-shrink-0 cursor-pointer ${
                        activeColorCategory === cat
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                          : 'bg-[#FAF9F5] border-[#E8E6DF] text-[#5C5A55] hover:text-[#1A1A1A]'
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
                            ? 'bg-[#F5F4EE] border-[#1A1A1A] ring-1 ring-[#1A1A1A]'
                            : 'bg-white border-[#E8E6DF] hover:border-[#1A1A1A] hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex-shrink-0 border ${color.border} shadow-xs`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`text-xs truncate ${isSelected ? 'text-[#1A1A1A] font-semibold' : 'text-[#5C5A55]'}`}>
                          {color.name}
                        </span>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-[#1A1A1A] ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input row */}
                <div className="pt-4 border-t border-[#E8E6DF]">
                  <FieldLabel htmlFor="customColor" hint="Or enter a bespoke shade name">
                    Custom Color Name / Shade
                  </FieldLabel>
                  <div className="flex items-center gap-3">
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
                        className="w-10 h-10 rounded-xl cursor-pointer bg-white border border-[#E8E6DF] p-0.5 overflow-hidden"
                        title="Pick custom hex color"
                      />
                    </div>

                    <input
                      id="customColor"
                      name="color"
                      type="text"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g. Sage Moss, Heather Sand, Ivory"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile action bar */}
              <div className="lg:hidden flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                <DraftBtn full={false} />
                <PublishBtn full={false} />
              </div>

            </div>

            {/* RIGHT COLUMN — Images panel + desktop actions */}
            <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-24">

              {/* Card: Images */}
              <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <SectionHeading>Lookbook Imagery</SectionHeading>
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-[#1A1A1A] font-semibold bg-[#FAF9F5] px-2.5 py-0.5 rounded-full border border-[#E8E6DF]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
                    {images.length} / 7
                  </div>
                </div>

                {/* Drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`group cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 mb-5
                    ${isDragging
                      ? 'border-[#1A1A1A] bg-[#F5F4EE]'
                      : 'border-[#E8E6DF] bg-[#FAF9F5] hover:border-[#1A1A1A] hover:bg-white'
                    }`}
                >
                  <div className="w-11 h-11 rounded-full border border-[#E8E6DF] bg-white flex items-center justify-center mb-2.5 text-[#B89758] shadow-xs">
                    <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-[#1A1A1A] mb-0.5">
                    Drag &amp; drop or{' '}
                    <span className="underline underline-offset-4 decoration-[#B89758]">
                      browse
                    </span>
                  </p>
                  <p className="text-[11px] text-[#757470]">
                    PNG, JPG, WebP • Portrait (3:4) preferred
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

                {/* Image Slots Grid */}
                <div>
                  <div className="text-[10px] font-semibold tracking-wider uppercase text-[#757470] mb-3">
                    Image Slots
                  </div>
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
                    <div />
                  </div>
                </div>
              </div>

              {/* Card: Actions — Desktop */}
              <div className="hidden lg:block bg-white border border-[#E8E6DF] rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col gap-3">
                  <PublishBtn full />
                  <DraftBtn full />
                </div>
                <p className="mt-4 text-center text-[10px] text-[#757470] tracking-wide leading-relaxed">
                  Drafts remain private to your atelier studio.<br />Published pieces appear immediately in the catalogue.
                </p>
              </div>

            </div>

          </div>
        </form>

        <div className="mt-14 text-center text-[10px] tracking-widest text-[#8C8A85] uppercase">
          Snitch Privé Atelier &bull; Seller Partner Suite &bull; Curated Haute Tailoring
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
