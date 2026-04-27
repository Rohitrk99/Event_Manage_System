// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./CartCheckout.css";

// const CartCheckout = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     number: "",
//     paymentMethod: "Cash",
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartItems(savedCart);
//   }, []);

//   const calculateTotal = () =>
//     cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   const removeItem = (id) => {
//     const updatedCart = cartItems.filter((item) => item._id !== id);
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const handleInputChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handlePlaceOrder = async () => {
//     if (cartItems.length === 0) return alert("Cart is empty!");

//     try {
//       const token = localStorage.getItem("token");
//       const userId = localStorage.getItem("userId");

//       const payload = {
//         userId,
//         vendorId: cartItems[0].vendorId,
//         items: cartItems.map((i) => ({
//           name: i.name,
//           price: i.price,
//           quantity: i.quantity,
//         })),
//         totalAmount: calculateTotal(),
//         billingDetails: formData,
//         paymentMethod: formData.paymentMethod,
//       };

//       await axios.post(`${import.meta.env.VITE_API_URL}/user/order`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("Order Placed Successfully!");
//       localStorage.removeItem("cart");
//       navigate("/orders");
//     } catch (err) {
//       alert("Error placing order. Check details.");
//       console.log(err);
//     }
    
//   };

//   return (
//     <div className="cc-wrapper">
//       <div className="cc-navbar">
//         <button className="cc-nav-btn" onClick={() => navigate("/user")}>
//           Home
//         </button>
//         <button
//           className="cc-nav-btn"
//           onClick={() => {
//             localStorage.clear();
//             navigate("/");
//           }}
//         >
//           LogOut
//         </button>
//       </div>

//       <div className="cc-section-title">Shopping Cart</div>

//       <div className="cc-cart-container">
//         <table className="cc-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Price</th>
//               <th>Quantity</th>
//               <th>Total</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cartItems.map((item) => (
//               <tr key={item._id}>
//                 <td>{item.name}</td>
//                 <td>₹{item.price}</td>
//                 <td>{item.quantity}</td>
//                 <td>₹{item.price * item.quantity}</td>
//                 <td>
//                   <button
//                     className="cc-remove-btn"
//                     onClick={() => removeItem(item._id)}
//                   >
//                     Remove
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="cc-section-title">User Details</div>
//       <form className="cc-form-grid">
//         <div className="cc-input-group">
//           <label>Name</label>
//           <input name="name" onChange={handleInputChange} />
//         </div>
//         <div className="cc-input-group">
//           <label>Number</label>
//           <input name="number" onChange={handleInputChange} />
//         </div>
//         <div className="cc-input-group">
//           <label>E-mail</label>
//           <input name="email" onChange={handleInputChange} />
//         </div>
//         <div className="cc-input-group">
//           <label>Payment Method</label>
//           <select name="paymentMethod" onChange={handleInputChange}>
//             <option value="Cash">Cash</option>
//             <option value="UPI">UPI</option>
//           </select>
//         </div>
//         <div className="cc-input-group">
//           <label>Address</label>
//           <input name="address" onChange={handleInputChange} />
//         </div>
//         <div className="cc-input-group">
//           <label>State</label>
//           <input name="state" onChange={handleInputChange} />
//         </div>
//         <div className="cc-input-group">
//           <label>City</label>
//           <input name="city" onChange={handleInputChange} />
//         </div>
//         <div className="cc-input-group">
//           <label>Pin Code</label>
//           <input name="pinCode" onChange={handleInputChange} />
//         </div>
//       </form>

//       <div className="cc-grand-total">Grand Total: ₹{calculateTotal()}</div>
//       <button className="cc-order-btn" onClick={handlePlaceOrder}>
//         Proceed to checkout
//       </button>
//     </div>
//   );
// };

// export default CartCheckout;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CartCheckout.css";

const CartCheckout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    number: "",
    paymentMethod: "Cash",
  });
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Validate that all fields are filled
  const isFormValid = () => {
    const requiredFields = ["name", "email", "address", "city", "state", "pinCode", "number"];
    return requiredFields.every(field => formData[field].trim() !== "");
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (!isFormValid()) {
      alert("Please fill all billing details.");
      return;
    }
    setShowConfirmPopup(true);
  };

  const handlePlaceOrder = async () => {
    setShowConfirmPopup(false);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const payload = {
        userId,
        vendorId: cartItems[0].vendorId,
        items: cartItems.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount: calculateTotal(),
        billingDetails: formData,
        paymentMethod: formData.paymentMethod,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/user/order`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order Placed Successfully!");
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch (err) {
      alert("Error placing order. Check details.");
      console.log(err);
    }
  };

  return (
    <div className="cc-wrapper">
      <div className="cc-navbar">
        <button className="cc-nav-btn" onClick={() => navigate("/user")}>
          Home
        </button>
        <button
          className="cc-nav-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          LogOut
        </button>
      </div>

      <div className="cc-section-title">Shopping Cart</div>

      <div className="cc-cart-container">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
                <td>
                  <button
                    className="cc-remove-btn"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cc-section-title">User Details</div>
      <form className="cc-form-grid">
        <div className="cc-input-group">
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>Number</label>
          <input name="number" value={formData.number} onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>E-mail</label>
          <input name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>Payment Method</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        <div className="cc-input-group">
          <label>Address</label>
          <input name="address" value={formData.address} onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>State</label>
          <input name="state" value={formData.state} onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>City</label>
          <input name="city" value={formData.city} onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>Pin Code</label>
          <input name="pinCode" value={formData.pinCode} onChange={handleInputChange} />
        </div>
      </form>

      <div className="cc-grand-total">Grand Total: ₹{calculateTotal()}</div>
      <button className="cc-order-btn" onClick={handleProceedToCheckout}>
        Proceed to checkout
      </button>

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="cc-popup-overlay">
          <div className="cc-popup">
            <h3>Confirm Your Order</h3>
            <div className="cc-popup-details">
              <div className="cc-popup-section">
                <h4>Billing Details</h4>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.number}</p>
                <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.pinCode}</p>
                <p><strong>Payment Method:</strong> {formData.paymentMethod}</p>
              </div>
              <div className="cc-popup-section">
                <h4>Order Summary</h4>
                {cartItems.map(item => (
                  <p key={item._id}>{item.name} x {item.quantity} = ₹{item.price * item.quantity}</p>
                ))}
                <p className="cc-popup-total"><strong>Total: ₹{calculateTotal()}</strong></p>
              </div>
            </div>
            <div className="cc-popup-actions">
              <button className="cc-popup-confirm" onClick={handlePlaceOrder}>Confirm Order</button>
              <button className="cc-popup-cancel" onClick={() => setShowConfirmPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCheckout;