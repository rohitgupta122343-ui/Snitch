import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';

/* ─── Currency symbol map ───────────────────────────────── */
const CURRENCY_SYMBOL = {
  INR: '₹',
  USD: '$',
  GBP: '£',
  EUR: '€',
  JPY: '¥',
  AED: 'د.إ',
};

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const PRESET_COLORS = [
  // Classic & Neutrals
  { name: 'Noir Black', hex: '#0e0e12', border: 'border-white/20' },
  { name: 'Pure White', hex: '#ffffff', border: 'border-black/30' },
  { name: 'Ivory Cream', hex: '#fdfbf7', border: 'border-black/25' },
  { name: 'Slate Charcoal', hex: '#334155', border: 'border-white/20' },
  { name: 'Heather Grey', hex: '#64748b', border: 'border-white/20' },
  { name: 'Pearl Silver', hex: '#cbd5e1', border: 'border-white/30' },

  // Earthy & Warm
  { name: 'Camel Tan', hex: '#c19a6b', border: 'border-white/20' },
  { name: 'Warm Mocha', hex: '#4a2c11', border: 'border-white/20' },
  { name: 'Sandstone Beige', hex: '#d4b996', border: 'border-black/20' },
  { name: 'Terracotta', hex: '#c85a32', border: 'border-white/20' },
  { name: 'Olive Green', hex: '#556b2f', border: 'border-white/20' },
  { name: 'Sage Moss', hex: '#8a9a86', border: 'border-white/20' },

  // Royals & Jewel Tones
  { name: 'Royal Gold', hex: '#e5a93c', border: 'border-white/20' },
  { name: 'Midnight Navy', hex: '#0f172a', border: 'border-white/20' },
  { name: 'Cobalt Blue', hex: '#1d4ed8', border: 'border-white/20' },
  { name: 'Crimson Velvet', hex: '#881337', border: 'border-white/20' },
  { name: 'Deep Burgundy', hex: '#581845', border: 'border-white/20' },
  { name: 'Emerald Silk', hex: '#064e3b', border: 'border-white/20' },
  { name: 'Royal Amethyst', hex: '#581c87', border: 'border-white/20' },

  // Pastel & Accents
  { name: 'Dusty Rose', hex: '#d4a5a5', border: 'border-white/20' },
  { name: 'Champagne', hex: '#f7e7ce', border: 'border-black/20' },
  { name: 'Lavender Mist', hex: '#c4b5fd', border: 'border-white/20' },
  { name: 'Mint Frost', hex: '#a7f3d0', border: 'border-black/20' },
  { name: 'Sky Whisper', hex: '#bae6fd', border: 'border-black/20' },
  { name: 'Sunset Amber', hex: '#ea580c', border: 'border-white/20' },
];

/* ─── Skeleton Loader Component ─────────────────────────── */
const DetailSkeleton = () => (
  <div className="min-h-screen bg-[#0b0c10] text-[#e4e1e7] p-6 sm:p-8 animate-pulse">
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="h-10 w-64 bg-[#131317] rounded-xl border border-[#2a2c35]" />
      <div className="h-64 w-full bg-[#131317] rounded-2xl border border-[#2a2c35]" />
      <div className="h-96 w-full bg-[#131317] rounded-2xl border border-[#2a2c35]" />
    </div>
  </div>
);

