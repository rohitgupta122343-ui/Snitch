import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router'
import {
  CheckCircle2,
  Copy,
  Check,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Home,
  ArrowRight,
  Download,
  Headphones,
  Clock,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { useOrder } from '../hook/useOrder'

const STEPS = [
  { icon: Package, label: 'Order Placed', sub: 'Confirmed', done: true, active: false },
  { icon: Clock, label: 'Processing', sub: 'Being prepared', done: false, active: true },
  { icon: Truck, label: 'Shipped', sub: 'On the way', done: false, active: false },
  { icon: Home, label: 'Delivered', sub: 'At your doorstep', done: false, active: false },
]

const OrderSuccess = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const reduxOrderId = useSelector((state) => state.order.orderId)

  const orderId = params.get('order_id') || reduxOrderId
  const displayId = orderId ? `#${orderId.toUpperCase()}` : '#N/A'

  const [copied, setCopied] = useState(false)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { handleGetOrder } = useOrder()

  const handleCopy = async () => {
    if (!orderId) return
    try {
      await navigator.clipboard.writeText(orderId)
    } catch {
      /* noop */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

 

  useEffect(() => {
    if (!orderId) {
      setError('Order ID not found in URL')
      setLoading(false)
      return
    }

    async function fetchOrder() {
     
        const fetchedOrder = await handleGetOrder({ orderId })
        setOrder(fetchedOrder)
        setLoading(false)
    
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center text-sm text-neutral-500">
        Loading your order details...
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-sm text-red-600 font-medium">{error || 'Order not found'}</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-widest rounded"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const totalAmount = order.totalPrice?.amount ?? 0
  const currencySymbol = order.totalPrice?.currency === 'INR' ? '₹' : `${order.totalPrice?.currency || ''} `

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#1b1c1a] font-sans antialiased">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-14">

        {/* 1. Hero */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-[#B89758] stroke-[1.5]" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.25em] text-[#B89758] font-semibold mb-2">
            Thank you for your purchase
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-[#1A1A1A] mb-3">
            Order Confirmed
          </h1>
          <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
            Your order has been placed successfully. Current status:{' '}
            <span className="font-semibold uppercase text-[#1A1A1A]">{order.status}</span>.
          </p>

          {/* Order ID pill */}
          <div className="mt-6 inline-flex items-center gap-3 bg-white border border-[#E8E6DF] rounded-full px-5 py-2.5 shadow-sm">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium">Order</span>
            <span className="text-sm font-semibold text-[#1A1A1A] tracking-wider">{displayId}</span>
            <button
              onClick={handleCopy}
              className="ml-1 w-7 h-7 rounded-full border border-[#E8E6DF] bg-[#F5F4EE] hover:bg-[#ECEAE0] flex items-center justify-center transition-colors"
              title="Copy order ID"
            >
              {copied
                ? <Check className="w-3.5 h-3.5 stroke-[2] text-emerald-600" />
                : <Copy className="w-3.5 h-3.5 stroke-[1.75] text-neutral-500" />
              }
            </button>
          </div>
        </div>

        {/* 2. Stepper */}
        <div className="bg-white rounded-xl border border-[#E8E6DF] shadow-sm px-6 py-7 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-neutral-400 mb-0.5">Order Date</p>
              <p className="text-base font-semibold text-[#1A1A1A]">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F4EE] border border-[#E8E6DF] rounded-full text-[11px] font-semibold uppercase tracking-wider text-[#5C5A55]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89758] animate-pulse" />
              Free Express Delivery
            </span>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute top-5 left-[12.5%] right-[12.5%] h-[1px] bg-[#E8E6DF]" />
            <div className="hidden sm:block absolute top-5 left-[12.5%] w-[18%] h-[1px] bg-[#1A1A1A]" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className={`flex flex-col items-center text-center gap-2 ${!step.done && !step.active ? 'opacity-40' : ''}`}>
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all
                      ${step.done ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' : ''}
                      ${step.active ? 'bg-white border-[#1A1A1A] text-[#1A1A1A] shadow-sm ring-2 ring-[#1A1A1A]/10' : ''}
                      ${!step.done && !step.active ? 'bg-white border-[#E8E6DF] text-neutral-400' : ''}
                    `}>
                      <Icon className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step.done || step.active ? 'text-[#1A1A1A]' : 'text-neutral-400'}`}>
                        {step.label}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${step.active ? 'text-[#B89758]' : 'text-neutral-400'}`}>
                        {step.sub}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3. Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-[#E8E6DF] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#B89758] stroke-[1.75]" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]">Delivery Address</h2>
              </div>
              <div className="text-sm text-neutral-600 leading-relaxed space-y-0.5">
                <p className="font-semibold text-[#1A1A1A]">Julian Vance</p>
                <p>14 New Bond Street, Suite 402</p>
                <p>Mayfair, London W1S 3PF</p>
                <p>United Kingdom</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-[#E8E6DF] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-[#B89758] stroke-[1.75]" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]">Payment</h2>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-7 rounded border border-[#E8E6DF] bg-[#F5F4EE] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">RZP</span>
                  <span className="text-[#1A1A1A] font-medium">Razorpay</span>
                </div>
                <span className="text-neutral-500 text-xs uppercase font-medium">{order.status}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#F0EEE8] flex items-center justify-between text-[11px] text-neutral-400">
                <span>Razorpay Order ID</span>
                <span className="font-mono text-neutral-500">{order.razorpayOrderId || order._id}</span>
              </div>
            </div>

            {/* Help */}
            <div className="bg-[#F5F4EE] rounded-xl border border-[#E8E6DF] p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-white border border-[#E8E6DF] flex items-center justify-center flex-shrink-0 shadow-sm">
                <Headphones className="w-4 h-4 stroke-[1.75] text-[#1A1A1A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] mb-0.5">Need help?</p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Questions about sizing, delivery, or your order? Our team is available 24/7.
                </p>
                <a href="mailto:support@snitch.com" className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-wider text-[#B89758] hover:underline">
                  Contact Support →
                </a>
              </div>
            </div>
          </div>

          {/* Right — Real Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-[#E8E6DF] shadow-sm p-6 sticky top-24">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] mb-5">Order Summary</h2>

              <div className="space-y-4 pb-4 border-b border-[#F0EEE8]">
                {order.items?.map((item, i) => {
                  const title = item.product?.title || `Product #${String(item.product).slice(-6)}`
                  const imageUrl = item.product?.images?.[0]?.url || item.product?.images?.[0]
                  const itemAmount = item.price?.amount ?? 0
                  const itemCurrency = item.price?.currency === 'INR' ? '₹' : `${item.price?.currency || ''} `

                  return (
                    <div key={item._id || i} className="flex items-start gap-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-12 h-14 rounded object-cover bg-[#F5F4EE] border border-[#E8E6DF] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-14 rounded bg-[#F5F4EE] border border-[#E8E6DF] flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A1A1A] truncate">{title}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Qty {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#1A1A1A] flex-shrink-0">
                        {itemCurrency}{itemAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2.5 pt-4 text-sm text-neutral-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1A1A1A] font-medium">
                    {currencySymbol}{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium text-xs uppercase tracking-wide">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes &amp; Duties</span>
                  <span className="text-[#1A1A1A] font-medium">Included</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F0EEE8] flex justify-between items-baseline">
                <span className="text-sm font-semibold text-[#1A1A1A]">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-semibold text-[#1A1A1A]">
                    {currencySymbol}{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#F0EEE8] text-center text-[10px] text-neutral-400 uppercase tracking-wider">
                <span>Free Delivery</span>
                <span>7-Day Return</span>
                <span>Secure Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/orders/${order._id}`}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#2D2D2D] transition-all shadow-sm"
          >
            Track Your Order
            <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#1A1A1A] text-xs font-semibold uppercase tracking-widest rounded border border-[#E8E6DF] hover:bg-[#F5F4EE] transition-all shadow-sm"
          >
            Continue Shopping
          </Link>

          <a
            href="#"
            className="inline-flex items-center gap-1.5 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 hover:text-[#1A1A1A] transition-colors"
          >
            <Download className="w-3.5 h-3.5 stroke-[2]" />
            Download Invoice
          </a>
        </div>

        <p className="text-center text-[11px] text-neutral-400 mt-8 tracking-wide">
          A confirmation has been sent to your registered email address.
        </p>
      </main>
    </div>
  )
}

export default OrderSuccess