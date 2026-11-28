import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { useCart } from '../hook/useCart';
import { useNavigate } from 'react-router';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useOrder } from '../../order/hook/useOrder';
import { removeItem } from '../state/cart.slice';
const Cart = () => {
 
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state)=> state.auth.user)
  const navigate = useNavigate()
  const { handleGetCart, handleIncrementCartItem,handleCreateCartOrder,handleVerifyCartOrder,handleDecrementCartItem,handleRemoveProduct } = useCart();
  const [popupMessage, setPopupMessage] = useState('');
  const { error, isLoading, Razorpay } = useRazorpay();

  const { handleCreateOrderr } = useOrder()

    useEffect(() => {
      handleGetCart();
    }, []);


  const handleAddtoIncrement = async ({ productId, variantId }) => {
    try {
      await handleIncrementCartItem({ productId, variantId });
      await handleGetCart();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Stock limit reached';
      setPopupMessage(msg);
    }
  };

  const handleDecrement = async({productId,variantId})=>{

    try{
      await handleDecrementCartItem({productId,variantId})
      await handleGetCart();
  }catch(error){
    const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Select Atleast One..';
      setPopupMessage(msg);
  }
  }

  async function handleCheckOut(){

    const order = await handleCreateCartOrder()
    console.log(order)

   
    const options = {
      key: "rzp_test_U5BGN523I9ce7E",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Snitch",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
   handler: async (response) => {
  try {
    await handleCreateOrderr({
      razorpayOrderId: response.razorpay_order_id,
    })
    
    const isValid = await handleVerifyCartOrder(response)
    if (!isValid) {
      console.error('Payment verification failed')
      return
    }


    navigate(`/order-success?order_id=${response.razorpay_order_id}`)
  } catch (error) {
    console.error('Order create error:', error.response?.data || error.message)
  }
},
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.contact,
      },
      theme: {
        color: "#F37254",
      },
    };
    
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  

  }
 
  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#1b1c1a] font-sans antialiased">
      {/* Simple Popup Message */}
      {popupMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg border border-neutral-200 text-center space-y-4">
            <p className="text-sm font-medium text-neutral-900">{popupMessage}</p>
            <button
              onClick={() => setPopupMessage('')}
              className="px-5 py-2 bg-black text-white text-xs uppercase tracking-wider rounded hover:bg-neutral-800 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-light tracking-tight text-neutral-900">
            Your Shopping Bag
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">
            Review your selected pieces
          </p>
        </div>

        {!cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-300 rounded-lg bg-white/60">
            <p className="text-neutral-500 text-sm">
              Your shopping bag is currently empty.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block px-6 py-2.5 bg-black text-white text-xs uppercase tracking-wider rounded"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {cart?.items.map((item) => {
                const product = item.product || {};
                const variantId = item.variant?._id || item.variant;
                const variantData = product.variants
                const variantPrice = item.variant.price

                // Determine image from variant or product
                const imageUrl =
                  variantData?.images?.[0]?.url || product.images?.[0]?.url;
                const price =
                  item.price?.amount || product.price?.amount || 0;
                const size = variantData?.attributes?.Size;
                const color = variantData?.attributes?.Color || product.color;
                const stock = variantData?.stock ?? product.stock;

                return (
                  <div
                    key={item._id}
                    className="p-6 bg-white rounded-lg border border-neutral-200/70 shadow-sm flex flex-col sm:flex-row gap-6 items-start"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-28 aspect-[4/5] rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between w-full h-full">
                      <div>
                        <div className="flex justify-between items-start">
                          <h2 className="text-lg font-medium text-neutral-900">
                            {product.title}
                          </h2>
                          <span className="text-base font-semibold text-neutral-900">
                            ₹{price}
                          </span>
                        </div>

                        {/* Attributes */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {color && (
                            <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 bg-neutral-100 rounded text-neutral-600">
                              Color: {color}
                            </span>
                          )}
                          {size && (
                            <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 bg-neutral-100 rounded text-neutral-600">
                              Size: {size}
                            </span>
                          )}
                        </div>

                        {stock !== undefined && stock !== null && (
                          <p className="text-[11px] text-gray-700 tracking-wide mt-2">
                            ● In Stock ({stock} available)
                          </p>
                        )}

                       {(() => {
  const currentPrice = Number(price) || 0;
  const comparePrice = Number(
    variantPrice?.amount ?? variantPrice ?? variantData?.price?.amount ?? 0
  );

  if (comparePrice > 0 && currentPrice !== comparePrice) {
    const diff = Math.abs(comparePrice - currentPrice);

    if (currentPrice < comparePrice) {
      return (
        <p className="text-[11px] text-red-600 mt-1">
          Price increased by ₹{diff.toLocaleString()}
        </p>
      );
    }

    return (
      <p className="text-[11px] text-emerald-700 mt-1">
        You can save ₹{diff.toLocaleString()}
      </p>
    );
  }

  return null;
})()}
                      </div>

                      {/* Stepper & Actions */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                        <div className="flex items-center border border-neutral-200 rounded">
                          <button
                          onClick={()=>{
                            handleDecrement({
                              productId:product._id,
                              variantId
                            })
                          }}
                            className="px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleAddtoIncrement({
                                productId: product._id,
                                variantId,
                              })
                            }
                            className="px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-50"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <button className="text-neutral-500 hover:text-black transition">
                            Save for Later
                          </button>
                          <button onClick={()=>{
                            handleRemoveProduct(item)
                          }} className="text-red-600 hover:text-red-700 transition cursor-pointer">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="p-6  bg-white rounded-lg border border-neutral-200/70 shadow-sm space-y-5">
                <h3 className="text-base font-semibold tracking-wide uppercase text-neutral-900">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm text-neutral-600 border-b border-neutral-100 pb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-neutral-900">
                      {cart.totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-medium">
                      Complimentary
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="text-neutral-500">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Privilege / Gift code"
                    className="flex-1 px-3 py-2 text-xs border border-neutral-200 rounded uppercase placeholder:normal-case focus:outline-none focus:border-black"
                  />
                  <button className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 rounded transition">
                    Apply
                  </button>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-base font-semibold text-neutral-900">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-semibold text-neutral-900">
                     {cart.totalPrice}
                    </span>
                    <p className="text-[10px] text-neutral-400">
                      All applicable duties and taxes included
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <button onClick={()=>{
                  handleCheckOut()
                }}  className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-widest font-medium rounded hover:bg-neutral-800 transition shadow-sm">
                  Proceed to Checkout →
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-100 text-center text-[10px] text-neutral-500">
                  <div>Free Express Delivery</div>
                  <div>7-Day Exchange</div>
                  <div>Secure Checkout</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;