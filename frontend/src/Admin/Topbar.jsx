import React from "react";
import { FaBell } from "react-icons/fa";
import logo from '../assets/img/logo1.png'
// import "./Topbar.css";

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* Logo Image yaha daal lena */}
        <img src={logo} alt="Logo" className="logo-img" />
      </div>
      <div className="topbar-center">
      
      </div>
      <div className="topbar-right d-flex row me-1">
        {/* <div className="notification">
          <FaBell size={20} />
          <span className="badge">5</span>
        </div> */}
        {/* <img src="https://i.pravatar.cc/40" alt="Profile" className="profile-img" /> */}
        <h2>Admin Dashboard</h2>
        {/* <div className=""><h3>Logout</h3></div> */}
      </div>
    </div>
  );
};

export default Topbar;
