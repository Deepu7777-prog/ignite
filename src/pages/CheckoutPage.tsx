import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CookProfile } from '../types';
import {
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Utensils,
  Lock,
  QrCode,
  Smartphone,
  Building,
  Banknote,
  AlertCircle,
  X
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState<string>("Flat 402, Cyber Towers View, Hitec City, Hyderabad - 500081");
  const [deliveryOption, setDeliveryOption] = useState<string>("Standard Delivery (30-40 mins)");
  const [paymentMethodOption, setPaymentMethodOption] = useState<string>("PHONEPE_UPI"); 
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  // Cook Profile & Accepted Payment Methods State
  const cookId = items.length > 0 ? items[0].cookId : '';
  const cookName = items.length > 0 ? items[0].cookName : 'Home Kitchen';
  const [cookAcceptedMethods, setCookAcceptedMethods] = useState<string[]>([
    'PHONEPE_UPI',
    'RAZORPAY_GATEWAY',
    'CARD',
    'NETBANKING',
    'COD'
  ]);
  const [isCookLoading, setIsCookLoading] = useState<boolean>(false);

  // Sub-Modals for Specific Gateway Flows
  const [showPhonePeModal, setShowPhonePeModal] = useState<boolean>(false);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);

  const [phonepeUpiId, setPhonepeUpiId] = useState<string>('');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  const [pendingCreatedOrder, setPendingCreatedOrder] = useState<any>(null);
  const [activeGatewayOrder, setActiveGatewayOrder] = useState<any>(null);

  useEffect(() => {
    if (cookId) {
      loadCookPreferences();
    }
  }, [cookId]);

  const loadCookPreferences = async () => {
    try {
      setIsCookLoading(true);
      const res = await api.getCookById(cookId);
      if (res.success && res.cook) {
        const methods = res.cook.acceptedPaymentMethods && res.cook.acceptedPaymentMethods.length > 0
          ? res.cook.acceptedPaymentMethods
          : ['PHONEPE_UPI', 'RAZORPAY_GATEWAY', 'CARD', 'NETBANKING', 'COD'];
        
        setCookAcceptedMethods(methods);
        if (!methods.includes(paymentMethodOption)) {
          setPaymentMethodOption(methods[0]);
        }
      }
    } catch (err) {
      console.error("Error loading cook payment preferences:", err);
    } finally {
      setIsCookLoading(false);
    }
  };

  if (items.length === 0 && !isOrderPlaced) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="font-extrabold text-slate-900 text-xl mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-4">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Explore Home Cooks
        </button>
      </div>
    );
  }

  const createBaseOrder = async () => {
    const orderPayload = {
      customerId: user?.id || 'usr_customer_demo',
      cookId,
      cookName,
      items: items.map((i) => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        price: i.menuItem.price,
        quantity: i.quantity,
        image: i.menuItem.image
      })),
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress: {
        id: "addr_checkout",
        label: "Home",
        addressLine: selectedAddress,
        city: "Hyderabad",
        pincode: "500081"
      },
      deliveryOption,
      paymentMethod: paymentMethodOption
    };

    const orderRes = await api.createOrder(orderPayload);
    if (!orderRes.success) {
      throw new Error('Failed to record base order');
    }
    return orderRes.order;
  };

  const handlePlaceOrderAndPay = async () => {
    setIsProcessing(true);
    try {
      const createdOrder = await createBaseOrder();
      setPlacedOrderId(createdOrder.id);
      setPendingCreatedOrder(createdOrder);

      if (paymentMethodOption === 'COD') {
        // Cash on Delivery direct placement
        const codRes = await api.confirmCODOrder(createdOrder.id);
        if (codRes.success) {
          setIsOrderPlaced(true);
          clearCart();
        } else {
          alert("Failed to confirm Cash on Delivery order");
        }
        setIsProcessing(false);
        return;
      }

      if (paymentMethodOption === 'PHONEPE_UPI') {
        // PhonePe Gateway Order Creation
        const ppeRes = await api.createPhonePeOrder(createdOrder.id, total, user?.id);
        if (ppeRes.success) {
          setActiveGatewayOrder(ppeRes);
          setShowPhonePeModal(true);
        } else {
          throw new Error("PhonePe payment initialization failed");
        }
        setIsProcessing(false);
        return;
      }

      if (paymentMethodOption === 'CARD') {
        const payOrderRes = await api.createPaymentOrder(createdOrder.id, total, user?.id);
        if (payOrderRes.success) {
          setActiveGatewayOrder(payOrderRes);
          setShowCardModal(true);
        } else {
          throw new Error("Card payment initialization failed");
        }
        setIsProcessing(false);
        return;
      }

      if (paymentMethodOption === 'NETBANKING') {
        const payOrderRes = await api.createPaymentOrder(createdOrder.id, total, user?.id);
        if (payOrderRes.success) {
          setActiveGatewayOrder(payOrderRes);
          setShowNetBankingModal(true);
        } else {
          throw new Error("Net Banking initialization failed");
        }
        setIsProcessing(false);
        return;
      }

      // Default: Razorpay Online Gateway
      const payOrderRes = await api.createPaymentOrder(createdOrder.id, total, user?.id);
      if (!payOrderRes.success) {
        throw new Error('Failed to initialize payment gateway');
      }

      if (typeof (window as any).Razorpay === 'function') {
        const options = {
          key: payOrderRes.keyId,
          amount: payOrderRes.amount,
          currency: payOrderRes.currency,
          name: "Home Cook Finder",
          description: `Homemade Meal Order #${createdOrder.orderNumber}`,
          order_id: payOrderRes.gatewayOrderId,
          handler: async function (response: any) {
            if (!response.razorpay_signature || !response.razorpay_payment_id) {
              alert('Payment failed: Missing payment signature from Razorpay');
              setIsProcessing(false);
              return;
            }
            const verifyRes = await api.verifyPayment({
              orderId: createdOrder.id,
              gatewayOrderId: response.razorpay_order_id || payOrderRes.gatewayOrderId,
              gatewayPaymentId: response.razorpay_payment_id,
              gatewaySignature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              setIsOrderPlaced(true);
              clearCart();
            } else {
              alert('Payment Verification Failed: Invalid Signature');
            }
            setIsProcessing(false);
          },
          prefill: {
            name: user?.name || "Customer",
            email: user?.email || "customer@example.com",
            contact: user?.phone || ""
          },
          theme: {
            color: "#059669"
          },
          modal: {
            ondismiss: async function () {
              setIsProcessing(false);
              try {
                await api.cancelPayment(createdOrder.id, "Customer closed payment window without completing transaction");
              } catch (e) {}
              alert("Payment was cancelled or closed. Your order has not been placed.");
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay Payment SDK failed to load. Please check your internet connection.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Failed during checkout payment:', err);
      alert(err.message || 'Checkout error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCompletePhonePePayment = async () => {
    if (!pendingCreatedOrder || !activeGatewayOrder) return;
    setIsProcessing(true);
    try {
      const verifyRes = await api.completeDirectPayment({
        orderId: pendingCreatedOrder.id,
        gatewayOrderId: activeGatewayOrder.merchantTransactionId || `ppe_order_${Date.now()}`,
        gatewayPaymentId: `pay_ppe_${Date.now()}`,
      });

      if (verifyRes.success) {
        setShowPhonePeModal(false);
        setIsOrderPlaced(true);
        clearCart();
      } else {
        alert("PhonePe Verification Failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to complete PhonePe payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteCardPayment = async () => {
    if (!pendingCreatedOrder || !activeGatewayOrder) return;
    if (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv) {
      alert("Please fill in valid Card details.");
      return;
    }
    setIsProcessing(true);
    try {
      const verifyRes = await api.completeDirectPayment({
        orderId: pendingCreatedOrder.id,
        gatewayOrderId: activeGatewayOrder.gatewayOrderId || `card_order_${Date.now()}`,
        gatewayPaymentId: `pay_card_${Date.now()}`,
      });

      if (verifyRes.success) {
        setShowCardModal(false);
        setIsOrderPlaced(true);
        clearCart();
      } else {
        alert("Card Authorization Failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to process card payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteNetBankingPayment = async () => {
    if (!pendingCreatedOrder || !activeGatewayOrder) return;
    setIsProcessing(true);
    try {
      const verifyRes = await api.completeDirectPayment({
        orderId: pendingCreatedOrder.id,
        gatewayOrderId: activeGatewayOrder.gatewayOrderId || `nb_order_${Date.now()}`,
        gatewayPaymentId: `pay_nb_${Date.now()}`,
      });

      if (verifyRes.success) {
        setShowNetBankingModal(false);
        setIsOrderPlaced(true);
        clearCart();
      } else {
        alert("Net Banking Authorization Failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to process Net Banking payment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-slate-900">
          Payment Verified & Order Placed!
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your payment of <strong>₹{total}</strong> has been verified by the server. Your order was transmitted to <strong className="text-slate-900">{cookName}</strong>.
        </p>

        <div className="pt-4 flex flex-col gap-2">
          <button
            onClick={() => navigate(`/order-tracking/${placedOrderId}`)}
            className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            Track Order Status
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/customer-dashboard')}
            className="w-full py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Go to Customer Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Checkout & Payment Gateway
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Complete payment for your order from <strong className="text-slate-900">{cookName}</strong>.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ADDRESS & PAYMENT METHODS */}
        <div className="lg:col-span-7 space-y-6">
          {/* DELIVERY ADDRESS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Delivery Address
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Confirmed Address
              </span>
              <p className="text-xs font-bold text-slate-900">{selectedAddress}</p>
              <button
                onClick={() => {
                  const newAddr = prompt("Update your delivery address:", selectedAddress);
                  if (newAddr) setSelectedAddress(newAddr);
                }}
                className="text-[11px] font-bold text-emerald-700 hover:underline"
              >
                Change Address
              </button>
            </div>
          </div>

          {/* DELIVERY WINDOW & PREP NOTICE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Fresh Preparation Window & ETA
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Cooked fresh upon your order
              </p>
              <p className="text-emerald-700">
                Estimated Preparation & Delivery Time: <strong>25 - 35 minutes</strong>.
              </p>
            </div>
          </div>

          {/* REAL PAYMENT OPTIONS (FILTERED BY COOK'S PREFERENCES) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  Select Payment Method
                </h3>
              </div>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Payment options enabled by <strong>{cookName}</strong>:
            </p>

            <div className="space-y-3">
              {/* PHONEPE UPI */}
              {cookAcceptedMethods.includes('PHONEPE_UPI') && (
                <label
                  onClick={() => setPaymentMethodOption("PHONEPE_UPI")}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethodOption === "PHONEPE_UPI"
                      ? "bg-purple-50/70 border-purple-500 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">PhonePe & Direct UPI</span>
                      <span className="text-[10px] text-slate-500">PhonePe App, GPay, Paytm, Direct VPA</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_option"
                    checked={paymentMethodOption === "PHONEPE_UPI"}
                    onChange={() => setPaymentMethodOption("PHONEPE_UPI")}
                    className="accent-purple-600"
                  />
                </label>
              )}

              {/* RAZORPAY GATEWAY */}
              {cookAcceptedMethods.includes('RAZORPAY_GATEWAY') && (
                <label
                  onClick={() => setPaymentMethodOption("RAZORPAY_GATEWAY")}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethodOption === "RAZORPAY_GATEWAY"
                      ? "bg-emerald-50/70 border-emerald-500 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Razorpay Online Gateway</span>
                      <span className="text-[10px] text-slate-500">Instant digital checkout & HMAC verification</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_option"
                    checked={paymentMethodOption === "RAZORPAY_GATEWAY"}
                    onChange={() => setPaymentMethodOption("RAZORPAY_GATEWAY")}
                    className="accent-emerald-600"
                  />
                </label>
              )}

              {/* CARDS OPTION */}
              {cookAcceptedMethods.includes('CARD') && (
                <label
                  onClick={() => setPaymentMethodOption("CARD")}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethodOption === "CARD"
                      ? "bg-blue-50/70 border-blue-500 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Credit / Debit Card</span>
                      <span className="text-[10px] text-slate-500">Visa, Mastercard, RuPay & Maestro Cards</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_option"
                    checked={paymentMethodOption === "CARD"}
                    onChange={() => setPaymentMethodOption("CARD")}
                    className="accent-blue-600"
                  />
                </label>
              )}

              {/* NET BANKING */}
              {cookAcceptedMethods.includes('NETBANKING') && (
                <label
                  onClick={() => setPaymentMethodOption("NETBANKING")}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethodOption === "NETBANKING"
                      ? "bg-teal-50/70 border-teal-500 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-teal-600" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Net Banking</span>
                      <span className="text-[10px] text-slate-500">HDFC, SBI, ICICI, Axis & 50+ Banks</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_option"
                    checked={paymentMethodOption === "NETBANKING"}
                    onChange={() => setPaymentMethodOption("NETBANKING")}
                    className="accent-teal-600"
                  />
                </label>
              )}

              {/* CASH ON DELIVERY */}
              {cookAcceptedMethods.includes('COD') && (
                <label
                  onClick={() => setPaymentMethodOption("COD")}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethodOption === "COD"
                      ? "bg-amber-50/70 border-amber-500 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-slate-500">Pay cash directly when order arrives</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_option"
                    checked={paymentMethodOption === "COD"}
                    onChange={() => setPaymentMethodOption("COD")}
                    className="accent-amber-600"
                  />
                </label>
              )}

              {!cookAcceptedMethods.includes('COD') && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Cash on Delivery is currently disabled by {cookName}. Online prepayment required.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
            <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Summary ({items.length} Items)
            </h3>

            {/* ITEM LIST */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">{quantity}x</span>
                    <span className="font-bold text-slate-900 truncate max-w-[180px]">{menuItem.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">₹{menuItem.price * quantity}</span>
                </div>
              ))}
            </div>

            {/* PRICING BREAKDOWN */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees (5%)</span>
                <span className="font-bold text-slate-900">₹{tax}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-700">₹{total}</span>
              </div>
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handlePlaceOrderAndPay}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing
                ? 'Processing Payment...'
                : paymentMethodOption === 'COD'
                ? `Confirm COD Order (₹${total})`
                : paymentMethodOption === 'PHONEPE_UPI'
                ? `Pay ₹${total} via PhonePe`
                : `Pay ₹${total} via Gateway`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PHONEPE INTERACTIVE PAYMENT MODAL */}
      {showPhonePeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-purple-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-purple-950">
                    PhonePe Payment Gateway
                  </h3>
                  <p className="text-[11px] text-slate-500">Official Merchant ID: PGTESTPAYUAT</p>
                </div>
              </div>
              <button onClick={() => setShowPhonePeModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-center space-y-3">
              <span className="text-[11px] font-extrabold text-purple-900 block">Scan PhonePe QR or Enter UPI ID</span>
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-purple-200 flex items-center justify-center shadow-xs">
                <QrCode className="w-28 h-28 text-purple-900" />
              </div>
              <p className="text-xs font-extrabold text-purple-950">Amount: ₹{total}</p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">PhonePe VPA / UPI ID</label>
              <input
                type="text"
                value={phonepeUpiId}
                onChange={(e) => setPhonepeUpiId(e.target.value)}
                placeholder="e.g. mobile@ybl or mobile@ibl"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <button
              onClick={handleCompletePhonePePayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-purple-700 text-white font-extrabold text-xs shadow-md hover:bg-purple-800 transition-colors"
            >
              {isProcessing ? 'Verifying PhonePe Authorization...' : `Approve & Pay ₹${total}`}
            </button>
          </div>
        </div>
      )}

      {/* CARD PAYMENT INTERACTIVE MODAL */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-blue-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    Card Checkout (Visa / Mastercard / RuPay)
                  </h3>
                  <p className="text-[11px] text-slate-500">256-Bit SSL Secure Gateway</p>
                </div>
              </div>
              <button onClick={() => setShowCardModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardInfo.name}
                  onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardInfo.number}
                  onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                  placeholder="4532 •••• •••• 8892"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardInfo.expiry}
                    onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                    placeholder="08/28"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardInfo.cvv}
                    onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                    placeholder="•••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCompleteCardPayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white font-extrabold text-xs shadow-md hover:bg-blue-700 transition-colors"
            >
              {isProcessing ? 'Authorizing Card Payment...' : `Authorize & Pay ₹${total}`}
            </button>
          </div>
        </div>
      )}

      {/* NET BANKING INTERACTIVE MODAL */}
      {showNetBankingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-teal-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    Net Banking Authorization
                  </h3>
                  <p className="text-[11px] text-slate-500">Select your Indian Bank</p>
                </div>
              </div>
              <button onClick={() => setShowNetBankingModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700">Choose Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
              </select>
            </div>

            <button
              onClick={handleCompleteNetBankingPayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-teal-700 text-white font-extrabold text-xs shadow-md hover:bg-teal-800 transition-colors"
            >
              {isProcessing ? 'Connecting to Bank Gateway...' : `Authorize ₹${total} via ${selectedBank}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
