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

// Normalise an attribute key: trim + Title Case → "size" / "SIZE" / "Size" all → "Size"
const normKey = (k) => k.trim().replace(/^\w/, (c) => c.toUpperCase())

// Build a normalised attributes object from raw variant attrs
const normAttrs = (attrs = {}) => {
  const out = {}
  Object.entries(attrs).forEach(([k, v]) => { out[normKey(k)] = v })
  return out
}

// Collect all unique normalised attribute keys across all variants
function getAttributeKeys(variants = []) {
  const keys = new Set()
  variants.forEach((v) => Object.keys(normAttrs(v.attributes)).forEach((k) => keys.add(k)))
  return [...keys]
}

// Collect unique values for a normalised key across all variants
function getAttrValues(variants = [], key) {
  const vals = new Set()
  variants.forEach((v) => {
    const na = normAttrs(v.attributes)
    if (na[key] !== undefined) vals.add(na[key])
  })
  return [...vals]
}

// Check if a value for a key is available given the OTHER currently selected attrs
function isValueAvailable(variants = [], key, value, currentSelections = {}) {
  return variants.some((v) => {
    const na = normAttrs(v.attributes)
    if (na[key] !== value) return false
    return Object.entries(currentSelections).every(([k, val]) => {
      if (k === key) return true                         // skip self
      if (val === undefined || val === null) return true // not selected
      return na[k] === val
    })
  })
}

// Find best-matching variant for current selections (exact first, then partial)
function findMatchingVariant(variants = [], selections = {}) {
  const selEntries = Object.entries(selections).filter(([, v]) => v != null && v !== '')
  // If user hasn't selected any attributes, return null so the ORIGINAL product is displayed
  if (!selEntries.length) return null

  // Exact match
  const exact = variants.find((v) => {
    const na = normAttrs(v.attributes)
    return selEntries.every(([k, val]) => na[k] === val)
  })
  if (exact) return exact

  // Best partial match (only if at least one selected attr matches)
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
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 animate-pulse">
    <div className="h-4 w-48 bg-[#1a1c22] rounded-full mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
        <div className="flex sm:flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-20 bg-[#1a1c22] rounded-xl" />
          ))}
        </div>
        <div className="flex-1 aspect-[3/4] bg-[#1a1c22] rounded-2xl" />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-5">
        <div className="h-4 w-28 bg-[#1a1c22] rounded-full" />
        <div className="h-8 w-3/4 bg-[#1a1c22] rounded-lg" />
        <div className="h-6 w-36 bg-[#1a1c22] rounded-md" />
        <div className="h-20 w-full bg-[#1a1c22] rounded-xl" />
        <div className="h-12 w-full bg-[#1a1c22] rounded-xl" />
        <div className="h-14 w-full bg-[#1a1c22] rounded-xl" />
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

  // On product load, start with NO variant selected so the ORIGINAL product is displayed
  useEffect(() => {
    setSelectedAttrs({})
    setSelectedImage(0)
  }, [productDetails?._id])

  const product = productDetails
  const variants = product?.variants || []
  const attrKeys = getAttributeKeys(variants)

  const selectedVariant = variants.length ? findMatchingVariant(variants, selectedAttrs) : null
  const hasSelections = Object.values(selectedAttrs).some(Boolean)

  // Merge: variant overrides main product values; fall back to product if variant has none
  const activeImages = selectedVariant?.images?.length ? selectedVariant.images : product?.images || []
  const currency = selectedVariant?.price?.currency || product?.price?.currency || 'INR'
  const symbol = CURRENCY_SYMBOL[currency] || currency
  const priceAmount = Number(selectedVariant?.price?.amount ?? product?.price?.amount ?? 0)

  const images = activeImages
  const hasImages = images.length > 0

  // Toggle: clicking selected value deselects it; clicking new value selects it
  const handleAttrSelect = (key, value) => {
    setSelectedAttrs((prev) => {
      const next = { ...prev }
      if (next[key] === value) {
        delete next[key]  // deselect
      } else {
        next[key] = value // select
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
    <div
      className="min-h-screen w-full bg-[#0b0c10] text-[#e4e1e7] flex flex-col selection:bg-[#fabc4d]/20 selection:text-[#ffd700] antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Ambient Radial Glows ── */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_15%_15%,rgba(229,169,60,0.08),transparent_65%)] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[650px] h-[650px] bg-[radial-gradient(circle_at_85%_85%,rgba(250,188,77,0.06),transparent_65%)] pointer-events-none -z-10" />

      {/* ════════════════════════════════════
          STICKY NAVBAR
          ════════════════════════════════════ */}
      <header className="w-full border-b border-[#e5a93c]/15 bg-[#0b0c10]/85 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 text-xs tracking-wider uppercase font-medium text-[#d4c4b0]/70 hover:text-[#ffd700] transition-colors duration-200"
            >
              <span className="w-8 h-8 rounded-full border border-[#e5a93c]/20 bg-[#131317] flex items-center justify-center group-hover:border-[#fabc4d]/55 group-hover:bg-[#fabc4d]/8 transition-all duration-200">
                <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </span>
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="h-5 w-[1px] bg-[#e5a93c]/20 hidden sm:block" />

            <Link
              to="/"
              className="flex items-center gap-2 tracking-[0.22em] text-lg sm:text-xl font-bold text-[#e5a93c]"
              style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
            >
              SNITCH
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_6px_rgba(255,215,0,0.9)]" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'seller' && (
                  <Link
                    to="/seller/dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e5a93c]/30 text-[#fabc4d] hover:border-[#ffd700]/60 hover:text-[#ffd700] text-[11px] font-semibold tracking-wider uppercase transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131317] border border-[#e5a93c]/25 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#ffd700] to-[#e5a93c] text-[#0b0c10] flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {(user.fullName || user.email || 'U')[0]}
                  </div>
                  <span className="text-xs font-medium text-[#e4e1e7] max-w-[130px] truncate">
                    {user.fullName || user.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-[11px] tracking-wider uppercase font-semibold text-[#d4c4b0]/60 hover:text-[#fabc4d] transition-colors duration-200 hidden sm:block px-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] font-semibold text-[11px] tracking-wider uppercase shadow-[0_4px_18px_rgba(229,169,60,0.3)] hover:brightness-110 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Toast Notification ── */}
      {addedToast && (
        <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#131317] border border-[#ffd700]/40 text-[#e4e1e7] px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-bounce max-w-[90vw] sm:max-w-sm">
          <span className="w-6 h-6 rounded-full bg-[#ffd700]/20 text-[#ffd700] flex items-center justify-center font-bold text-xs flex-shrink-0">
            ✓
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white">{addedToast.title}</p>
            <p className="text-[10px] text-[#d4c4b0]/60 truncate">{addedToast.subtitle}</p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          PAGE CONTENT
          ════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 pb-28 sm:pb-10">
        {loading ? (
          <DetailSkeleton />
        ) : !product ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-5">
            <div className="w-20 h-20 rounded-2xl border border-[#e5a93c]/20 bg-[#131317] flex items-center justify-center text-[#fabc4d]/40">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Product Not Found
              </h2>
              <p className="text-sm text-[#d4c4b0]/45 max-w-sm mx-auto">
                The piece you are looking for is no longer available or the link may be outdated.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] text-xs font-semibold tracking-wider uppercase shadow-[0_4px_18px_rgba(229,169,60,0.3)] hover:brightness-110 transition-all duration-200"
            >
              Browse Catalogue
            </Link>
          </div>
        ) : (
          <div>
            {/* ── Breadcrumb ── */}
            <nav className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-[#d4c4b0]/40 mb-6 font-medium">
              <Link to="/" className="hover:text-[#ffd700] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#d4c4b0]/60">Catalogue</span>
              <span>/</span>
              <span className="text-[#fabc4d] truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
            </nav>

            {/* ── Main Two-Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

              {/* ══════════════════════════════════════
                  LEFT COLUMN: Interactive Gallery
                  ══════════════════════════════════════ */}
              <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[560px] pb-2 sm:pb-0 scrollbar-none flex-shrink-0">
                    {images.map((img, idx) => (
                      <button
                        key={img._id || idx}
                        onClick={() => setSelectedImage(idx)}
                        onMouseEnter={() => setSelectedImage(idx)}
                        className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-[#121216] ${
                          selectedImage === idx
                            ? 'border-[#ffd700] shadow-[0_0_14px_rgba(255,215,0,0.35)] scale-[1.02]'
                            : 'border-[#2a2c35] opacity-65 hover:opacity-100 hover:border-[#fabc4d]/50'
                        }`}
                      >
                        <img src={img.url} alt={`${product.title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-[#0b0c10]/80 text-[7px] font-mono text-[#fabc4d] uppercase">
                            Cover
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Primary Large Image */}
                <div className="relative flex-1 aspect-[3/4] rounded-2xl bg-[#121216] border border-[#e5a93c]/20 overflow-hidden shadow-[0_12px_44px_-10px_rgba(0,0,0,0.75)] group">
                  <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent z-10" />

                  {hasImages ? (
                    <>
                      <img
                        src={images[selectedImage]?.url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-[#0b0c10]/80 border border-[#e5a93c]/30 text-[10px] font-mono text-[#fabc4d] tracking-wider uppercase backdrop-blur-sm">
                        Photo {selectedImage + 1} / {images.length}
                      </div>
                      {selectedImage === 0 && (
                        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-[#e5a93c]/90 text-[#0b0c10] font-bold text-[9px] tracking-widest uppercase shadow-md">
                          {selectedVariant ? 'Variant Preview' : 'Original Product'}
                        </div>
                      )}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            aria-label="Previous photo"
                            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0b0c10]/80 border border-[#e5a93c]/35 text-[#e4e1e7] flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-[#e5a93c] hover:text-[#0b0c10] shadow-lg active:scale-95 z-20"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNextImage}
                            aria-label="Next photo"
                            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0b0c10]/80 border border-[#e5a93c]/35 text-[#e4e1e7] flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-[#e5a93c] hover:text-[#0b0c10] shadow-lg active:scale-95 z-20"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#d4c4b0]/25 gap-3">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#fabc4d]/85 bg-[#fabc4d]/10 px-3 py-1 rounded-full border border-[#fabc4d]/25">
                        {selectedVariant ? 'Variant Active' : 'Original Product'}
                      </span>
                      {hasSelections && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAttrs({})
                            setSelectedImage(0)
                          }}
                          className="text-[10px] font-semibold uppercase tracking-wider text-[#d4c4b0]/60 hover:text-[#ffd700] transition-colors underline underline-offset-4 cursor-pointer"
                        >
                          View Original
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#ffd700]">
                      <span>★ 4.9</span>
                      <span className="text-[10px] text-[#d4c4b0]/40 font-mono">(124 reviews)</span>
                    </div>
                  </div>

                  <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {product.title}
                  </h1>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#fabc4d] tracking-tight">
                      {symbol}{priceAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#d4c4b0]/40 font-mono uppercase tracking-wider">
                      {currency}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#e5a93c]/15 text-[10px] font-medium text-[#ffd700] border border-[#e5a93c]/30">
                      Taxes Included
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-[#e5a93c]/30 via-[#e5a93c]/10 to-transparent" />

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#d4c4b0]/55 mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-[#d4c4b0]/75 leading-relaxed font-light whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* ── Variant Attribute Selectors ── */}
                {attrKeys.length > 0 && (
                  <div className="flex flex-col gap-5">
                    {attrKeys.map((key) => {
                      const values = getAttrValues(variants, key)
                      const selectedVal = selectedAttrs[key]
                      return (
                        <div key={key}>
                          {/* Label row */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#d4c4b0]/55">
                              {key}
                            </span>
                            {selectedVal ? (
                              <>
                                <span className="text-[10px] text-[#d4c4b0]/30">·</span>
                                <span className="text-[11px] font-semibold text-[#ffd700]">
                                  {selectedVal}
                                </span>
                                {/* Clear button */}
                                <button
                                  type="button"
                                  onClick={() => handleAttrSelect(key, selectedVal)}
                                  className="ml-auto text-[9px] uppercase tracking-wider text-[#d4c4b0]/35 hover:text-[#ff6b6b] transition-colors flex items-center gap-1"
                                  title={`Clear ${key}`}
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Clear
                                </button>
                              </>
                            ) : (
                              <span className="ml-auto text-[9px] uppercase tracking-wider text-[#d4c4b0]/30 italic">
                                Not selected
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
                                    relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wider
                                    transition-all duration-200 border select-none
                                    ${isSelected
                                      ? 'bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] border-[#ffd700] shadow-[0_4px_16px_rgba(229,169,60,0.35)] scale-[1.03]'
                                      : available
                                        ? 'bg-[#131317] text-[#e4e1e7]/85 border-[#2a2c35] hover:border-[#fabc4d]/60 hover:bg-[#1c1a10] hover:scale-[1.02]'
                                        : 'bg-[#0f1013] text-[#d4c4b0]/25 border-[#1e2028] cursor-not-allowed'
                                    }
                                  `}
                                >
                                  {val}
                                  {/* Strikethrough for unavailable */}
                                  {!available && (
                                    <span className="absolute inset-x-2 top-1/2 h-[1px] bg-[#d4c4b0]/20 pointer-events-none" />
                                  )}
                                  {/* Checkmark badge for selected */}
                                  {isSelected && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0b0c10] border border-[#ffd700] flex items-center justify-center">
                                      <svg className="w-2.5 h-2.5 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}

                    {/* Stock indicator & Original Product toggle */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        {selectedVariant ? (
                          (selectedVariant.stock ?? 0) > 0 ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                              <p className="text-[10px] font-semibold tracking-wider uppercase text-emerald-400/80">
                                Variant In Stock · {selectedVariant.stock} left
                              </p>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.7)]" />
                              <p className="text-[10px] font-semibold tracking-wider uppercase text-red-400/80">
                                Variant Out of Stock
                              </p>
                            </>
                          )
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_6px_rgba(255,215,0,0.7)]" />
                            <p className="text-[10px] font-semibold tracking-wider uppercase text-[#ffd700]">
                              Viewing Original Product · Select options below to view variants
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
                          className="text-[10px] uppercase tracking-wider font-semibold text-[#fabc4d] hover:text-[#ffd700] transition-colors underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reset to Original
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Quantity Selector ── */}
                <div>
                  <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#d4c4b0]/55 mb-2.5">
                    Quantity
                  </span>
                  <div className="inline-flex items-center rounded-xl bg-[#131317] border border-[#2a2c35] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#d4c4b0] hover:text-[#ffd700] hover:bg-[#20222a] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center text-sm font-semibold font-mono text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#d4c4b0] hover:text-[#ffd700] hover:bg-[#20222a] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ── Primary Action Buttons ── */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3 pt-2">
                  {/* Add to Bag */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 px-5 py-3.5 sm:py-4 rounded-xl border border-[#e5a93c]/50 bg-[#131317] hover:border-[#ffd700] hover:bg-[#e5a93c]/10 text-[#fabc4d] hover:text-[#ffd700] font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Bag
                  </button>

                  {/* Buy Now */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 px-6 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] hover:brightness-110 text-[#0b0c10] font-bold text-xs tracking-wider uppercase shadow-[0_4px_22px_rgba(229,169,60,0.35)] hover:shadow-[0_6px_30px_rgba(229,169,60,0.5)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Buy Now &bull; {symbol}{(priceAmount * quantity).toLocaleString('en-IN')}
                  </button>

                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={() => setIsWishlisted((prev) => !prev)}
                    className={`px-4 py-3.5 sm:py-4 rounded-xl border transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                      isWishlisted
                        ? 'border-[#ff4d4d] bg-[#ff4d4d]/10 text-[#ff4d4d]'
                        : 'border-[#e5a93c]/35 text-[#d4c4b0]/80 hover:text-[#ffd700] hover:border-[#ffd700]/60 hover:bg-[#e5a93c]/5'
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
                <div className="border-t border-[#e5a93c]/15 pt-5">
                  <div className="flex border-b border-[#2a2c35] mb-4 gap-6 text-[11px] uppercase tracking-widest font-semibold">
                    {['details', 'care', 'shipping'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2.5 transition-colors relative ${
                          activeTab === tab ? 'text-[#ffd700]' : 'text-[#d4c4b0]/45 hover:text-[#d4c4b0]'
                        }`}
                      >
                        {tab === 'details' ? 'Specifications' : tab === 'care' ? 'Fabric & Care' : 'Shipping'}
                        {activeTab === tab && <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#ffd700]" />}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-[#d4c4b0]/70 leading-relaxed font-light">
                    {activeTab === 'details' && (
                      <ul className="space-y-1.5 list-disc list-inside">
                        <li>Product ID: <span className="font-mono text-[#ffd700]">#{product._id}</span></li>
                        {product.color && (
                          <li>Color: <span className="font-semibold text-[#ffd700]">{product.color}</span></li>
                        )}
                        <li>Tailored fit crafted for effortless modern wear</li>
                        <li>High precision stitching &amp; premium finishing</li>
                        <li>Exclusive release available through the Snitch atelier</li>
                      </ul>
                    )}
                    {activeTab === 'care' && (
                      <p>
                        Dry clean recommended. Machine wash cold on delicate cycle with mild detergent. Do not bleach. Cool iron inside out. Hang dry in shade.
                      </p>
                    )}
                    {activeTab === 'shipping' && (
                      <p>
                        Dispatched within 24 hours in signature protective packaging. Tracking details sent via SMS &amp; email upon dispatch.
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
        <aside aria-label="Mobile purchase bar" className="sm:hidden fixed bottom-0 inset-x-0 bg-[#0b0c10]/95 backdrop-blur-lg border-t border-[#e5a93c]/25 p-3 z-40 flex items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#d4c4b0]/55 uppercase tracking-wider font-semibold">
              {Object.values(selectedAttrs).filter(Boolean).join(' / ') || 'Original Product'}
            </span>
            <span className="text-base font-extrabold text-[#fabc4d] tracking-tight">
              {symbol}{(priceAmount * quantity).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-3 rounded-xl border border-[#e5a93c]/40 bg-[#131317] text-[#fabc4d] active:scale-95 transition-all shadow-sm"
              title="Add to Bag"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] font-bold text-xs uppercase tracking-wider shadow-[0_2px_16px_rgba(229,169,60,0.4)] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Buy Now
            </button>
          </div>
        </aside>
      )}

      {/* ════════════════════════════════════
          FOOTER
          ════════════════════════════════════ */}
      <footer className="border-t border-[#e5a93c]/12 py-8 mt-16 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="text-[#e5a93c]/70 tracking-[0.22em] text-sm font-bold flex items-center gap-2"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
          >
            SNITCH
            <span className="w-1 h-1 rounded-full bg-[#ffd700]/70" />
          </div>
          <p className="text-[10px] tracking-widest text-[#d4c4b0]/25 uppercase text-center">
            Privé Atelier &bull; Curated Haute Tailoring &bull; {new Date().getFullYear()}
          </p>
          <div className="flex gap-4 text-[11px] tracking-wider uppercase font-semibold">
            <Link to="/" className="text-[#d4c4b0]/40 hover:text-[#fabc4d] transition-colors">Home</Link>
            <Link to="/seller/dashboard" className="text-[#d4c4b0]/40 hover:text-[#fabc4d] transition-colors">Seller Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProductDetails
