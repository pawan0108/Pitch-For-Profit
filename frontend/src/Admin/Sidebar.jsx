import React, { useState, useEffect } from "react";
import {
  FaBars, FaUser, FaNewspaper, FaChartLine, FaUsers, FaSignOutAlt, FaMoneyBill, FaTrashAlt,
  FaLightbulb,
  FaHandshake,
  FaComments,
  FaEnvelopeOpenText
} from "react-icons/fa";
import { motion } from "framer-motion";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("admin");
      navigate('/login'); // Redirect to login page
    }
  };

  const menuItems = [
    { icon: <FaChartLine />, path: "/Admin", text: "Dashboard" },
    { icon: <FaUser />, path: "/Admin/enp-manage", text: "Manage Entrepreneur" },
    { icon: <FaUsers />, path: "/Admin/inv-manage", text: "Manage Investors" },
    // { icon: <FaMoneyBill />, path: "payment-approve", text: "Payments" },
    { icon: <FaNewspaper />, path: "/Admin/add-news", text: "Add News" },

    { icon: <FaTrashAlt />, path: "/Admin/delete-news-event", text: "News-Events Delete" },
   { icon: <FaLightbulb />, path: "/Admin/pitches-admin", text: "View Pitches" },
    { icon: <FaHandshake />, path: "/Admin/show-all-meetings", text: "View Meetings" },
    // { icon: <FaComments />, path: "/Admin/view-feedbacks", text: "View Feedbacks" },
      { icon: <FaEnvelopeOpenText />, path: "enquiries", text: "View Enquiries" }
  ];

  const isActive = (path) => location.pathname === path;

  // Auto close sidebar on screen width <= 1550px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1550) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      animate={{ width: isOpen ? 290 : 80 }}
      className="sidebar h-100"
      initial={{ width: 280 }}
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
            {!isOpen ? (
              <div title={text}>
                {icon}
              </div>
            ) : (
              <>
                {icon}
                <span>{text}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Separate logout button */}
        <div
          onClick={handleLogout}
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
          className="menu_item"
        >
          {!isOpen ? (
            <div title="Logout">
              <FaSignOutAlt />
            </div>
          ) : (
            <>
              <FaSignOutAlt />
              <span>Logout</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
