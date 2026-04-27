import React, { useEffect, useState } from "react";
import "./CartCheckout.css";
import axios from "axios";
import { Navigate } from "react-router-dom";

const CartCheckoutDetails = () => {
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

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty!");

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

      await axios.post("http://localhost:5000/user/order", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order Placed Successfully!");
      localStorage.removeItem("cart");
      Navigate("/orders");
    } catch (err) {
      alert("Error placing order. Check details.");
      console.log(err);
    }
  };

  return (
    <div>
        <div className="cc-section-title">Details</div>
      <form className="cc-form-grid">
        <div className="cc-input-group">
          <label>Name</label>
          <input name="name" onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>Number</label>
          <input name="number" onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>E-mail</label>
          <input name="email" onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>Payment Method</label>
          <select name="paymentMethod" onChange={handleInputChange}>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        <div className="cc-input-group">
          <label>Address</label>
          <input name="address" onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>State</label>
          <input name="state" onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>City</label>
          <input name="city" onChange={handleInputChange} />
        </div>
        <div className="cc-input-group">
          <label>Pin Code</label>
          <input name="pinCode" onChange={handleInputChange} />
        </div>
      </form>
      <div className="cc-grand-total">Grand Total: ₹{calculateTotal()}</div>
      <button className="cc-order-btn" onClick={handlePlaceOrder}>
        Order Now
      </button>
    </div>
  );
};

export default CartCheckoutDetails;
