import React, { useEffect,useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import { Link, Navigate } from 'react-router'
import { useNavigate } from 'react-router'

/* ─── Currency symbol map ───────────────────────────────── */
const CURRENCY_SYMBOL = { INR: '₹', USD: '$', GBP: '£', EUR: '€', AED: 'د.إ' }

/* ─── Stat card ─────────────────────────────────────────── */
const StatCard = ({ label, value, icon }) => (
  <div className="relative bg-[#131317] border border-[#e5a93c]/20 rounded-2xl p-5 shadow-[0_8px_36px_-10px_rgba(0,0,0,0.65)] flex items-center gap-4">
    <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/25 to-transparent" />
    <div className="w-11 h-11 rounded-xl border border-[#e5a93c]/25 bg-[#0b0c10] flex items-center justify-center text-[#fabc4d] flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#d4c4b0]/50">{label}</p>
      <p className="text-2xl font-bold text-[#e4e1e7] leading-tight mt-0.5">{value}</p>
    </div>
  </div>
)

/* ─── Product card ──────────────────────────────────────── */
const ProductCard = ({ product }) => {

  const navigate = useNavigate()

  const [imgIdx, setImgIdx] = useState(0)
  const symbol = CURRENCY_SYMBOL[product.price?.currency] ?? product.price?.currency ?? ''

  return (
    <div className="group relative bg-[#131317] border border-[#e5a93c]/18 rounded-2xl overflow-hidden shadow-[0_8px_36px_-10px_rgba(0,0,0,0.65)] hover:border-[#fabc4d]/45 hover:shadow-[0_12px_40px_-10px_rgba(229,169,60,0.18)] transition-all duration-300 flex flex-col">
      {/* Top shimmer */}
      <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/25 to-transparent" />

      {/* Image area */}
      <div className="relative aspect-[4/3] bg-[#0b0c10] overflow-hidden flex-shrink-0">
        {product.images?.length > 0 ? (
          <>
            <img
              src={product.images[imgIdx]?.url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Cover badge */}
            {imgIdx === 0 && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#e5a93c]/90 text-[8px] font-mono tracking-tight text-[#0b0c10] font-bold">
                Cover
              </span>
            )}
            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div  className="absolute bottom-2 inset-x-2 flex gap-1 justify-center">
                {product.images.map((img, i) => (
                  
                  <button
                    key={img._id}
                    onMouseEnter={() => setImgIdx(i)}
                    onClick={() => setImgIdx(i)}
                    className={`w-8 h-8 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                      i === imgIdx ? 'border-[#ffd700] scale-110' : 'border-[#ffffff]/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                  
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#d4c4b0]/25 gap-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] tracking-wider uppercase">No images</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title & price row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#e4e1e7] leading-snug line-clamp-2 flex-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.title}
          </h3>
          <span className="flex-shrink-0 text-sm font-bold text-[#fabc4d] whitespace-nowrap">
            {symbol}{Number(product.price?.amount).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-[12px] text-[#d4c4b0]/55 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-[#e5a93c]/12 mt-auto pt-3 flex items-center justify-between gap-2">
          {/* Image count */}
          <span className="inline-flex items-center gap-1 text-[10px] text-[#d4c4b0]/40 font-mono">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {product.images?.length ?? 0} photo{product.images?.length !== 1 ? 's' : ''}
          </span>

          {/* ID chip */}
          <span className="text-[9px] font-mono text-[#d4c4b0]/25 truncate max-w-[100px]" title={product._id}>
            #{product._id?.slice(-6)}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
    <div className="w-20 h-20 rounded-2xl border border-[#e5a93c]/20 bg-[#131317] flex items-center justify-center text-[#fabc4d]/40 shadow-[0_0_30px_rgba(229,169,60,0.07)]">
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
    <div>
      <h3 className="text-base font-semibold text-[#e4e1e7] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>No products yet</h3>
      <p className="text-sm text-[#d4c4b0]/45 max-w-xs leading-relaxed">Your catalogue is empty. List your first item to start selling on Snitch.</p>
    </div>
    <Link
      to="/seller/create-product"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] text-xs font-semibold tracking-wider uppercase shadow-[0_4px_18px_rgba(229,169,60,0.3)] hover:brightness-110 hover:shadow-[0_6px_26px_rgba(229,169,60,0.45)] transition-all duration-200"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
      </svg>
      List First Product
    </Link>
  </div>
)

/* ═══════════════════════════════════════════════════════
   Dashboard
   ═══════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct()
  const sellerProduct = useSelector(state => state.products.sellerProduct)

  useEffect(() => {
    handleGetSellerProduct()
  }, [])

  /* Stats */
  const totalProducts = sellerProduct?.length ?? 0
  const totalValue = (sellerProduct ?? []).reduce((sum, p) => sum + Number(p.price?.amount ?? 0), 0)
  const totalImages = (sellerProduct ?? []).reduce((sum, p) => sum + (p.images?.length ?? 0), 0)

  return (
    <div
      className="min-h-screen w-full bg-[#0b0c10] text-[#e4e1e7] flex flex-col selection:bg-[#fabc4d]/20 selection:text-[#ffd700] antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Ambient Glow ── */}
      <div className="fixed top-0 left-0 w-[540px] h-[540px] bg-[radial-gradient(circle_at_20%_20%,rgba(229,169,60,0.08),transparent_70%)] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_80%_80%,rgba(250,188,77,0.06),transparent_70%)] pointer-events-none -z-10" />

      {/* ════════════════════════════════════
          HEADER
          ════════════════════════════════════ */}
      <header className="w-full border-b border-[#e5a93c]/15 bg-[#0b0c10]/85 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">

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

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              to={"/seller/create-product"}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] hover:brightness-110 text-[#0b0c10] font-semibold text-[11px] tracking-wider uppercase shadow-[0_4px_18px_rgba(229,169,60,0.3)] hover:shadow-[0_6px_26px_rgba(229,169,60,0.45)] transition-all duration-200 group"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Product</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          PAGE BODY
          ════════════════════════════════════ */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-7 sm:py-10">

        {/* Page heading */}
        <div className="mb-8">
          <span className="inline-block mb-2 text-[10px] font-semibold tracking-[0.25em] uppercase text-[#fabc4d]/75 bg-[#fabc4d]/10 px-2.5 py-1 rounded-full border border-[#fabc4d]/20">
            Seller Hub
          </span>
          <h1
            className="text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl text-white font-semibold tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            My Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-[#d4c4b0]/55 font-light leading-relaxed">
            Manage and track your entire product catalogue in one place.
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Products"
            value={totalProducts}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <StatCard
            label="Catalogue Value"
            value={`₹${totalValue.toLocaleString('en-IN')}`}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Total Photos"
            value={totalImages}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* ── Product Grid / Empty ── */}
        {totalProducts === 0 ? (
          <EmptyState />
        ) : (
          <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sellerProduct.map(product => (
            <Link to={`/seller/product/${product._id}`}>
              <ProductCard key={product._id} product={product} />
            </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-[10px] tracking-widest text-[#d4c4b0]/25 uppercase">
          Snitch Privé Atelier &bull; Seller Partner Suite &bull; Curated Haute Tailoring
        </div>
      </div>
    </div>
  )
}

export default Dashboard