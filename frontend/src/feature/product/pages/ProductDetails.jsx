import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'

/* ─── Currency symbol map ───────────────────────────────── */
const CURRENCY_SYMBOL = {
  INR: '₹',
  USD: '$',
  GBP: '£',
  EUR: '€',
  AED: 'د.إ',
}

/* ─── Variant helpers ───────────────────────────────── */
const normKey = (k) => k.trim().replace(/^\w/, (c) => c.toUpperCase())

const normAttrs = (attrs = {}) => {
  const out = {}
  Object.entries(attrs).forEach(([k, v]) => { out[normKey(k)] = v })
  return out
}

function getAttributeKeys(variants = []) {
  const keys = new Set()
  variants.forEach((v) => Object.keys(normAttrs(v.attributes)).forEach((k) => keys.add(k)))
  return [...keys]
}

function getAttrValues(variants = [], key) {
  const vals = new Set()
  variants.forEach((v) => {
    const na = normAttrs(v.attributes)
    if (na[key] !== undefined) vals.add(na[key])
  })
  return [...vals]
}

function isValueAvailable(variants = [], key, value, currentSelections = {}) {
  return variants.some((v) => {
    const na = normAttrs(v.attributes)
    if (na[key] !== value) return false
    return Object.entries(currentSelections).every(([k, val]) => {
      if (k === key) return true
      if (val === undefined || val === null) return true
      return na[k] === val
    })
  })
}

function findMatchingVariant(variants = [], selections = {}) {
  const selEntries = Object.entries(selections).filter(([, v]) => v != null && v !== '')
  if (!selEntries.length) return null

  const exact = variants.find((v) => {
    const na = normAttrs(v.attributes)
    return selEntries.every(([k, val]) => na[k] === val)
  })
  if (exact) return exact

  let best = null
  let bestScore = 0
  for (const v of variants) {
    const na = normAttrs(v.attributes)
    const score = selEntries.filter(([k, val]) => na[k] === val).length
    if (score > bestScore) { bestScore = score; best = v }
  }
  return bestScore > 0 ? best : null
}

/* ─── Skeleton Loader ───────────────────────────────────── */
const DetailSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 animate-pulse">
    <div className="h-4 w-48 bg-[#EAE8E2] rounded mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
        <div className="flex sm:flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-20 bg-[#EAE8E2] rounded-xl" />
          ))}
        </div>
        <div className="flex-1 aspect-[3/4] bg-[#EAE8E2] rounded-2xl" />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-5">
        <div className="h-4 w-32 bg-[#EAE8E2] rounded" />
        <div className="h-8 w-3/4 bg-[#EAE8E2] rounded" />
        <div className="h-6 w-36 bg-[#EAE8E2] rounded" />
        <div className="h-20 w-full bg-[#EAE8E2] rounded-xl" />
        <div className="h-12 w-full bg-[#EAE8E2] rounded-xl" />
        <div className="h-14 w-full bg-[#EAE8E2] rounded-xl" />
      </div>
    </div>
  </div>
)

/* ═══════════════════════════════════════════════════════
   ProductDetails Page
   ═══════════════════════════════════════════════════════ */
