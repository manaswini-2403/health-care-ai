import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Medicine() {
  const navigate = useNavigate();

  // Full Expanded Medicines Catalog (PDR Objective 7)
  const medicines = [
    {
      id: 1,
      name: "Paracetamol 650mg",
      price: 50,
      description: "Fever & general body ache reliever",
      image: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
    },
    {
      id: 2,
      name: "Vitamin C Zinc Chewables",
      price: 120,
      description: "Immunity support & cellular protection",
      image: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
    },
    {
      id: 3,
      name: "Cough Relief Syrup",
      price: 90,
      description: "Soothes throat irritation & persistent dry cough",
      image: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
    },
    {
      id: 4,
      name: "Fast-Action Pain Relief Gel",
      price: 150,
      description: "Musculoskeletal alignment & back pain relief",
      image: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
    },
    {
      id: 5,
      name: "Electro-Hydration ORS Oral Salts",
      price: 40,
      description: "Stomach rehydration & mineral balance recovery",
      image: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
    },
    {
      id: 6,
      name: "CardioSprint CoQ10",
      price: 210,
      description: "Heart vital energy & resting cardio support",
      image: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
    }
  ];

  // Core Cart and Checkout States (persisted locally during browsing)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("healthapp_cart");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState("");
  const [ordered, setOrdered] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState(0); // 0: Placed, 1: Dispatched, 2: Out for Delivery
  const [deliveryTimeLeft, setDeliveryTimeLeft] = useState(15); // ETA in mins

  const dispatchTimerRef = useRef(null);
  const transitTimerRef = useRef(null);
  const etaTimerRef = useRef(null);

  // Sync cart state
  useEffect(() => {
    localStorage.setItem("healthapp_cart", JSON.stringify(cart));
  }, [cart]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (dispatchTimerRef.current) clearTimeout(dispatchTimerRef.current);
      if (transitTimerRef.current) clearTimeout(transitTimerRef.current);
      if (etaTimerRef.current) clearInterval(etaTimerRef.current);
    };
  }, []);

  // Filter medicines by search input
  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    med.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add Item or increase quantity
  const addToCart = (item) => {
    setCart(prevCart => {
      const exists = prevCart.find(c => c.id === item.id);
      if (exists) {
        return prevCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Adjust item quantity
  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(c => {
        if (c.id === id) {
          const newQty = c.quantity + delta;
          return newQty <= 0 ? null : { ...c, quantity: newQty };
        }
        return c;
      }).filter(Boolean); // strip out nulls (removed items)
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  // Total cart price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Place Order & Start Simulated Stepper
  const placeOrder = () => {
    if (cart.length === 0) {
      alert("⚠️ Your pharmacy cart is empty!");
      return;
    }

    if (!address.trim()) {
      alert("⚠️ Please enter a delivery address.");
      return;
    }

    setOrdered(true);
    setCart([]); // Clear cart upon checkout
    setDeliveryStep(0);
    setDeliveryTimeLeft(15);

    if (dispatchTimerRef.current) clearTimeout(dispatchTimerRef.current);
    if (transitTimerRef.current) clearTimeout(transitTimerRef.current);
    if (etaTimerRef.current) clearInterval(etaTimerRef.current);

    // Simulated Stepper Timeframe (Objective 7 delivery simulation)
    dispatchTimerRef.current = setTimeout(() => {
      setDeliveryStep(1); // Packed & Dispatched
      setDeliveryTimeLeft(12);

      transitTimerRef.current = setTimeout(() => {
        setDeliveryStep(2); // Out for Delivery
        setDeliveryTimeLeft(7);

        etaTimerRef.current = setInterval(() => {
          setDeliveryTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(etaTimerRef.current);
              return 1;
            }
            return prev - 1;
          });
        }, 8000); // simulated countdown minutes
      }, 5000);
    }, 4000);
  };

  return (
    <div className="pageContainer">
      {/* PHARMACY HERO */}
      <div className="medicineHero">
        <div>
          <h1>💊 Smart E-Pharmacy Store</h1>
          <p>Browse medications, secure cart quantities, and simulate home delivery trackers.</p>
        </div>
      </div>

      {/* SEARCH BAR (Objective 7 search) */}
      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 Search medicines by name or clinical classification (e.g. Fever, Pain, ORS)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* MEDICINE CATALOG GRID */}
      <div className="medicineGrid">
        {filteredMedicines.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "span 3", padding: "30px 0", color: "var(--text-secondary)" }}>
            No medicines matching "{searchQuery}" found in the catalog.
          </p>
        ) : (
          filteredMedicines.map((med) => (
            <div className="medicineCard" key={med.id}>
              <img src={med.image} alt={med.name} />
              <h3>{med.name}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 10px", minHeight: "36px" }}>
                {med.description}
              </p>
              <div className="price">₹ {med.price}</div>
              <button className="addCartBtn" onClick={() => addToCart(med)}>
                🛒 Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {/* SHOPPING CART MODULE */}
      <div className="cartBox">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontWeight: "800" }}>🛒 Your Shopping Cart</h2>
          {cart.length > 0 && (
            <button 
              onClick={clearCart} 
              style={{ background: "none", border: "1px solid var(--neutral-border)", color: "var(--primary-accent)", padding: "6px 12px", fontSize: "13px" }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", margin: "20px 0" }}>No medical items added to cart yet.</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div className="cart-item-row" key={item.id}>
                <div className="cart-item-info">
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <p>₹ {item.price} each</p>
                </div>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span style={{ fontWeight: "700", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <span style={{ fontWeight: "700", marginLeft: "15px", minWidth: "60px", textAlign: "right" }}>
                    ₹ {item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "25px", borderTop: "2px solid var(--neutral-border)", paddingTop: "15px" }}>
              <h3>Total Bill Amount:</h3>
              <h2 style={{ color: "var(--primary-accent)", margin: 0, fontWeight: "800" }}>₹ {total}</h2>
            </div>

            {/* ADDRESS INPUT */}
            <div style={{ marginTop: "25px" }}>
              <label style={{ fontWeight: "700", fontSize: "14px" }}>📍 Enter Courier Delivery Address</label>
              <textarea
                placeholder="House name, Street address, Pincode..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* PLACE ORDER BUTTON */}
            <button 
              className="orderBtn" 
              onClick={placeOrder} 
              style={{ width: "100%", padding: "14px", borderRadius: "14px", fontSize: "16px", marginTop: "20px" }}
            >
              Confirm Checkout & Place Order
            </button>
          </div>
        )}
      </div>

      {/* SIMULATED DELIVERY TRACKER STEPPER */}
      {ordered && (
        <div className="delivery-stepper">
          <div className="delivery-agent-icon">🛵</div>
          <h2 style={{ margin: "0 0 5px", color: "var(--success)" }}>✓ Pharmacy Checkout Completed!</h2>
          <p style={{ margin: "0 0 20px", color: "var(--text-secondary)", fontSize: "14px" }}>
            Tracking your urgent pharmaceutical package in real-time.
          </p>

          <h2 style={{ color: "var(--primary-accent)", margin: "0 0 10px" }}>ETA: {deliveryTimeLeft} Minutes</h2>
          
          <div className="delivery-progress-bg">
            <div 
              className="delivery-progress-bar" 
              style={{ width: deliveryStep === 0 ? "15%" : deliveryStep === 1 ? "50%" : "85%" }}
            />
          </div>

          <div className="delivery-steps">
            <div className={`delivery-step ${deliveryStep >= 0 ? "completed" : "active"}`}>
              <div className="delivery-icon-circle">📝</div>
              <h5>Order Placed</h5>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0 }}>Vitals Verified</p>
            </div>
            
            <div className={`delivery-step ${deliveryStep > 0 ? "completed" : deliveryStep === 0 ? "active" : ""}`}>
              <div className="delivery-icon-circle">📦</div>
              <h5>Dispatched</h5>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0 }}>Courier Picked</p>
            </div>

            <div className={`delivery-step ${deliveryStep === 2 ? "completed" : ""}`}>
              <div className="delivery-icon-circle">🏡</div>
              <h5>Out for Delivery</h5>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0 }}>Courier Arriving</p>
            </div>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <div style={{ textAlign: "center" }}>
        <button className="backBtn" onClick={() => navigate("/")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Medicine;