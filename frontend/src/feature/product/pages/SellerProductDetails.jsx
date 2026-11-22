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
  { name: 'Noir Black', hex: '#0e0e12', border: 'border-black/30' },
  { name: 'Pure White', hex: '#ffffff', border: 'border-black/20' },
  { name: 'Ivory Cream', hex: '#fdfbf7', border: 'border-black/20' },
  { name: 'Slate Charcoal', hex: '#334155', border: 'border-black/20' },
  { name: 'Heather Grey', hex: '#64748b', border: 'border-black/20' },
  { name: 'Pearl Silver', hex: '#cbd5e1', border: 'border-black/20' },

  // Earthy & Warm
  { name: 'Camel Tan', hex: '#c19a6b', border: 'border-black/20' },
  { name: 'Warm Mocha', hex: '#4a2c11', border: 'border-black/20' },
  { name: 'Sandstone Beige', hex: '#d4b996', border: 'border-black/20' },
  { name: 'Terracotta', hex: '#c85a32', border: 'border-black/20' },
  { name: 'Olive Green', hex: '#556b2f', border: 'border-black/20' },
  { name: 'Sage Moss', hex: '#8a9a86', border: 'border-black/20' },

  // Royals & Jewel Tones
  { name: 'Royal Gold', hex: '#e5a93c', border: 'border-black/20' },
  { name: 'Midnight Navy', hex: '#0f172a', border: 'border-black/20' },
  { name: 'Cobalt Blue', hex: '#1d4ed8', border: 'border-black/20' },
  { name: 'Crimson Velvet', hex: '#881337', border: 'border-black/20' },
  { name: 'Deep Burgundy', hex: '#581845', border: 'border-black/20' },
  { name: 'Emerald Silk', hex: '#064e3b', border: 'border-black/20' },
  { name: 'Royal Amethyst', hex: '#581c87', border: 'border-black/20' },

  // Pastel & Accents
  { name: 'Dusty Rose', hex: '#d4a5a5', border: 'border-black/20' },
  { name: 'Champagne', hex: '#f7e7ce', border: 'border-black/20' },
  { name: 'Lavender Mist', hex: '#c4b5fd', border: 'border-black/20' },
  { name: 'Mint Frost', hex: '#a7f3d0', border: 'border-black/20' },
  { name: 'Sky Whisper', hex: '#bae6fd', border: 'border-black/20' },
  { name: 'Sunset Amber', hex: '#ea580c', border: 'border-black/20' },
];

/* ─── Skeleton Loader Component ─────────────────────────── */
const DetailSkeleton = () => (
  <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] p-6 sm:p-8 animate-pulse">
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="h-10 w-64 bg-[#EAE8E2] rounded-xl" />
      <div className="h-64 w-full bg-[#EAE8E2] rounded-2xl" />
      <div className="h-96 w-full bg-[#EAE8E2] rounded-2xl" />
    </div>
  </div>
);