const ProductDetails = () => {
  const params = useParams()
  const productId = params?.productId
  const navigate = useNavigate()

  const productDetails = useSelector((state) => state.products.productDetails)
  const user = useSelector((state) => state.auth.user)
  const { handleGetProductDetails } = useProduct()

  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedAttrs, setSelectedAttrs] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [addedToast, setAddedToast] = useState(null)

  async function fetchProductDetails(id) {
    try {
      setLoading(true)
      await handleGetProductDetails(id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) fetchProductDetails(productId)
  }, [productId])

  useEffect(() => {
    setSelectedAttrs({})
    setSelectedImage(0)
  }, [productDetails?._id])

  const product = productDetails
  const variants = product?.variants || []
  const attrKeys = getAttributeKeys(variants)

  const selectedVariant = variants.length ? findMatchingVariant(variants, selectedAttrs) : null
  const hasSelections = Object.values(selectedAttrs).some(Boolean)

  const activeImages = selectedVariant?.images?.length ? selectedVariant.images : product?.images || []
  const currency = selectedVariant?.price?.currency || product?.price?.currency || 'INR'
  const symbol = CURRENCY_SYMBOL[currency] || currency
  const priceAmount = Number(selectedVariant?.price?.amount ?? product?.price?.amount ?? 0)

  const images = activeImages
  const hasImages = images.length > 0

  const handleAttrSelect = (key, value) => {
    setSelectedAttrs((prev) => {
      const next = { ...prev }
      if (next[key] === value) {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
    setSelectedImage(0)
  }

  const handleNextImage = () => {
    if (hasImages) setSelectedImage((prev) => (prev + 1) % images.length)
  }
  const handlePrevImage = () => {
    if (hasImages) setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleAddToCart = () => {
    const attrStr = Object.entries(selectedAttrs).map(([k, v]) => `${k}: ${v}`).join(', ')
    setAddedToast({
      title: 'Added to Bag',
      subtitle: `${product?.title || 'Item'}${attrStr ? ` (${attrStr})` : ''} × ${quantity}`,
    })
    setTimeout(() => setAddedToast(null), 2500)
  }

  const handleBuyNow = () => {
    setAddedToast({
      title: 'Proceeding to Checkout',
      subtitle: `${product?.title || 'Item'} • Total: ${symbol}${(priceAmount * quantity).toLocaleString('en-IN')}`,
    })
    setTimeout(() => setAddedToast(null), 3000)
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#1A1A1A] flex flex-col selection:bg-[#EAE4D3] selection:text-[#1A1A1A] antialiased">
      {/* ════════════════════════════════════
          STICKY NAVBAR
          ════════════════════════════════════ */}
      <header className="w-full border-b border-[#E8E6DF] bg-white/90 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 text-xs tracking-wider uppercase font-semibold text-[#5C5A55] hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full border border-[#E8E6DF] bg-white flex items-center justify-center group-hover:border-[#1A1A1A] group-hover:bg-[#F5F4EE] transition-all shadow-xs">
                <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </span>
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="h-5 w-[1px] bg-[#E8E6DF] hidden sm:block" />

            <Link
              to="/"
              className="flex items-center gap-2 tracking-[0.25em] text-xl sm:text-2xl font-bold text-[#1A1A1A] hover:text-[#B89758] transition-colors"
            >
              <span className="font-serif">SNITCH</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'seller' && (
                  <Link
                    to="/seller/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E8E6DF] text-[#1A1A1A] hover:bg-[#F5F4EE] hover:border-[#1A1A1A] text-[11px] font-semibold tracking-wider uppercase transition-colors shadow-xs"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F4EE] border border-[#E8E6DF]">
                  <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-[#FAF9F5] flex items-center justify-center font-bold text-xs uppercase">
                    {(user.fullName || user.email || 'U')[0]}
                  </div>
                  <span className="text-xs font-medium text-[#1A1A1A] max-w-[130px] truncate hidden sm:inline">
                    {user.fullName || user.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-[11px] tracking-wider uppercase font-semibold text-[#5C5A55] hover:text-[#1A1A1A] transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] font-semibold text-[11px] tracking-wider uppercase transition-all shadow-sm"
                >
                  Join Privé
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Toast Notification ── */}
      {addedToast && (
        <div className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-50 bg-white border border-[#1A1A1A] text-[#1A1A1A] px-5 py-4 rounded-xl shadow-[0_16px_40px_rgba(26,26,26,0.12)] flex items-center gap-3 max-w-[90vw] sm:max-w-sm animate-fade-in">
          <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            ✓
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#1A1A1A]">{addedToast.title}</p>
            <p className="text-[11px] text-[#5C5A55] truncate">{addedToast.subtitle}</p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          PAGE CONTENT
          ════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 pb-28 sm:pb-12">
        {loading ? (
          <DetailSkeleton />
        ) : !product ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-4 bg-white border border-[#E8E6DF] rounded-2xl p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full border border-[#C5A880]/30 bg-[#FAF9F5] flex items-center justify-center text-[#B89758]">
              <svg className="w-8 h-8 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1 font-serif">
                Piece Not Found
              </h2>
              <p className="text-xs text-[#757470] max-w-sm mx-auto font-light leading-relaxed">
                The garment you are looking for has been archived or the atelier link is no longer active.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#2D2D2D] transition-all shadow-xs"
            >
              Browse Catalogue
            </Link>
          </div>
        ) : (
          <div>
            {/* ── Breadcrumb ── */}
            <nav className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-[#757470] mb-8 font-medium">
              <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
              <span>/</span>
              <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Catalogue</Link>
              <span>/</span>
              <span className="text-[#1A1A1A] font-semibold truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
            </nav>

            {/* ── Main Two-Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

              {/* ══════════════════════════════════════
                  LEFT COLUMN: Interactive Gallery
                  ══════════════════════════════════════ */}
              <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] pb-2 sm:pb-0 flex-shrink-0">
                    {images.map((img, idx) => (
                      <button
                        key={img._id || idx}
                        onClick={() => setSelectedImage(idx)}
                        onMouseEnter={() => setSelectedImage(idx)}
                        className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-[#F5F4EE] cursor-pointer ${
                          selectedImage === idx
                            ? 'border-[#1A1A1A] shadow-xs scale-[1.02]'
                            : 'border-[#E8E6DF] opacity-75 hover:opacity-100 hover:border-[#B89758]'
                        }`}
                      >
                        <img src={img.url} alt={`${product.title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-white/90 text-[8px] font-medium text-[#1A1A1A] uppercase tracking-wider">
                            Cover
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Primary Large Image (3:4 ratio) */}
                <div className="relative flex-1 aspect-[3/4] rounded-2xl bg-[#F5F4EE] border border-[#E8E6DF] overflow-hidden shadow-[0_4px_24px_rgba(26,26,26,0.06)] group">
                  {hasImages ? (
                    <>
                      <img
                        src={images[selectedImage]?.url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 border border-[#E8E6DF] text-[10px] font-semibold text-[#1A1A1A] tracking-wider uppercase backdrop-blur-xs shadow-xs">
                        Photo {selectedImage + 1} / {images.length}
                      </div>
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#1A1A1A] text-white font-semibold text-[9px] tracking-widest uppercase shadow-xs">
                        {selectedVariant ? 'Variant Preview' : 'Atelier Release'}
                      </div>
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            aria-label="Previous photo"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-[#E8E6DF] text-[#1A1A1A] flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-[#1A1A1A] hover:text-white shadow-md active:scale-95 z-20 cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNextImage}
                            aria-label="Next photo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-[#E8E6DF] text-[#1A1A1A] flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-[#1A1A1A] hover:text-white shadow-md active:scale-95 z-20 cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8C8A85] gap-3">
                      <svg className="w-14 h-14 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs uppercase tracking-widest">No preview images</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ══════════════════════════════════════
                  RIGHT COLUMN: Product Info & Purchase
                  ══════════════════════════════════════ */}
              <div className="lg:col-span-5 flex flex-col gap-6">

                {/* Top Badge & Rating */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#B89758] bg-[#FAF9F5] px-3 py-1 rounded-full border border-[#C5A880]/40">
                        {selectedVariant ? 'Variant Active' : 'Original Piece'}
                      </span>
                      {hasSelections && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAttrs({})
                            setSelectedImage(0)
                          }}
                          className="text-[10px] font-semibold uppercase tracking-wider text-[#757470] hover:text-[#1A1A1A] transition-colors underline underline-offset-4 cursor-pointer"
                        >
                          View Original
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A] font-medium">
                      <span className="text-[#B89758]">★</span>
                      <span>4.9</span>
                      <span className="text-[10px] text-[#757470] font-normal">(124 reviews)</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A1A] tracking-tight leading-tight mb-3 font-serif">
                    {product.title}
                  </h1>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                      {symbol}{priceAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#757470] uppercase tracking-wider">
                      {currency}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F5F4EE] text-[10px] font-medium text-[#5C5A55] border border-[#E8E6DF]">
                      Taxes Included
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#E8E6DF]" />

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#757470] mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-[#5C5A55] leading-relaxed font-light whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* ── Variant Attribute Selectors ── */}
                {attrKeys.length > 0 && (
                  <div className="flex flex-col gap-5 bg-white border border-[#E8E6DF] rounded-xl p-5 shadow-xs">
                    {attrKeys.map((key) => {
                      const values = getAttrValues(variants, key)
                      const selectedVal = selectedAttrs[key]
                      return (
                        <div key={key}>
                          {/* Label row */}
                          <div className="flex items-center gap-2 mb-2.5">
                            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#757470]">
                              {key}
                            </span>
                            {selectedVal ? (
                              <>
                                <span className="text-[10px] text-[#757470]">·</span>
                                <span className="text-[11px] font-semibold text-[#1A1A1A]">
                                  {selectedVal}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAttrSelect(key, selectedVal)}
                                  className="ml-auto text-[9px] uppercase tracking-wider text-[#757470] hover:text-[#ba1a1a] transition-colors flex items-center gap-1 cursor-pointer"
                                  title={`Clear ${key}`}
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Clear
                                </button>
                              </>
                            ) : (
                              <span className="ml-auto text-[9px] uppercase tracking-wider text-[#8C8A85] italic">
                                Select option
                              </span>
                            )}
                          </div>

                          {/* Value pills */}
                          <div className="flex flex-wrap gap-2">
                            {values.map((val) => {
                              const isSelected = selectedVal === val
                              const available = isValueAvailable(variants, key, val, selectedAttrs)
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleAttrSelect(key, val)}
                                  disabled={!available}
                                  title={!available ? `${val} — not available with current selection` : val}
                                  className={`
                                    relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wider
                                    transition-all duration-200 border select-none cursor-pointer
                                    ${isSelected
                                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs scale-[1.02]'
                                      : available
                                        ? 'bg-white text-[#1A1A1A] border-[#E8E6DF] hover:border-[#1A1A1A] hover:bg-[#F5F4EE]'
                                        : 'bg-[#F5F4EE] text-[#8C8A85] border-[#E8E6DF] cursor-not-allowed opacity-60'
                                    }
                                  `}
                                >
                                  {val}
                                  {!available && (
                                    <span className="absolute inset-x-2 top-1/2 h-[1px] bg-[#8C8A85] pointer-events-none" />
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}

                    {/* Stock indicator */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#F0EFEB]">
                      <div className="flex items-center gap-2">
                        {selectedVariant ? (
                          (selectedVariant.stock ?? 0) > 0 ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-600" />
                              <p className="text-[10px] font-semibold tracking-wider uppercase text-emerald-800">
                                Variant In Stock · {selectedVariant.stock} available
                              </p>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-rose-600" />
                              <p className="text-[10px] font-semibold tracking-wider uppercase text-rose-800">
                                Variant Out of Stock
                              </p>
                            </>
                          )
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-[#B89758]" />
                            <p className="text-[10px] font-semibold tracking-wider uppercase text-[#757470]">
                              Viewing Original Piece · Select options above
                            </p>
                          </>
                        )}
                      </div>

                      {hasSelections && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAttrs({})
                            setSelectedImage(0)
                          }}
                          className="text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#B89758] transition-colors underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Quantity Selector ── */}
                <div>
                  <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#757470] mb-2.5">
                    Quantity
                  </span>
                  <div className="inline-flex items-center rounded-lg bg-white border border-[#E8E6DF] p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F4EE] transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center text-sm font-semibold text-[#1A1A1A]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F4EE] transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ── Primary Action Buttons ── */}
                <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
                  {/* Add to Bag */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 px-5 py-3.5 rounded-lg border border-[#1A1A1A] bg-white hover:bg-[#F5F4EE] text-[#1A1A1A] font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 group shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Bag
                  </button>

                  {/* Buy Now */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 px-6 py-3.5 rounded-lg bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white font-semibold text-xs tracking-wider uppercase shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Buy Now &bull; {symbol}{(priceAmount * quantity).toLocaleString('en-IN')}
                  </button>

                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={() => setIsWishlisted((prev) => !prev)}
                    className={`px-4 py-3.5 rounded-lg border transition-all duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer ${
                      isWishlisted
                        ? 'border-[#ba1a1a] bg-rose-50 text-[#ba1a1a]'
                        : 'border-[#E8E6DF] bg-white text-[#757470] hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                    }`}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <svg
                      className="w-5 h-5 transition-transform active:scale-125"
                      fill={isWishlisted ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* ── Accordion / Tabs ── */}
                <div className="border-t border-[#E8E6DF] pt-6">
                  <div className="flex border-b border-[#E8E6DF] mb-4 gap-6 text-[11px] uppercase tracking-widest font-semibold">
                    {['details', 'care', 'shipping'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2.5 transition-colors relative cursor-pointer ${
                          activeTab === tab ? 'text-[#1A1A1A]' : 'text-[#757470] hover:text-[#1A1A1A]'
                        }`}
                      >
                        {tab === 'details' ? 'Specifications' : tab === 'care' ? 'Fabric & Care' : 'Shipping & Returns'}
                        {activeTab === tab && <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#1A1A1A]" />}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-[#5C5A55] leading-relaxed font-light">
                    {activeTab === 'details' && (
                      <ul className="space-y-2 list-disc list-inside">
                        <li>Atelier ID: <span className="font-mono text-[#1A1A1A]">#{product._id}</span></li>
                        {product.color && (
                          <li>Colorway: <span className="font-semibold text-[#1A1A1A]">{product.color}</span></li>
                        )}
                        <li>Tailored silhouette crafted for effortless modern wear</li>
                        <li>High-precision Italian stitching &amp; natural horn button detailing</li>
                        <li>Limited release verified by the Snitch atelier</li>
                      </ul>
                    )}
                    {activeTab === 'care' && (
                      <p>
                        Specialist dry clean recommended. Alternatively, hand wash cold with mild pH-neutral silk/wool detergent. Do not bleach or tumble dry. Cool iron inside out. Store on contoured wooden hanger.
                      </p>
                    )}
                    {activeTab === 'shipping' && (
                      <p>
                        Dispatched within 24 to 48 hours in our signature archival garment box with garment bag. Complimentary returns and size exchanges within 14 days of delivery.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile Sticky Purchase Bar ── */}
      {product && !loading && (
        <aside aria-label="Mobile purchase bar" className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E8E6DF] p-3 z-40 flex items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#757470] uppercase tracking-wider font-medium truncate">
              {Object.values(selectedAttrs).filter(Boolean).join(' / ') || 'Original Piece'}
            </span>
            <span className="text-base font-bold text-[#1A1A1A] tracking-tight">
              {symbol}{(priceAmount * quantity).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-3 rounded-lg border border-[#E8E6DF] bg-white text-[#1A1A1A] active:scale-95 transition-all shadow-xs"
              title="Add to Bag"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="px-5 py-3 rounded-lg bg-[#1A1A1A] text-white font-semibold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Buy Now
            </button>
          </div>
        </aside>
      )}

      {/* ════════════════════════════════════
          FOOTER
          ════════════════════════════════════ */}
      <footer className="border-t border-[#E8E6DF] bg-[#FAF9F5] py-10 mt-16 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-bold tracking-[0.25em] text-[#1A1A1A] flex items-center gap-2 font-serif">
            SNITCH
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
          </div>
          <p className="text-[11px] tracking-widest text-[#757470] uppercase text-center">
            Privé Atelier &bull; Curated Haute Tailoring &bull; {new Date().getFullYear()}
          </p>
          <div className="flex gap-4 text-[11px] tracking-wider uppercase font-semibold">
            <Link to="/" className="text-[#5C5A55] hover:text-[#1A1A1A] transition-colors">Home</Link>
            <Link to="/seller/dashboard" className="text-[#5C5A55] hover:text-[#1A1A1A] transition-colors">Seller Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProductDetails
