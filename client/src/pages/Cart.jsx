import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  // ---------------- GET CART ITEMS ----------------
  const getCart = () => {
    const temp = [];

    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) {
        temp.push({
          ...product,
          quantity: cartItems[id],
        });
      }
    }

    setCartArray(temp);
  };

  // ---------------- GET USER ADDRESSES ----------------
  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");

      if (data.success) {
        setAddresses(data.addresses || []);

        if (data.addresses?.length > 0) {
          setSelectedAddress(data.addresses[0]);
        } else {
          setSelectedAddress(null);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      // Place Order with COD
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }else{
        //Place Order with Stripe
         const { data } = await axios.post("/api/order/stripe", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });
        if (data.success) {
         window.location.replace(data.url)
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (products.length > 0) getCart();
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  // ---------------- EMPTY CART ----------------
  if (!cartArray.length) {
    return (
      <div className="text-center mt-20 text-gray-500">Your cart is empty</div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="flex flex-col md:flex-row mt-16 gap-6">
      {/* LEFT */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center pt-4"
          >
            <div className="flex gap-4">
              <div
                onClick={() =>
                  navigate(`/products/${product.category}/${product._id}`)
                }
                className="w-24 h-24 cursor-pointer border rounded overflow-hidden"
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="font-semibold">{product.name}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span>Qty:</span>
                  <select
                    value={cartItems[product._id]}
                    onChange={(e) =>
                      updateCartItem(product._id, Number(e.target.value))
                    }
                    className="border px-2 py-1"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>

            <button onClick={() => removeFromCart(product._id)}>
              <img
                src={assets.remove_icon}
                alt="remove"
                className="w-6 mx-auto"
              />
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 border">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="my-4" />

        {/* ADDRESS */}
        <p className="text-sm font-medium uppercase">Delivery Address</p>

        <div className="relative mt-2">
          <p className="text-gray-500">
            {selectedAddress
              ? `${selectedAddress.street}, ${selectedAddress.city}`
              : "Please add an address"}
          </p>

          <button
            onClick={() => setShowAddress(!showAddress)}
            className="text-primary text-sm"
          >
            Change
          </button>

          {showAddress && (
            <div className="absolute bg-white border w-full mt-2 z-10">
              {addresses.map((addr) => (
                <p
                  key={addr._id}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddress(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {addr.street}, {addr.city}
                </p>
              ))}

              <p
                onClick={() => navigate("/add-address")}
                className="p-2 text-primary text-center cursor-pointer"
              >
                + Add Address
              </p>
            </div>
          )}
        </div>

        {/* PAYMENT */}
        <p className="mt-4 font-medium">Payment Method</p>
        <select
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
          className="w-full border px-3 py-2 mt-2"
        >
          <option value="COD">Cash On Delivery</option>
          <option value="Online">Online Payment</option>
        </select>

        {/* PRICE */}
        <div className="mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>

          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>

          <p className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>
              {currency}
              {(getCartAmount() * 1.02).toFixed(2)}
            </span>
          </p>
        </div>

        <button
         onClick={placeOrder}
          disabled={!selectedAddress}
          className={`w-full mt-6 py-3 text-white ${
            selectedAddress ? "bg-primary" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>

          {/* <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button> */}
      </div>
    </div>
  );
};

export default Cart;
