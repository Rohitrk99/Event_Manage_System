import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./VendorList.css";

const VendorList = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const [vendors, setVendors] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVendors();
  }, [category]);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/vendors/${category}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors", err);
    }
  };

  return (
    <div className="vl-wrapper">
      <div className="vl-navbar">
        <button className="vl-nav-btn" onClick={() => navigate("/user")}>
          Home
        </button>

        <div className="vl-title">Vendor - {category}</div>

        <button
          className="vl-nav-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          LogOut
        </button>
      </div>

      <div className="vl-container">
        {vendors.map((vendor) => (
          <div key={vendor._id} className="vl-card">
            <h3>{vendor.name}</h3>
            <p>{vendor.contactInfo || "Contact Details"}</p>

            <button
              className="vl-shop-btn"
              onClick={() => navigate(`/user/vendor/${vendor._id}`)}
            >
              Shop Item
            </button>
          </div>
        ))}
      </div>

      {vendors.length === 0 && (
        <p style={{ textAlign: "center" }}>No vendors found.</p>
      )}
    </div>
  );
};

export default VendorList;
