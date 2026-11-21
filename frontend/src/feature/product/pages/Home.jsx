
import React, { useState, useEffect } from 'react'
import { useProduct } from '../hook/useProduct'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'

/* ─── Currency symbol map ───────────────────────────────── */
const CURRENCY_SYMBOL = { INR: '₹', USD: '$', GBP: '£', EUR: '€', AED: 'د.إ' }

/* ─── Product Card ──────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [imgIdx, setImgIdx] = useState(0)
  const symbol = CURRENCY_SYMBOL[product.price?.currency] ?? product.price?.currency ?? ''
  const hasImages = product.images?.length > 0  

  const user = useSelector(state=>state.auth.user)
  console.log(user.role)

  return (
    <div className="group relative bg-[#131317] border border-[#e5a93c]/18 rounded-2xl overflow-hidden shadow-[0_8px_36px_-10px_rgba(0,0,0,0.65)] hover:border-[#fabc4d]/45 hover:shadow-[0_14px_44px_-10px_rgba(229,169,60,0.2)] transition-all duration-300 flex flex-col">
      <Link 
      to={user.role === 'buyyer' ?  `/product/details/${product._id}` : `/seller/product/${product._id}`} className="flex flex-col flex-1" >
        {/* Top shimmer */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/25 to-transparent z-10" />

        {/* Image area */}
        <div className="relative aspect-[3/4] bg-[#0b0c10] overflow-hidden flex-shrink-0">
          {hasImages ? (
            <>
              <img
                src={product.images[imgIdx]?.url}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Thumbnail dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex gap-1.5 justify-center z-20">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={(e) => {
                        e.preventDefault()
                        setImgIdx(i)
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        setImgIdx(i)
                      }}
                      className={`rounded-full transition-all duration-200 ${i === imgIdx
                          ? 'w-5 h-1.5 bg-[#ffd700]'
                          : 'w-1.5 h-1.5 bg-[#ffffff]/40 hover:bg-[#fabc4d]/70'
                        }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#d4c4b0]/20 gap-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] tracking-widest uppercase">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <h3
            className="text-sm font-semibold text-[#e4e1e7] leading-snug line-clamp-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.title}
          </h3>

          {product.description && (
            <p className="text-[11px] text-[#d4c4b0]/50 leading-relaxed line-clamp-2 flex-1">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#e5a93c]/10">
            <span className="text-sm font-bold text-[#fabc4d]">
              {symbol}{Number(product.price?.amount).toLocaleString('en-IN')}
              <span className="text-[9px] font-normal text-[#d4c4b0]/35 ml-1 tracking-wider">{product.price?.currency}</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#0b0c10] bg-gradient-to-r from-[#ffd700] to-[#e5a93c] px-3 py-1.5 rounded-lg hover:brightness-110 transition-all duration-200 shadow-[0_2px_10px_rgba(229,169,60,0.3)] inline-block">
              View
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

/* ─── Skeleton loader card ──────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-[#131317] border border-[#e5a93c]/10 rounded-2xl overflow-hidden animate-pulse flex flex-col">
    <div className="aspect-[3/4] bg-[#1a1c22]" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-3.5 bg-[#1a1c22] rounded-full w-3/4" />
      <div className="h-2.5 bg-[#1a1c22] rounded-full w-full" />
      <div className="h-2.5 bg-[#1a1c22] rounded-full w-2/3" />
      <div className="h-8 bg-[#1a1c22] rounded-lg mt-1" />
    </div>
  </div>
)

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 gap-5 text-center">
    <div className="w-20 h-20 rounded-2xl border border-[#e5a93c]/20 bg-[#131317] flex items-center justify-center text-[#fabc4d]/30">
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
    <div>
      <h3 className="text-base font-semibold text-[#e4e1e7] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        No products available
      </h3>
      <p className="text-sm text-[#d4c4b0]/40 max-w-xs leading-relaxed">
        The catalogue is currently empty. Check back soon.
      </p>
    </div>
  </div>
)

/* ═══════════════════════════════════════════════════════
   Home
   ═══════════════════════════════════════════════════════ */
const Home = () => {
  const user = useSelector(state => state.auth.user)
  const product = useSelector(state => state.products.product)
  const { handleGetAllProduct } = useProduct()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchProducts = async () => {
      try {
        await handleGetAllProduct()
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProducts()
    return () => {
      isMounted = false
    }
  }, [])

  const products = Array.isArray(product) ? product : product ? [product] : []

  return (
    <div
      className="min-h-screen w-full bg-[#0b0c10] text-[#e4e1e7] flex flex-col selection:bg-[#fabc4d]/20 selection:text-[#ffd700] antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Ambient Glow ── */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_15%_15%,rgba(229,169,60,0.07),transparent_65%)] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_85%_85%,rgba(250,188,77,0.05),transparent_65%)] pointer-events-none -z-10" />

      {/* ════════════════════════════════════
          NAVBAR
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
          </div>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6 text-[11px] tracking-widest uppercase font-semibold text-[#d4c4b0]/50">
            <a href="#catalogue" className="hover:text-[#fabc4d] transition-colors duration-200">Catalogue</a>
          </nav>

          {/* Auth actions */}
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
                  <span className="text-xs font-medium text-[#e4e1e7] max-w-[140px] truncate">
                    {user.fullName || user.email}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[11px] tracking-wider uppercase font-semibold text-[#d4c4b0]/60 hover:text-[#fabc4d] transition-colors duration-200 hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] text-[#0b0c10] font-semibold text-[11px] tracking-wider uppercase shadow-[0_4px_18px_rgba(229,169,60,0.3)] hover:brightness-110 hover:shadow-[0_6px_26px_rgba(229,169,60,0.45)] transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          HERO
          ════════════════════════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12 sm:pt-20 sm:pb-16 text-center">
        <span className="inline-block mb-4 text-[10px] font-semibold tracking-[0.3em] uppercase text-[#fabc4d]/75 bg-[#fabc4d]/10 px-3 py-1.5 rounded-full border border-[#fabc4d]/20">
          Privé Atelier Collection
        </span>
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Curated for the{' '}
          <span className="bg-gradient-to-r from-[#ffd700] via-[#fabc4d] to-[#e5a93c] bg-clip-text text-transparent">
            Discerning
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[#d4c4b0]/55 max-w-lg mx-auto leading-relaxed font-light">
          Discover handpicked pieces from independent sellers — where craftsmanship meets contemporary style.
        </p>

        {/* Stats strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { label: 'Products', value: products.length },
            { label: 'Sellers', value: '1+' },
            { label: 'Satisfaction', value: '100%' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#fabc4d]">{s.value}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#d4c4b0]/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          CATALOGUE
          ════════════════════════════════════ */}
      <section id="catalogue" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#e5a93c]/25 to-transparent" />
          <h2 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#d4c4b0]/50 flex-shrink-0">
            All Products
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#e5a93c]/25 to-transparent" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            products.map(p => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      </section>

      {/* ════════════════════════════════════
          FOOTER
          ════════════════════════════════════ */}
      <footer className="border-t border-[#e5a93c]/12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
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
            {user ? (
              <>
                <span className="text-[#fabc4d]">{user.fullName || user.email}</span>
                {user.role === 'seller' && (
                  <Link to="/seller/dashboard" className="text-[#d4c4b0]/40 hover:text-[#fabc4d] transition-colors">Dashboard</Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#d4c4b0]/40 hover:text-[#fabc4d] transition-colors">Login</Link>
                <Link to="/register" className="text-[#d4c4b0]/40 hover:text-[#fabc4d] transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home