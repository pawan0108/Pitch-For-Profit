import React, { useState, useEffect } from "react";
import {FaBars, FaHome, FaUser, FaMoneyBill, FaFileAlt, FaCalendarAlt, FaUpload, FaComments, FaSignOutAlt, FaTasks} from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const EnpSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("entrepreneur");
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: <FaHome />, path: "/entrepreneur", text: "Dashboard" },
    { icon: <FaUser />, path: "/entrepreneur/enpProfile", text: "Profile" },
    { icon: <FaFileAlt />, path: "/entrepreneur/submitPitch", text: "Submit Pitch" },
    { icon: <FaTasks />, path: "/entrepreneur/myPitchs", text: "My Pitches" },
    // { icon: <FaMoneyBill />, path: "/entrepreneur/payments", text: "Payments" },
    { icon: <FaCalendarAlt />, path: "/entrepreneur/mform", text: "Schedule Meeting" },

    { icon: <FaCalendarAlt />, path: "/entrepreneur/sed", text: "All Scheduled Meetings" },
    // { icon: <FaUpload />, path: "/entrepreneur/documents", text: "Documents" },
    // { icon: <FaComments />, path: "/entrepreneur/investor-responses", text: "Investor Responses" }
    { icon: <FaCommentAlt />, path: "/entrepreneur/feedback", text: "Feedback" }
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1550) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      animate={{ width: isOpen ? 280 : 80 }}
      initial={{ width: 280 }}
      className="sidebar h-100"
    >
      <div className="top_section">
        <div className="bars" onClick={toggleSidebar}>
          <FaBars />
        </div>
      </div>

      <div className="menu_items">
        {menuItems.map(({ icon, path, text }, index) => (
          <NavLink
            key={index}
            to={path}
            className={`menu_item ${isActive(path) ? "active-link" : ""}`}
            title={!isOpen ? text : ""}
            style={{
              textDecoration: "none",
              color: isActive(path) ? "#fff" : "#000",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "12px 20px",
              transition: "all 0.1s ease",
              fontWeight: 500,
              backgroundColor: isActive(path) ? "#259e2b" : "transparent",
              borderRadius: "8px",
            }}
          >
            {icon}
            {isOpen && <span>{text}</span>}
          </NavLink>
        ))}

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className="menu_item"
          title={!isOpen ? "Logout" : ""}
          style={{
            textDecoration: "none",
            color: "#000",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "12px 20px",
            transition: "all 0.1s ease",
            fontWeight: 500,
            backgroundColor: "transparent",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default EnpSidebar;
