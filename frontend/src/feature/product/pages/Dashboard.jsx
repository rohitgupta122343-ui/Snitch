import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import { Link } from 'react-router'

/* ─── Currency symbol map ───────────────────────────────── */
const CURRENCY_SYMBOL = { INR: '₹', USD: '$', GBP: '£', EUR: '€', AED: 'د.إ' }

/* ─── Stat card ─────────────────────────────────────────── */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-[#E8E6DF] rounded-xl p-5 shadow-[0_2px_12px_rgba(26,26,26,0.03)] flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl border border-[#E8E6DF] bg-[#FAF9F5] flex items-center justify-center text-[#B89758] flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#757470]">{label}</p>
      <p className="text-2xl font-bold text-[#1A1A1A] leading-tight mt-0.5">{value}</p>
    </div>
  </div>
)

/* ─── Product card ──────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [imgIdx, setImgIdx] = useState(0)
  const symbol = CURRENCY_SYMBOL[product.price?.currency] ?? product.price?.currency ?? '₹'

  return (
    <div className="group relative bg-white border border-[#E8E6DF] rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(26,26,26,0.03)] hover:border-[#1A1A1A] hover:shadow-[0_12px_32px_rgba(26,26,26,0.08)] transition-all duration-300 flex flex-col">
      {/* Image area: 4/3 aspect ratio */}
      <div className="relative aspect-[4/3] bg-[#F5F4EE] overflow-hidden flex-shrink-0">
        {product.images?.length > 0 ? (
          <>
            <img
              src={product.images[imgIdx]?.url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {imgIdx === 0 && (
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-white/95 backdrop-blur-xs text-[8px] font-bold tracking-wider text-[#1A1A1A] uppercase border border-[#E8E6DF]">
                Cover
              </span>
            )}
            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2.5 inset-x-2 flex gap-1.5 justify-center z-10">
                {product.images.map((img, i) => (
                  <button
                    key={img._id || i}
                    onMouseEnter={(e) => {
                      e.preventDefault()
                      setImgIdx(i)
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      setImgIdx(i)
                    }}
                    className={`w-7 h-7 rounded overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                      i === imgIdx ? 'border-[#1A1A1A] scale-105' : 'border-white/80 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#8C8A85] gap-2">
            <svg className="w-10 h-10 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] tracking-wider uppercase text-[#8C8A85]">No photos</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-1 group-hover:text-[#B89758] transition-colors font-serif">
            {product.title}
          </h3>
          <span className="flex-shrink-0 text-sm font-bold text-[#1A1A1A] whitespace-nowrap">
            {symbol}{Number(product.price?.amount || 0).toLocaleString('en-IN')}
          </span>
        </div>

        {product.description && (
          <p className="text-[12px] text-[#5C5A55] leading-relaxed line-clamp-2 font-light">
            {product.description}
          </p>
        )}

        <div className="border-t border-[#F0EFEB] mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-[#757470]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {product.images?.length ?? 0} photo{product.images?.length !== 1 ? 's' : ''}
          </span>

          <span className="text-[10px] font-mono text-[#8C8A85]" title={product._id}>
            #{product._id?.slice(-6)}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-white border border-[#E8E6DF] rounded-2xl p-8 shadow-xs">
    <div className="w-16 h-16 rounded-full border border-[#C5A880]/30 bg-[#FAF9F5] flex items-center justify-center text-[#B89758]">
      <svg className="w-8 h-8 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1 font-serif">Your Atelier is Empty</h3>
      <p className="text-xs text-[#757470] max-w-sm leading-relaxed font-light">List your inaugural garment piece to begin selling on the Snitch marketplace.</p>
    </div>
    <Link
      to="/seller/create-product"
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#2D2D2D] transition-all shadow-xs"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
      </svg>
      List First Piece
    </Link>
  </div>
)

/* ═══════════════════════════════════════════════════════
   Dashboard Page
   ═══════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct()
  const sellerProduct = useSelector(state => state.products.sellerProduct)

  useEffect(() => {
    handleGetSellerProduct()
  }, [])

  const totalProducts = sellerProduct?.length ?? 0
  const totalValue = (sellerProduct ?? []).reduce((sum, p) => sum + Number(p.price?.amount ?? 0), 0)
  const totalImages = (sellerProduct ?? []).reduce((sum, p) => sum + (p.images?.length ?? 0), 0)

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#1A1A1A] flex flex-col selection:bg-[#EAE4D3] selection:text-[#1A1A1A] antialiased">
      {/* ════════════════════════════════════
          HEADER
          ════════════════════════════════════ */}
      <header className="w-full border-b border-[#E8E6DF] bg-white/90 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 tracking-[0.25em] text-xl sm:text-2xl font-bold text-[#1A1A1A] hover:text-[#B89758] transition-colors"
          >
            <span className="font-serif">SNITCH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
            <span className="hidden md:inline text-[9px] tracking-[0.2em] font-semibold text-[#757470] uppercase ml-1 px-2 py-0.5 border border-[#E8E6DF] rounded bg-[#F5F4EE]">
              Seller Partner
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs uppercase tracking-wider text-[#5C5A55] hover:text-[#1A1A1A] font-semibold hidden sm:inline px-3 py-1.5"
            >
              Catalogue
            </Link>
            <Link
              to="/seller/create-product"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-md bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white font-semibold text-xs tracking-wider uppercase shadow-xs transition-all group"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Piece</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          PAGE BODY
          ════════════════════════════════════ */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">

        {/* Page heading */}
        <div className="mb-8">
          <span className="inline-block mb-2 text-[10px] font-semibold tracking-[0.25em] uppercase text-[#B89758] bg-white px-3 py-1 rounded-full border border-[#C5A880]/30 shadow-xs">
            Seller Hub
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] font-normal tracking-tight font-serif">
            Atelier Management Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5A55] font-light leading-relaxed">
            Manage your bespoke releases, product variants, and studio inventory in one place.
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Pieces Listed"
            value={totalProducts}
            icon={
              <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <StatCard
            label="Catalogue Inventory Value"
            value={`₹${totalValue.toLocaleString('en-IN')}`}
            icon={
              <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Total Lookbook Photos"
            value={totalImages}
            icon={
              <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* ── Product Grid / Empty ── */}
        {totalProducts === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sellerProduct.map((prod) => (
              <Link key={prod._id} to={`/seller/product/${prod._id}`} className="block">
                <ProductCard product={prod} />
              </Link>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-14 text-center text-[10px] tracking-widest text-[#8C8A85] uppercase">
          Snitch Privé Atelier &bull; Seller Partner Suite &bull; Curated Haute Tailoring
        </div>
      </div>
    </div>
  )
}

export default Dashboard
