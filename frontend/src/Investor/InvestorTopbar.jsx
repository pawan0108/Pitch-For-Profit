import React from "react";
import logo from '../assets/img/logo1.png';
import '../assets/css/investor.css'; // Investor CSS (alag se)

const InvestorTopbar = ({ username }) => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>
      <div className="topbar-center"></div>
      <div className="topbar-right d-flex row me-1">
        <h2>Welcome, {username}</h2>
      </div>
    </div>
  );
};

export default InvestorTopbar;
