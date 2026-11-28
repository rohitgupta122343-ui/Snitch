import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ShoppingBag, LayoutDashboard } from 'lucide-react'

const Header = () => {
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  return (
    <header className="w-full border-b border-[#E8E6DF] bg-white/90 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-xs tracking-wider uppercase font-semibold text-[#5C5A55] hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full border border-[#E8E6DF] bg-white flex items-center justify-center group-hover:border-[#1A1A1A] group-hover:bg-[#F5F4EE] transition-all shadow-xs">
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2] group-hover:-translate-x-0.5 transition-transform" />
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
                  <LayoutDashboard className="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>Dashboard</span>
                </Link>
              )}

              <Link
                to="/cart"
                aria-label="Shopping Bag"
                className="group relative w-9 h-9 rounded-full border border-[#E8E6DF] bg-white flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F5F4EE] transition-all shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.75] group-hover:scale-105 transition-transform" />
              </Link>

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
  )
}

export default Header