export default function SellerProductDetails() {
  const { productId } = useParams();
  const fileInputRef = useRef(null);

  const productDetails = useSelector((state) => state.products?.productDetails);
  const { handleGetProductDetails, handleAddProductVariant } = useProduct();

  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState([]);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVariants, setSelectedVariants] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [varUploadedImages, setVarUploadedImages] = useState([]);
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

  useEffect(() => {
    if (productId) {
      setLoading(true);
      handleGetProductDetails(productId)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [productId]);

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

  const handleStockInputChange = (variantId, val) => {
    const num = val === '' ? 0 : parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setVariants((prev) =>
        prev.map((v) => (v._id === variantId ? { ...v, stock: num } : v))
      );
    }
  };

  const handleAddAttribute = () => {
    if (!newAttrKey.trim() || !newAttrVal.trim()) return;
    setCustomAttrs((prev) => [...prev, { key: newAttrKey.trim(), value: newAttrVal.trim() }]);
    setNewAttrKey('');
    setNewAttrVal('');
  };

  const handleRemoveAttribute = (idx) => {
    setCustomAttrs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateVariantSubmit = async (e) => {
    e.preventDefault();

    const attributesObj = {};
    if (selectedSize) attributesObj['Size'] = selectedSize;
    if (selectedColor) attributesObj['Color'] = selectedColor;
    customAttrs.forEach((item) => {
      if (item.key && item.value) {
        attributesObj[item.key] = item.value;
      }
    });

    const variantImages = varUploadedImages.length > 0
      ? varUploadedImages.map((img) => ({ 
          url: img.previewUrl,
          file: img.file
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

    setVarUploadedImages([]);
    setCustomAttrs([]);
    setVarStock(10);

    await handleAddProductVariant(productId, newVariant);
  };

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
      <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold font-serif mb-2 text-[#1A1A1A]">Product Not Found</h2>
        <p className="text-sm text-[#757470] mb-6">The requested piece could not be found.</p>
        <Link
          to="/seller/dashboard"
          className="px-5 py-2.5 rounded-lg bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2D2D] transition-colors"
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
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] selection:bg-[#EAE4D3] selection:text-[#1A1A1A] pb-24 antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white border border-[#1A1A1A] text-[#1A1A1A] shadow-[0_12px_40px_rgba(26,26,26,0.12)]">
          <span className="w-2 h-2 rounded-full bg-[#B89758]" />
          <span className="text-xs font-medium tracking-wide">{toast}</span>
        </div>
      )}

      {/* Top Header / Breadcrumbs Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E6DF] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FAF9F5] border border-[#E8E6DF] text-[#5C5A55] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-all text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </Link>
            <span className="text-[#E8E6DF]">/</span>
            <span className="text-[11px] uppercase tracking-wider text-[#757470]">Catalogue</span>
            <span className="text-[#E8E6DF]">/</span>
            <span className="text-xs font-semibold text-[#1A1A1A] truncate max-w-[200px]">
              {productDetails.title}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F5F4EE] border border-[#E8E6DF] text-[10px] font-mono text-[#757470]">
              ID: {productDetails._id?.slice(-8)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/product/details/${productDetails._id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white border border-[#E8E6DF] text-xs font-medium text-[#5C5A55] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors shadow-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Live Piece
            </Link>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition-all cursor-pointer"
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
        <section className="relative rounded-2xl bg-white border border-[#E8E6DF] p-6 sm:p-8 shadow-[0_2px_12px_rgba(26,26,26,0.03)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Gallery Media */}
            <div className="lg:col-span-4 flex gap-4">
              <div className="relative aspect-[3/4] w-40 sm:w-44 rounded-xl border border-[#E8E6DF] bg-[#F5F4EE] overflow-hidden shadow-xs flex-shrink-0 flex items-center justify-center">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={productDetails.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#8C8A85] gap-1">
                    <svg className="w-8 h-8 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px]">No image</span>
                  </div>
                )}
                {primaryImage && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/90 border border-[#E8E6DF] text-[9px] font-medium text-[#1A1A1A] uppercase tracking-wider">
                    Cover
                  </span>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#757470]">
                    Gallery
                  </span>
                  <div className="flex flex-col gap-2">
                    {productImages.map((img, i) => (
                      <button
                        key={img._id || i}
                        onClick={() => setSelectedImgIdx(i)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          i === selectedImgIdx
                            ? 'border-[#1A1A1A] scale-105 shadow-xs'
                            : 'border-[#E8E6DF] opacity-70 hover:opacity-100 hover:border-[#1A1A1A]'
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
                <h1 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] leading-tight font-serif">
                  {productDetails.title}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Active Listing
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed line-clamp-3 font-light">
                {productDetails.description}
              </p>

              <div className="flex items-center gap-3 flex-wrap pt-2">
                <div className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#E8E6DF] text-[11px]">
                  <span className="text-[#757470] uppercase tracking-wider mr-2">Base Price:</span>
                  <span className="font-bold text-[#1A1A1A]">
                    {currencySymbol}
                    {Number(productDetails.price?.amount || 0).toLocaleString()}
                  </span>
                  <span className="ml-1 text-[10px] text-[#757470] uppercase">
                    {productDetails.price?.currency}
                  </span>
                </div>

                {sellerIdStr && (
                  <div className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#E8E6DF] text-[11px]">
                    <span className="text-[#757470] uppercase tracking-wider mr-2">Seller:</span>
                    <span className="font-mono text-[#1A1A1A]">
                      #{sellerIdStr.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* KPI stats column */}
            <div className="lg:col-span-3 grid grid-cols-2 gap-3 bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E6DF]">
              <div className="p-3 rounded-lg bg-white border border-[#E8E6DF] flex flex-col shadow-xs">
                <span className="text-[9px] uppercase tracking-wider text-[#757470] font-semibold">Total Stock</span>
                <span className="text-xl font-bold text-[#1A1A1A] mt-1">{totalStockSum}</span>
                <span className="text-[10px] text-emerald-700 font-medium">In Atelier</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#E8E6DF] flex flex-col shadow-xs">
                <span className="text-[9px] uppercase tracking-wider text-[#757470] font-semibold">Variants</span>
                <span className="text-xl font-bold text-[#1A1A1A] mt-1">{totalVariantsCount}</span>
                <span className="text-[10px] text-[#757470]">Configured SKUs</span>
              </div>

              <div className="col-span-2 p-3 rounded-lg bg-white border border-[#E8E6DF] flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#757470] font-semibold">Inventory Valuation</span>
                  <p className="text-base font-bold text-[#1A1A1A] mt-0.5">
                    {currencySymbol}{totalValuation.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${lowStockCount > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700'}`}>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E8E6DF] shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-[#8C8A85]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by attribute, size, or color..."
                  className="w-full bg-[#FAF9F5] border border-[#E8E6DF] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8C8A85] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#FAF9F5] border border-[#E8E6DF] text-[11px]">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-[#1A1A1A] text-white font-semibold'
                      : 'text-[#5C5A55] hover:text-[#1A1A1A]'
                  }`}
                >
                  All ({variants.length})
                </button>
                <button
                  onClick={() => setStatusFilter('IN_STOCK')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'IN_STOCK'
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'text-[#5C5A55] hover:text-[#1A1A1A]'
                  }`}
                >
                  In Stock ({variants.filter((v) => v.stock >= 5).length})
                </button>
                <button
                  onClick={() => setStatusFilter('LOW_STOCK')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'LOW_STOCK'
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'text-[#5C5A55] hover:text-[#1A1A1A]'
                  }`}
                >
                  Low Stock ({lowStockCount})
                </button>
                <button
                  onClick={() => setStatusFilter('OUT_OF_STOCK')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'OUT_OF_STOCK'
                      ? 'bg-rose-700 text-white font-semibold'
                      : 'text-[#5C5A55] hover:text-[#1A1A1A]'
                  }`}
                >
                  Out ({outOfStockCount})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Variant
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-[#E8E6DF] bg-white overflow-hidden shadow-xs">
            {filteredVariants.length === 0 ? (
              <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center text-[#B89758] mb-4">
                  <svg className="w-8 h-8 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-normal text-[#1A1A1A] mb-1 font-serif">
                  {variants.length === 0 ? 'No Variants Created Yet' : 'No Variants Matching Filter'}
                </h3>
                <p className="text-xs text-[#757470] max-w-sm mb-6 leading-relaxed font-light">
                  {variants.length === 0 
                    ? 'Build your inventory catalogue by adding sizes, colors, and stock allocations for this piece.'
                    : 'Try clearing the search or status filter to see existing variants.'}
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 rounded-md bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2D2D] transition-all cursor-pointer shadow-xs"
                >
                  + Add Variant
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#E8E6DF] bg-[#F5F4EE] text-[10px] font-semibold uppercase tracking-widest text-[#757470]">
                      <th className="py-3.5 px-4 w-12 text-center">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedVariants.length > 0 && selectedVariants.length === filteredVariants.length}
                          className="w-3.5 h-3.5 rounded border-[#E8E6DF] cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-3 w-16">Preview</th>
                      <th className="py-3.5 px-4">Attributes &amp; Specifications</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4 w-64">Stock Management</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E6DF] text-xs">
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          In Stock ({stockVal})
                        </span>
                      );

                      if (stockVal === 0) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            Out of Stock
                          </span>
                        );
                      } else if (stockVal < 5) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Low Stock ({stockVal} left)
                          </span>
                        );
                      }

                      return (
                        <tr key={vId} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-4 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedVariants.includes(vId)}
                              onChange={() => handleSelectOne(vId)}
                              className="w-3.5 h-3.5 rounded border-[#E8E6DF] cursor-pointer"
                            />
                          </td>

                          <td className="py-4 px-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#E8E6DF] bg-[#F5F4EE] flex-shrink-0 flex items-center justify-center">
                              {vImg ? (
                                <img src={vImg} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[9px] text-[#8C8A85]">No img</span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {attrEntries.length > 0 ? (
                                attrEntries.map(([k, val]) => (
                                  <span
                                    key={k}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F5F4EE] border border-[#E8E6DF] text-[11px] text-[#1A1A1A]"
                                  >
                                    <span className="text-[#757470] font-medium">{k}:</span>
                                    <span className="font-semibold text-[#1A1A1A]">{val}</span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-[#757470] italic">
                                  Variant #{idx + 1}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-bold text-[#1A1A1A]">
                              {sym}{Number(vPrice).toLocaleString()}
                            </span>
                            <span className="ml-1 text-[9px] text-[#757470] uppercase">
                              {vCurrency}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center rounded-lg border border-[#E8E6DF] bg-white p-0.5 shadow-xs">
                                  <button
                                    type="button"
                                    onClick={() => handleStockStep(vId, -1)}
                                    className="w-7 h-7 rounded text-[#1A1A1A] hover:bg-[#F5F4EE] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={v.stock}
                                    onChange={(e) => handleStockInputChange(vId, e.target.value)}
                                    className="w-12 text-center bg-transparent text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleStockStep(vId, 1)}
                                    className="w-7 h-7 rounded text-[#1A1A1A] hover:bg-[#F5F4EE] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="w-36 h-1 rounded-full bg-[#E8E6DF] overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    stockVal === 0 
                                      ? 'bg-rose-500 w-0' 
                                      : stockVal < 5 
                                      ? 'bg-amber-500 w-1/4' 
                                      : 'bg-emerald-600 w-3/4'
                                  }`}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            {statusBadge}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                title="Quick +10 restock"
                                onClick={() => handleStockStep(vId, 10)}
                                className="px-2.5 py-1 rounded bg-white border border-[#E8E6DF] text-[10px] text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors cursor-pointer shadow-xs"
                              >
                                +10
                              </button>
                              <button
                                type="button"
                                title="Delete variant"
                                onClick={() => handleDeleteVariantClick(vId)}
                                className="p-1.5 rounded-lg text-[#757470] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
          3. CREATE PRODUCT VARIANT MODAL
          ═════════════════════════════════════════════════════ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white border border-[#E8E6DF] shadow-[0_24px_80px_rgba(26,26,26,0.15)] p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF] mb-6">
              <div>
                <h2 className="text-xl font-normal text-[#1A1A1A] font-serif">
                  Add Garment Variant
                </h2>
                <p className="text-xs text-[#757470] mt-0.5 font-light">
                  Configure size, color attributes, photos, and allocate inventory.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setVarUploadedImages([]);
                }}
                className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E8E6DF] text-[#757470] hover:text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVariantSubmit} className="space-y-5">
              {/* Variant Images: File Upload Drag & Drop Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]">
                    Variant Imagery (Upload Files)
                  </label>
                  <span className="text-[10px] text-[#757470]">
                    {varUploadedImages.length} image{varUploadedImages.length !== 1 ? 's' : ''} selected
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-5 flex flex-col items-center justify-center cursor-pointer text-center ${
                    isDragging
                      ? 'border-[#1A1A1A] bg-[#F5F4EE]'
                      : 'border-[#E8E6DF] bg-[#FAF9F5] hover:border-[#1A1A1A] hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8E6DF] flex items-center justify-center text-[#B89758] mb-2 shadow-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-[#1A1A1A]">
                    Click to browse or drag &amp; drop variant photos here
                  </p>
                  <p className="text-[10px] text-[#757470] mt-1">
                    Supports PNG, JPG, JPEG, WEBP
                  </p>
                </div>

                {/* Image Previews Grid */}
                {varUploadedImages.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[#757470] mb-2 block">
                      Uploaded Variant Images:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                      {varUploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg border border-[#E8E6DF] bg-[#F5F4EE] overflow-hidden group shadow-xs"
                        >
                          <img
                            src={img.previewUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-semibold text-[#1A1A1A] uppercase border border-[#E8E6DF]">
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

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border border-dashed border-[#E8E6DF] hover:border-[#1A1A1A] bg-white text-[#757470] hover:text-[#1A1A1A] flex flex-col items-center justify-center text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-base font-bold">+</span>
                        <span className="text-[9px]">Add More</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Add from Master Photos */}
                {productImages.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E8E6DF] flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-[#757470] uppercase tracking-wider">
                      Or select master photos:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {productImages.map((img, i) => (
                        <button
                          key={img._id || i}
                          type="button"
                          onClick={() => handleSelectMasterImage(img.url)}
                          title="Include this master photo for variant"
                          className="w-8 h-8 rounded-md overflow-hidden border border-[#E8E6DF] hover:border-[#1A1A1A] transition-transform hover:scale-105 cursor-pointer"
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
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
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
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'bg-white border border-[#E8E6DF] text-[#1A1A1A] hover:bg-[#F5F4EE]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Preset Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
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
                          ? 'bg-[#F5F4EE] border border-[#1A1A1A] font-semibold text-[#1A1A1A]'
                          : 'bg-white border border-[#E8E6DF] text-[#5C5A55] hover:border-[#1A1A1A]'
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
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Additional Custom Attributes (Optional)
                </label>
                {customAttrs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {customAttrs.map((attr, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#F5F4EE] border border-[#E8E6DF] text-xs text-[#1A1A1A]"
                      >
                        <span className="text-[#757470] font-medium">{attr.key}:</span>
                        <span>{attr.value}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(idx)}
                          className="text-[#757470] hover:text-rose-600 ml-1 cursor-pointer"
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
                    className="flex-1 bg-white border border-[#E8E6DF] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8C8A85] focus:outline-none focus:border-[#1A1A1A]"
                  />
                  <input
                    type="text"
                    value={newAttrVal}
                    onChange={(e) => setNewAttrVal(e.target.value)}
                    placeholder="Value (e.g. Slim)"
                    className="flex-1 bg-white border border-[#E8E6DF] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8C8A85] focus:outline-none focus:border-[#1A1A1A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E8E6DF] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F5F4EE] transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                    Variant Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={varPriceAmount}
                    onChange={(e) => setVarPriceAmount(e.target.value)}
                    className="w-full bg-white border border-[#E8E6DF] rounded-lg px-3.5 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                    Currency
                  </label>
                  <select
                    value={varCurrency}
                    onChange={(e) => setVarCurrency(e.target.value)}
                    className="w-full bg-white border border-[#E8E6DF] rounded-lg px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
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
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Initial Stock Count
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    required
                    value={varStock}
                    onChange={(e) => setVarStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-28 bg-white border border-[#E8E6DF] rounded-lg px-3.5 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                  <div className="flex gap-1.5">
                    {[10, 25, 50, 100].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setVarStock((prev) => (Number(prev) || 0) + inc)}
                        className="px-2.5 py-1 rounded bg-[#FAF9F5] border border-[#E8E6DF] text-[10px] text-[#1A1A1A] hover:bg-white cursor-pointer"
                      >
                        +{inc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setVarUploadedImages([]);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#757470] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-md bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                >
                  Create &amp; Save Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
