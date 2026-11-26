import React, { useState, useEffect, useMemo } from 'react'
import { useProduct } from '../hook/useProduct'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'

/* ─── Currency symbol map ───────────────────────────────── */
const CURRENCY_SYMBOL = { INR: '₹', USD: '$', GBP: '£', EUR: '€', AED: 'د.إ' }

/* ─── Product Card ──────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [imgIdx, setImgIdx] = useState(0)
  const symbol = CURRENCY_SYMBOL[product.price?.currency] ?? product.price?.currency ?? '₹'
  const hasImages = product.images?.length > 0

  const user = useSelector(state => state.auth?.user)
  const detailUrl = user?.role === 'buyyer' || !user
    ? `/product/details/${product._id}`
    : `/seller/product/${product._id}`

  return (
    <div className="group relative bg-white border border-[#E8E6DF] rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(26,26,26,0.04)] hover:shadow-[0_12px_32px_rgba(26,26,26,0.08)] hover:border-[#C5A880]/60 transition-all duration-300 flex flex-col">
      <Link to={detailUrl} className="flex flex-col flex-1">
        {/* Top subtle highlight */}
        <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Image area: 3/4 portrait ratio */}
        <div className="relative aspect-[3/4] bg-[#F5F4EE] overflow-hidden flex-shrink-0">
          {hasImages ? (
            <>
              <img
                src={product.images[imgIdx]?.url}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Soft overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Tag badge */}
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-white/90 backdrop-blur-sm border border-[#E8E6DF] text-[9px] font-medium tracking-wider uppercase text-[#1A1A1A]">
                Atelier
              </span>

              {/* Thumbnail dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2.5 inset-x-0 flex gap-1.5 justify-center z-20">
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
                      className={`rounded-full transition-all duration-200 ${
                        i === imgIdx
                          ? 'w-4 h-1.5 bg-[#1A1A1A]'
                          : 'w-1.5 h-1.5 bg-black/25 hover:bg-black/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8C8A85] gap-2 p-4">
              <svg className="w-10 h-10 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] tracking-widest uppercase text-[#8C8A85]">Photographing</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {product.color && (
            <span className="text-[10px] font-medium tracking-widest uppercase text-[#8C8A85]">
              {product.color}
            </span>
          )}

          <h3
            className="text-[14px] font-medium text-[#1A1A1A] leading-snug line-clamp-1 group-hover:text-[#B89758] transition-colors font-serif"
          >
            {product.title}
          </h3>

          {product.description && (
            <p className="text-[12px] text-[#6E6C68] leading-relaxed line-clamp-2 font-light">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F0EFEB]">
            <span className="text-sm font-semibold text-[#1A1A1A]">
              {symbol}{Number(product.price?.amount || 0).toLocaleString('en-IN')}
              <span className="text-[10px] font-normal text-[#8C8A85] ml-1 tracking-wider uppercase">
                {product.price?.currency || 'INR'}
              </span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1A1A1A] group-hover:text-white bg-[#F5F4EE] group-hover:bg-[#1A1A1A] px-3 py-1.5 rounded transition-all duration-200">
              View Piece
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

/* ─── Skeleton loader card ──────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-[#E8E6DF] rounded-xl overflow-hidden animate-pulse flex flex-col">
    <div className="aspect-[3/4] bg-[#F5F4EE]" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-[#EAE8E2] rounded w-3/4" />
      <div className="h-3 bg-[#EAE8E2] rounded w-full" />
      <div className="h-3 bg-[#EAE8E2] rounded w-2/3" />
      <div className="h-7 bg-[#EAE8E2] rounded mt-2" />
    </div>
  </div>
)

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = ({ message = 'The catalogue is currently empty. Check back soon for new drops.' }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center bg-white border border-[#E8E6DF] rounded-2xl p-8 shadow-[0_2px_12px_rgba(26,26,26,0.03)]">
    <div className="w-16 h-16 rounded-full border border-[#C5A880]/30 bg-[#FAF9F5] flex items-center justify-center text-[#B89758]">
      <svg className="w-7 h-7 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1 font-serif">
        No Products Found
      </h3>
      <p className="text-xs text-[#757470] max-w-sm leading-relaxed font-light">
        {message}
      </p>
    </div>
  </div>
)

/* ═══════════════════════════════════════════════════════
   Home / Catalogue Page
   ═══════════════════════════════════════════════════════ */
const Home = () => {
  const user = useSelector(state => state.auth?.user)
  const product = useSelector(state => state.products?.product)
  const { handleGetAllProduct } = useProduct()
  const [loading, setLoading] = useState(true)

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured') // featured, low-to-high, high-to-low, newest

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

  const rawProducts = Array.isArray(product) ? product : product ? [product] : []

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return rawProducts
      .filter(p => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.color?.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        const priceA = Number(a.price?.amount || 0)
        const priceB = Number(b.price?.amount || 0)
        if (sortBy === 'low-to-high') return priceA - priceB
        if (sortBy === 'high-to-low') return priceB - priceA
        if (sortBy === 'newest') return (b._id || '').localeCompare(a._id || '')
        return 0 // featured: default order
      })
  }, [rawProducts, searchQuery, sortBy])

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#1A1A1A] flex flex-col selection:bg-[#EAE4D3] selection:text-[#1A1A1A] antialiased">
      {/* ════════════════════════════════════
          NAVBAR
          ════════════════════════════════════ */}
     

      {/* ════════════════════════════════════
          EDITORIAL HERO SECTION
          ════════════════════════════════════ */}
      <section className="relative w-full border-b border-[#E8E6DF] bg-gradient-to-b from-[#FAF9F5] to-[#F5F4EE] pt-16 pb-16 sm:pt-24 sm:pb-20 overflow-hidden">
        {/* Subtle decorative background ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#E8E6DF]/60 pointer-events-none -z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1 rounded-full border border-[#C5A880]/40 bg-white/80 backdrop-blur-xs text-[10px] font-semibold tracking-[0.25em] uppercase text-[#B89758]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
            Collection N° 08 • Spring / Summer Atelier
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1A1A1A] tracking-tight leading-[1.12] mb-6 max-w-3xl font-serif"
          >
            Curated for the{' '}
            <span className="italic font-serif text-[#B89758]">Discerning</span>,{' '}
            Tailored for the Modern Age
          </h1>

          <p className="text-sm sm:text-base text-[#5C5A55] max-w-xl mx-auto leading-relaxed font-light mb-8">
            Discover handpicked menswear and contemporary unisex silhouettes where artisanal European fabrics meet timeless architectural tailoring.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <a
              href="#catalogue"
              className="px-7 py-3 rounded-md bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow"
            >
              Explore Catalogue
            </a>
            <a
              href="#story"
              className="px-6 py-3 rounded-md bg-white border border-[#E8E6DF] text-[#1A1A1A] hover:bg-[#F5F4EE] text-xs font-semibold tracking-wider uppercase transition-all shadow-xs"
            >
              The Atelier Story
            </a>
          </div>

          {/* Editorial Stats Bar */}
          <div className="w-full max-w-2xl grid grid-cols-3 divide-x divide-[#E8E6DF] border-y border-[#E8E6DF] py-4 bg-white/60 backdrop-blur-xs rounded-xl shadow-[0_2px_10px_rgba(26,26,26,0.02)]">
            <div className="text-center px-2">
              <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] font-serif">
                {rawProducts.length}
              </p>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#757470] mt-0.5">Curated Pieces</p>
            </div>
            <div className="text-center px-2">
              <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] font-serif">
                100%
              </p>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#757470] mt-0.5">Natural Fibers</p>
            </div>
            <div className="text-center px-2">
              <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] font-serif">
                Biella & Lyon
              </p>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#757470] mt-0.5">Fabric Heritage</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CATALOGUE & FILTERS SECTION
          ════════════════════════════════════ */}
      <section id="catalogue" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E6DF]">

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8A85]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or color..."
              className="w-full bg-white border border-[#E8E6DF] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#8C8A85] focus:outline-none focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758]/20 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C8A85] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs text-[#757470] font-light">
              Showing <strong className="font-semibold text-[#1A1A1A]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sortSelect" className="text-[10px] tracking-wider uppercase text-[#757470] font-semibold hidden sm:inline">
                Sort:
              </label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E8E6DF] rounded-lg px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#B89758] shadow-xs cursor-pointer"
              >
                <option value="featured">Featured Drop</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProducts.length === 0 ? (
            <EmptyState message={searchQuery ? `No pieces found matching "${searchQuery}". Clear your search to view all items.` : undefined} />
          ) : (
            filteredProducts.map(p => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      </section>

      {/* ════════════════════════════════════
          EDITORIAL STORY & ATELIER HERITAGE
          ════════════════════════════════════ */}
      <section id="story" className="w-full border-t border-[#E8E6DF] bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#B89758]">
                Artisanal Integrity
              </span>
              <h2
                className="text-2xl sm:text-4xl font-normal text-[#1A1A1A] leading-tight font-serif"
              >
                The Architecture of Modern Menswear & Unlined Tailoring
              </h2>
              <p className="text-sm text-[#5C5A55] leading-relaxed font-light">
                Every piece in our marketplace is created by select independent designers and master ateliers. We eschew synthetic polyester blends and fast-fashion seasonal turnover in favor of Mongolian cashmere, Australian extra-fine merino, and Belgian flax linen.
              </p>
              <div className="pt-2 flex items-center gap-6 text-xs text-[#1A1A1A] font-medium tracking-wide">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
                  Zero Mass Production
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
                  Bespoke Crafting
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl bg-[#F5F4EE] border border-[#E8E6DF] p-8 sm:p-10 space-y-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] uppercase tracking-wider text-xs">
                Private Concierge & Salon Fitting
              </h3>
              <p className="text-xs text-[#5C5A55] leading-relaxed font-light">
                Need tailored advice on sizes, custom colorways, or bulk atelier commissions? Our personal shopping concierge is available for digital consultation.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#2D2D2D] transition-colors shadow-xs"
                >
                  Join Snitch Privé
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          EDITORIAL FOOTER
          ════════════════════════════════════ */}
      <footer className="border-t border-[#E8E6DF] bg-[#FAF9F5] py-12 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-1">
              <div
                className="text-lg font-bold tracking-[0.25em] text-[#1A1A1A] flex items-center gap-2 font-serif"
              >
                SNITCH
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]" />
              </div>
              <p className="text-xs text-[#757470] leading-relaxed font-light">
                Curated Haute Tailoring & Contemporary Ready-to-Wear Atelier.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#1A1A1A]">
                Atelier
              </h4>
              <ul className="space-y-1.5 text-xs text-[#5C5A55] font-light">
                <li><a href="#catalogue" className="hover:text-[#1A1A1A] transition-colors">Spring / Summer Drop</a></li>
                <li><a href="#catalogue" className="hover:text-[#1A1A1A] transition-colors">Tailored Suiting</a></li>
                <li><a href="#catalogue" className="hover:text-[#1A1A1A] transition-colors">Knitwear & Cashmere</a></li>
                <li><a href="#catalogue" className="hover:text-[#1A1A1A] transition-colors">Archival Releases</a></li>
              </ul>
            </div>

            {/* Col 3: Partners & Services */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#1A1A1A]">
                Seller Partners
              </h4>
              <ul className="space-y-1.5 text-xs text-[#5C5A55] font-light">
                <li><Link to="/seller/dashboard" className="hover:text-[#1A1A1A] transition-colors">Seller Dashboard</Link></li>
                <li><Link to="/seller/create-product" className="hover:text-[#1A1A1A] transition-colors">List New Piece</Link></li>
                <li><Link to="/register" className="hover:text-[#1A1A1A] transition-colors">Apply as Designer</Link></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#1A1A1A]">
                The Gazette
              </h4>
              <p className="text-xs text-[#757470] font-light leading-relaxed">
                Receive confidential invitations to private atelier drops and runway edits.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="atelier@domain.com"
                  className="bg-white border border-[#E8E6DF] rounded px-3 py-2 text-xs text-[#1A1A1A] placeholder-[#8C8A85] flex-1 focus:outline-none focus:border-[#B89758]"
                />
                <button
                  type="button"
                  className="bg-[#1A1A1A] text-white text-[10px] tracking-wider uppercase font-semibold px-3 py-2 rounded hover:bg-[#2D2D2D] transition-colors"
                >
                  Join
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#E8E6DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C8A85]">
            <p>© {new Date().getFullYear()} SNITCH APPAREL ATELIER. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-[#1A1A1A] transition-colors">Terms of Atelier</a>
              <span>•</span>
              <a href="#concierge" className="hover:text-[#1A1A1A] transition-colors">Concierge</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