export default function SellerProductDetails() {
  const { productId } = useParams();
  const fileInputRef = useRef(null);

  // Redux & Product Hook
  const productDetails = useSelector((state) => state.products?.productDetails);
  const { handleGetProductDetails,handleAddProductVariant } = useProduct();

  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState([]);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [toast, setToast] = useState(null);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  const [selectedVariants, setSelectedVariants] = useState([]);

  // Modal State for Add Variant
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Variant Form State
  const [varUploadedImages, setVarUploadedImages] = useState([]); // [{ file, previewUrl, name }]
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(null);
  const [customAttrs, setCustomAttrs] = useState([]);
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrVal, setNewAttrVal] = useState('');
  const [varPriceAmount, setVarPriceAmount] = useState('');
  const [varCurrency, setVarCurrency] = useState('INR');
  const [varStock, setVarStock] = useState(10);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch product details
  useEffect(() => {
    if (productId) {
      setLoading(true);
      handleGetProductDetails(productId)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [productId]);

  // Sync variants and default form values when productDetails changes
  useEffect(() => {
    if (productDetails) {
      if (Array.isArray(productDetails.variants)) {
        setVariants(productDetails.variants);
      } else {
        setVariants([]);
      }
      if (productDetails.price?.amount) {
        setVarPriceAmount(String(productDetails.price.amount));
      }
      if (productDetails.price?.currency) {
        setVarCurrency(productDetails.price.currency);
      }
    }
  }, [productDetails]);

  // Image file handler for variant upload
  const handleFileSelect = (filesList) => {
    const files = Array.from(filesList || []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;

    const newEntries = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    setVarUploadedImages((prev) => [...prev, ...newEntries]);
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveUploadedImage = (idx) => {
    setVarUploadedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSelectMasterImage = (url) => {
    setVarUploadedImages((prev) => [...prev, { previewUrl: url, name: 'master-image' }]);
  };

  // Filtered variants
  const filteredVariants = useMemo(() => {
    return variants.filter((v) => {
      let matchSearch = true;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const attrString = v.attributes 
          ? (v.attributes instanceof Map 
              ? Array.from(v.attributes.entries()).map(([k, val]) => `${k}:${val}`).join(' ')
              : Object.entries(v.attributes).map(([k, val]) => `${k}:${val}`).join(' '))
          : '';
        const idMatch = v._id?.toLowerCase().includes(term);
        matchSearch = attrString.toLowerCase().includes(term) || idMatch;
      }

      if (!matchSearch) return false;
      if (statusFilter === 'IN_STOCK') return v.stock >= 5;
      if (statusFilter === 'LOW_STOCK') return v.stock > 0 && v.stock < 5;
      if (statusFilter === 'OUT_OF_STOCK') return v.stock === 0;
      return true;
    });
  }, [variants, searchTerm, statusFilter]);

  // Real-time Summary Metrics
  const totalVariantsCount = variants.length;
  const totalStockSum = useMemo(() => variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0), [variants]);
  const lowStockCount = useMemo(() => variants.filter((v) => v.stock > 0 && v.stock < 5).length, [variants]);
  const outOfStockCount = useMemo(() => variants.filter((v) => v.stock === 0).length, [variants]);
  const totalValuation = useMemo(() => {
    return variants.reduce((acc, v) => {
      const amt = Number(v.price?.amount || productDetails?.price?.amount || 0);
      return acc + amt * (Number(v.stock) || 0);
    }, 0);
  }, [variants, productDetails]);

  // Stock Stepper handler (UI state)
  const handleStockStep = (variantId, delta) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v._id === variantId) {
          const current = Number(v.stock) || 0;
          const next = Math.max(0, current + delta);
          return { ...v, stock: next };
        }
        return v;
      })
    );
  };

  // Stock Input handler (UI state)
  const handleStockInputChange = (variantId, val) => {
    const num = val === '' ? 0 : parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setVariants((prev) =>
        prev.map((v) => (v._id === variantId ? { ...v, stock: num } : v))
      );
    }
  };

  // Custom attribute builder
  const handleAddAttribute = () => {
    if (!newAttrKey.trim() || !newAttrVal.trim()) return;
    setCustomAttrs((prev) => [...prev, { key: newAttrKey.trim(), value: newAttrVal.trim() }]);
    setNewAttrKey('');
    setNewAttrVal('');
  };

  const handleRemoveAttribute = (idx) => {
    setCustomAttrs((prev) => prev.filter((_, i) => i !== idx));
  };

  // Create Variant (UI State)
  const handleCreateVariantSubmit = async(e) => {
    e.preventDefault();

    const attributesObj = {};
    if (selectedSize) attributesObj['Size'] = selectedSize;
    if (selectedColor) attributesObj['Color'] = selectedColor;
    customAttrs.forEach((item) => {
      if (item.key && item.value) {
        attributesObj[item.key] = item.value;
      }
    });

    // Extract image URLs from uploaded files (or master image if none uploaded)
   const variantImages = varUploadedImages.length > 0
  ? varUploadedImages.map((img) => ({ 
      url: img.previewUrl,
      file: img.file // <-- Pass the actual File object through!
    }))
  : productDetails?.images?.length > 0
  ? [{ url: productDetails.images[0].url }]
  : [];


    const newVariant = {
      _id: `var_${Date.now()}`,
      images: variantImages,
      stock: Number(varStock) || 0,
      attributes: attributesObj,
      price: {
        amount: Number(varPriceAmount) || Number(productDetails?.price?.amount) || 0,
        currency: varCurrency || productDetails?.price?.currency || 'INR',
      },
    };

    setVariants((prev) => [newVariant, ...prev]);
    showToast('New variant added to inventory!');
    setIsCreateModalOpen(false);

    // Reset Form
    setVarUploadedImages([]);
    setCustomAttrs([]);
    setVarStock(10);

    console.log(newVariant)

    await handleAddProductVariant(productId,newVariant)
  };

  // Delete Variant (UI State)
  const handleDeleteVariantClick = (variantId) => {
    if (!window.confirm('Delete this product variant?')) return;
    setVariants((prev) => prev.filter((v) => v._id !== variantId));
    showToast('Variant removed from inventory');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVariants(filteredVariants.map((v) => v._id));
    } else {
      setSelectedVariants([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedVariants((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-[#e4e1e7] flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold font-serif mb-2 text-[#ffd700]">Product Not Found</h2>
        <p className="text-sm text-[#d4c4b0]/60 mb-6">The requested product could not be found.</p>
        <Link
          to="/seller/dashboard"
          className="px-5 py-2.5 rounded-lg bg-[#121216] border border-[#e5a93c]/30 text-[#fabc4d] text-xs font-semibold uppercase tracking-wider hover:border-[#ffd700] transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const productImages = productDetails.images || [];
  const primaryImage = productImages[selectedImgIdx]?.url || productImages[0]?.url;
  const currencySymbol = CURRENCY_SYMBOL[productDetails.price?.currency] || productDetails.price?.currency || '₹';
  const sellerIdStr = productDetails.seller 
    ? (typeof productDetails.seller === 'object' ? productDetails.seller._id : String(productDetails.seller))
    : '';

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e4e1e7] font-sans selection:bg-[#e5a93c] selection:text-[#0b0c10] pb-24">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#121216]/95 border border-[#e5a93c]/40 text-[#e4e1e7] shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-ping" />
          <span className="text-xs font-medium tracking-wide">{toast}</span>
        </div>
      )}

      {/* Top Header / Breadcrumbs Bar */}
      <header className="sticky top-0 z-40 bg-[#0e0e12]/85 backdrop-blur-xl border-b border-[#e5a93c]/15 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131317] border border-[#2a2c35] text-[#d4c4b0]/70 hover:text-[#fabc4d] hover:border-[#e5a93c]/40 transition-all text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </Link>
            <span className="text-[#2a2c35]">/</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#fabc4d]/80">Catalog</span>
            <span className="text-[#2a2c35]">/</span>
            <span className="text-xs font-semibold text-[#e4e1e7] truncate max-w-[200px]">
              {productDetails.title}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1a1c22] border border-[#2a2c35] text-[10px] font-mono text-[#d4c4b0]/50">
              ID: {productDetails._id}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/product/details/${productDetails._id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#121216] border border-[#2a2c35] text-xs font-medium text-[#d4c4b0] hover:text-[#ffd700] hover:border-[#e5a93c]/40 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Live Store
            </Link>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(229,169,60,0.3)] hover:shadow-[0_0_28px_rgba(255,215,0,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add New Variant
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* ═════════════════════════════════════════════════════
            1. MASTER PRODUCT OVERVIEW BANNER
            ═════════════════════════════════════════════════════ */}
        <section className="relative rounded-2xl bg-[#131317] border border-[#e5a93c]/20 p-6 sm:p-8 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Subtle top aurum shimmer */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Gallery Media */}
            <div className="lg:col-span-4 flex gap-4">
              {/* Main Image Frame */}
              <div className="relative aspect-[3/4] w-40 sm:w-44 rounded-xl border border-[#e5a93c]/30 bg-[#0b0c10] overflow-hidden shadow-xl flex-shrink-0 group flex items-center justify-center">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={productDetails.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#d4c4b0]/30 gap-1">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px]">No image</span>
                  </div>
                )}
                {primaryImage && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0b0c10]/80 border border-[#e5a93c]/30 text-[9px] font-mono text-[#fabc4d]">
                    Cover
                  </span>
                )}
              </div>

              {/* Thumbnails strip */}
              {productImages.length > 1 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#d4c4b0]/45">
                    Gallery
                  </span>
                  <div className="flex flex-col gap-2">
                    {productImages.map((img, i) => (
                      <button
                        key={img._id || i}
                        onClick={() => setSelectedImgIdx(i)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          i === selectedImgIdx
                            ? 'border-[#ffd700] scale-105 shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                            : 'border-[#2a2c35] opacity-60 hover:opacity-100 hover:border-[#e5a93c]/50'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Meta & Details */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1
                  className="text-2xl sm:text-3xl font-bold text-[#e4e1e7] leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {productDetails.title}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Listing
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#d4c4b0]/65 leading-relaxed line-clamp-3">
                {productDetails.description}
              </p>

              <div className="flex items-center gap-3 flex-wrap pt-2">
                <div className="px-3 py-1.5 rounded-lg bg-[#0e0e12] border border-[#2a2c35] text-[11px]">
                  <span className="text-[#d4c4b0]/40 uppercase tracking-wider mr-2">Base Price:</span>
                  <span className="font-bold text-[#fabc4d]">
                    {currencySymbol}
                    {Number(productDetails.price?.amount || 0).toLocaleString()}
                  </span>
                  <span className="ml-1 text-[10px] text-[#d4c4b0]/50 font-mono">
                    {productDetails.price?.currency}
                  </span>
                </div>

                {sellerIdStr && (
                  <div className="px-3 py-1.5 rounded-lg bg-[#0e0e12] border border-[#2a2c35] text-[11px]">
                    <span className="text-[#d4c4b0]/40 uppercase tracking-wider mr-2">Seller:</span>
                    <span className="font-mono text-[#e4e1e7]/80">
                      {sellerIdStr.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick KPI stats column */}
            <div className="lg:col-span-3 grid grid-cols-2 gap-3 bg-[#0e0e12]/90 p-4 rounded-xl border border-[#e5a93c]/15">
              <div className="p-3 rounded-lg bg-[#131317] border border-[#2a2c35]/50 flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-[#d4c4b0]/45 font-semibold">Total Stock</span>
                <span className="text-xl font-bold text-[#e4e1e7] mt-1">{totalStockSum}</span>
                <span className="text-[10px] text-emerald-400 font-medium">In Warehouse</span>
              </div>

              <div className="p-3 rounded-lg bg-[#131317] border border-[#2a2c35]/50 flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-[#d4c4b0]/45 font-semibold">Variants</span>
                <span className="text-xl font-bold text-[#ffd700] mt-1">{totalVariantsCount}</span>
                <span className="text-[10px] text-[#d4c4b0]/50">Configured SKUs</span>
              </div>

              <div className="col-span-2 p-3 rounded-lg bg-[#131317] border border-[#2a2c35]/50 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#d4c4b0]/45 font-semibold">Inventory Valuation</span>
                  <p className="text-base font-bold text-[#fabc4d] mt-0.5">
                    {currencySymbol}{totalValuation.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${lowStockCount > 0 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {lowStockCount > 0 ? `${lowStockCount} Low Alert` : 'Stock Healthy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════
            2. VARIANT INVENTORY & STOCK MANAGEMENT MATRIX
            ═════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          {/* Controls Bar: Search + Filter Pills + Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#131317] border border-[#2a2c35]">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-[#d4c4b0]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by attribute, size, or color..."
                  className="w-full bg-[#0b0c10] border border-[#2a2c35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#e4e1e7] placeholder-[#d4c4b0]/35 focus:outline-none focus:border-[#fabc4d] transition-colors"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0b0c10] border border-[#2a2c35]/80 text-[11px]">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-[#e5a93c]/20 text-[#ffd700] font-semibold border border-[#e5a93c]/35'
                      : 'text-[#d4c4b0]/60 hover:text-[#e4e1e7]'
                  }`}
                >
                  All ({variants.length})
                </button>
                <button
                  onClick={() => setStatusFilter('IN_STOCK')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'IN_STOCK'
                      ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/35'
                      : 'text-[#d4c4b0]/60 hover:text-[#e4e1e7]'
                  }`}
                >
                  In Stock ({variants.filter((v) => v.stock >= 5).length})
                </button>
                <button
                  onClick={() => setStatusFilter('LOW_STOCK')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'LOW_STOCK'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/35'
                      : 'text-[#d4c4b0]/60 hover:text-[#e4e1e7]'
                  }`}
                >
                  Low Stock ({lowStockCount})
                </button>
                <button
                  onClick={() => setStatusFilter('OUT_OF_STOCK')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'OUT_OF_STOCK'
                      ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/35'
                      : 'text-[#d4c4b0]/60 hover:text-[#e4e1e7]'
                  }`}
                >
                  Out ({outOfStockCount})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#1a1810] border border-[#e5a93c]/40 text-[#fabc4d] hover:bg-[#e5a93c]/20 hover:text-[#ffd700] transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Variant
              </button>
            </div>
          </div>

          {/* Luxury Table */}
          <div className="rounded-2xl border border-[#e5a93c]/18 bg-[#131317] overflow-hidden shadow-2xl">
            {filteredVariants.length === 0 ? (
              <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#0b0c10] border border-[#e5a93c]/25 flex items-center justify-center text-[#fabc4d] mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3
                  className="text-lg font-bold text-[#e4e1e7] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {variants.length === 0 ? 'No Variants Created Yet' : 'No Variants Matching Filter'}
                </h3>
                <p className="text-xs text-[#d4c4b0]/55 max-w-sm mb-6 leading-relaxed">
                  {variants.length === 0 
                    ? 'Start building your inventory catalog by adding sizes, colors, and stock allocations for this product.'
                    : 'Try clearing the search or status filter to see existing variants.'}
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(229,169,60,0.3)] hover:scale-105 transition-all cursor-pointer"
                >
                  + Add Variant
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#2a2c35] bg-[#0e0e12] text-[10px] font-semibold uppercase tracking-widest text-[#d4c4b0]/50">
                      <th className="py-3.5 px-4 w-12 text-center">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedVariants.length > 0 && selectedVariants.length === filteredVariants.length}
                          className="accent-[#e5a93c] w-3.5 h-3.5 rounded bg-[#121216] border-[#2a2c35] cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-3 w-16">Preview</th>
                      <th className="py-3.5 px-4">Attributes & Specifications</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4 w-64">Stock Management</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2c35]/50 text-xs">
                    {filteredVariants.map((v, idx) => {
                      const vId = v._id || `variant-${idx}`;
                      const vImg = v.images?.[0]?.url || productImages[0]?.url;
                      const vPrice = v.price?.amount ?? productDetails.price?.amount ?? 0;
                      const vCurrency = v.price?.currency || productDetails.price?.currency || 'INR';
                      const sym = CURRENCY_SYMBOL[vCurrency] || vCurrency;

                      const attrEntries = v.attributes 
                        ? (v.attributes instanceof Map ? Array.from(v.attributes.entries()) : Object.entries(v.attributes))
                        : [];
                      const stockVal = Number(v.stock) || 0;

                      let statusBadge = (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          In Stock ({stockVal})
                        </span>
                      );

                      if (stockVal === 0) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Out of Stock
                          </span>
                        );
                      } else if (stockVal < 5) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            Low Stock ({stockVal} left)
                          </span>
                        );
                      }

                      return (
                        <tr
                          key={vId}
                          className="hover:bg-[#18181e] transition-colors"
                        >
                          {/* Checkbox */}
                          <td className="py-4 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedVariants.includes(vId)}
                              onChange={() => handleSelectOne(vId)}
                              className="accent-[#e5a93c] w-3.5 h-3.5 rounded bg-[#121216] border-[#2a2c35] cursor-pointer"
                            />
                          </td>

                          {/* Thumbnail */}
                          <td className="py-4 px-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#e5a93c]/30 bg-[#0b0c10] flex-shrink-0 flex items-center justify-center">
                              {vImg ? (
                                <img src={vImg} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[9px] text-[#d4c4b0]/40">No img</span>
                              )}
                            </div>
                          </td>

                          {/* Attributes */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {attrEntries.length > 0 ? (
                                attrEntries.map(([k, val]) => (
                                  <span
                                    key={k}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0e0e12] border border-[#2a2c35] text-[11px] text-[#e4e1e7]"
                                  >
                                    <span className="text-[#d4c4b0]/45 font-medium">{k}:</span>
                                    <span className="font-semibold text-[#ffd700]">{val}</span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-[#d4c4b0]/40 italic">
                                  Variant #{idx + 1}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-[#fabc4d]">
                              {sym}{Number(vPrice).toLocaleString()}
                            </span>
                            <span className="ml-1 text-[9px] text-[#d4c4b0]/40 font-mono">
                              {vCurrency}
                            </span>
                          </td>

                          {/* Stock Management with Stepper */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center rounded-lg border border-[#2a2c35] bg-[#0b0c10] p-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleStockStep(vId, -1)}
                                    className="w-7 h-7 rounded text-[#d4c4b0] hover:text-[#ffd700] hover:bg-[#1a1c22] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={v.stock}
                                    onChange={(e) => handleStockInputChange(vId, e.target.value)}
                                    className="w-12 text-center bg-transparent text-xs font-mono font-bold text-[#e4e1e7] focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleStockStep(vId, 1)}
                                    className="w-7 h-7 rounded text-[#d4c4b0] hover:text-[#ffd700] hover:bg-[#1a1c22] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Capacity meter */}
                              <div className="w-36 h-1 rounded-full bg-[#1e2026] overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    stockVal === 0 
                                      ? 'bg-rose-500 w-0' 
                                      : stockVal < 5 
                                      ? 'bg-amber-400 w-1/4' 
                                      : 'bg-emerald-400 w-3/4'
                                  }`}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            {statusBadge}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                title="Quick +10 restock"
                                onClick={() => handleStockStep(vId, 10)}
                                className="px-2 py-1 rounded bg-[#0b0c10] border border-[#2a2c35] text-[10px] text-[#fabc4d] hover:border-[#ffd700] transition-colors cursor-pointer"
                              >
                                +10
                              </button>
                              <button
                                type="button"
                                title="Delete variant"
                                onClick={() => handleDeleteVariantClick(vId)}
                                className="p-1.5 rounded-lg text-[#d4c4b0]/40 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ═════════════════════════════════════════════════════
          3. CREATE PRODUCT VARIANT MODAL (File Upload UI)
          ═════════════════════════════════════════════════════ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#131317] border border-[#e5a93c]/30 shadow-[0_24px_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            {/* Top gold line */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/40 to-transparent" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2c35] mb-6">
              <div>
                <h2
                  className="text-xl font-bold text-[#e4e1e7]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Create Product Variant
                </h2>
                <p className="text-xs text-[#d4c4b0]/55 mt-0.5">
                  Upload variant imagery, configure attributes, pricing, and stock count.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setVarUploadedImages([]);
                }}
                className="w-8 h-8 rounded-lg bg-[#0e0e12] border border-[#2a2c35] text-[#d4c4b0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVariantSubmit} className="space-y-5">
              {/* Variant Images: File Upload Drag & Drop Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4c4b0]">
                    Variant Imagery (Upload Files)
                  </label>
                  <span className="text-[10px] text-[#d4c4b0]/40">
                    {varUploadedImages.length} image{varUploadedImages.length !== 1 ? 's' : ''} selected
                  </span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                {/* Drag & Drop Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-5 flex flex-col items-center justify-center cursor-pointer text-center ${
                    isDragging
                      ? 'border-[#ffd700] bg-[#1a1810]'
                      : 'border-[#e5a93c]/35 bg-[#0b0c10] hover:border-[#fabc4d] hover:bg-[#121216]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#131317] border border-[#e5a93c]/30 flex items-center justify-center text-[#fabc4d] mb-2 shadow-inner">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-[#e4e1e7]">
                    Click to browse or drag & drop variant image files here
                  </p>
                  <p className="text-[10px] text-[#d4c4b0]/45 mt-1">
                    Supports PNG, JPG, JPEG, WEBP • Upload one or more photos
                  </p>
                </div>

                {/* Image Previews Grid */}
                {varUploadedImages.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[#d4c4b0]/50 mb-2 block">
                      Uploaded Variant Images:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                      {varUploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg border border-[#e5a93c]/40 bg-[#0b0c10] overflow-hidden group shadow-md"
                        >
                          <img
                            src={img.previewUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#e5a93c] text-[8px] font-mono font-bold text-[#0b0c10]">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveUploadedImage(idx);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {/* Add more button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border border-dashed border-[#2a2c35] hover:border-[#ffd700] bg-[#0b0c10] hover:bg-[#16161a] text-[#d4c4b0]/50 hover:text-[#ffd700] flex flex-col items-center justify-center text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-base font-bold">+</span>
                        <span className="text-[9px]">Add More</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Add from Master Photos */}
                {productImages.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#2a2c35]/50 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-[#d4c4b0]/50 uppercase tracking-wider">
                      Or select from master photos:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {productImages.map((img, i) => (
                        <button
                          key={img._id || i}
                          type="button"
                          onClick={() => handleSelectMasterImage(img.url)}
                          title="Include this master photo for variant"
                          className="w-8 h-8 rounded-md overflow-hidden border border-[#2a2c35] hover:border-[#ffd700] transition-transform hover:scale-110 cursor-pointer"
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Size Preset Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4c4b0] mb-2">
                  Size Attribute
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#e5a93c] text-[#0b0c10] shadow-[0_0_12px_rgba(229,169,60,0.4)]'
                          : 'bg-[#0b0c10] border border-[#2a2c35] text-[#d4c4b0] hover:border-[#e5a93c]/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Preset Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4c4b0] mb-2">
                  Color Attribute
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_COLORS.map((clr) => (
                    <button
                      key={clr.name}
                      type="button"
                      onClick={() => setSelectedColor(clr.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                        selectedColor === clr.name
                          ? 'bg-[#1e1c14] border border-[#ffd700] text-[#ffd700]'
                          : 'bg-[#0b0c10] border border-[#2a2c35] text-[#d4c4b0] hover:border-[#e5a93c]/40'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${clr.border}`}
                        style={{ backgroundColor: clr.hex }}
                      />
                      <span className="truncate">{clr.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Attributes Map */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4c4b0] mb-2">
                  Additional Custom Attributes (Optional)
                </label>
                {customAttrs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {customAttrs.map((attr, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b0c10] border border-[#2a2c35] text-xs text-[#e4e1e7]"
                      >
                        <span className="text-[#fabc4d] font-medium">{attr.key}:</span>
                        <span>{attr.value}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(idx)}
                          className="text-[#d4c4b0]/40 hover:text-rose-400 ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAttrKey}
                    onChange={(e) => setNewAttrKey(e.target.value)}
                    placeholder="Key (e.g. Fit)"
                    className="flex-1 bg-[#0b0c10] border border-[#2a2c35] rounded-lg px-3 py-1.5 text-xs text-[#e4e1e7] placeholder-[#d4c4b0]/30 focus:outline-none focus:border-[#fabc4d]"
                  />
                  <input
                    type="text"
                    value={newAttrVal}
                    onChange={(e) => setNewAttrVal(e.target.value)}
                    placeholder="Value (e.g. Slim)"
                    className="flex-1 bg-[#0b0c10] border border-[#2a2c35] rounded-lg px-3 py-1.5 text-xs text-[#e4e1e7] placeholder-[#d4c4b0]/30 focus:outline-none focus:border-[#fabc4d]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="px-3 py-1.5 rounded-lg bg-[#0b0c10] border border-[#2a2c35] text-xs font-semibold text-[#fabc4d] hover:border-[#ffd700] transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4c4b0] mb-2">
                    Variant Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={varPriceAmount}
                    onChange={(e) => setVarPriceAmount(e.target.value)}
                    className="w-full bg-[#0b0c10] border border-[#2a2c35] rounded-lg px-3.5 py-2 text-xs font-mono font-bold text-[#e4e1e7] focus:outline-none focus:border-[#fabc4d]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4c4b0] mb-2">
                    Currency
                  </label>
                  <select
                    value={varCurrency}
                    onChange={(e) => setVarCurrency(e.target.value)}
                    className="w-full bg-[#0b0c10] border border-[#2a2c35] rounded-lg px-3.5 py-2 text-xs font-semibold text-[#fabc4d] focus:outline-none focus:border-[#fabc4d]"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>

              {/* Initial Stock Allocation */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4c4b0] mb-2">
                  Initial Stock Count
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    required
                    value={varStock}
                    onChange={(e) => setVarStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-28 bg-[#0b0c10] border border-[#2a2c35] rounded-lg px-3.5 py-2 text-xs font-mono font-bold text-[#e4e1e7] focus:outline-none focus:border-[#fabc4d]"
                  />
                  <div className="flex gap-1.5">
                    {[10, 25, 50, 100].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setVarStock((prev) => (Number(prev) || 0) + inc)}
                        className="px-2.5 py-1 rounded bg-[#0b0c10] border border-[#2a2c35] text-[10px] font-mono text-[#fabc4d] hover:border-[#ffd700] cursor-pointer"
                      >
                        +{inc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2a2c35]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setVarUploadedImages([]);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#d4c4b0]/70 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(229,169,60,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Create & Save Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
