import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';

function Login() {
    
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  
  const loginHandler = async (e) => {
    e.preventDefault();
  
    const endpoints = {
      admin: "http://localhost:8000/admin/login",
      investor: "http://localhost:8000/investor/login",
      entrepreneur: "http://localhost:8000/entrepreneur/login"
    };
  
    if (!endpoints[userType]) {
      alert("Please select a valid user type.");
      return;
    }
  
    try {
      const res = await axios.post(endpoints[userType], { email, password });
  
      if (res.data.message === "Login successful") {
        const userData = res.data[userType] || res.data.investor || res.data.entrepreneur || res.data.admin;
  
        if (!userData) {
          alert("Unexpected response format. Please check backend.");
          return;
        }
  
        // Store the user data with correct key and structure
        localStorage.setItem(userType, JSON.stringify({
          _id: userData._id || userData.id, // handle both _id and id
          name: userData.name,
          email: userData.email
        }));

        localStorage.setItem("userEmail", userData.email);
  
        // Optional: store ID separately if needed
        localStorage.setItem(`${userType}Id`, userData._id || userData.id);
  
        navigate(`/${userType}`);
      } else {
        alert(res.data.message); // fallback
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }
      console.error("Login error:", error);
    }
  };
  
  
  return (
   <div className='login-wrapper'>
     <div className="login-card">
      <div className="login-left">
        <h1 align="center">Welcome, User's!</h1>
        <p>
        Login to manage your meetings, pitch ideas, and explore new opportunities.
        </p>
        <p align="center">Turn your vision into venture - log in and start now.</p>
      </div>

      <div className="login-right">
        <h2 className="login-title">USER LOGIN</h2>
        <form onSubmit={loginHandler}>
          <div className="login-input">
            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-input">
            <select className='custom-select'
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="">Select User Type</option>
              <option value="admin">Admin</option>
              <option value="investor">Investor</option>
              <option value="entrepreneur">Entrepreneur</option>
            </select>
          </div>
          <div className="login-options">
            <label>
              {/* <input type="checkbox" /> Remember */}
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="login-button">LOGIN</button>
        </form>
      </div>
    </div>
   </div>
  );
}

export default Login;
