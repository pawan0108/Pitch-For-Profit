import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      className="pt-5 pb-3 text-white"
      style={{ backgroundColor: "#1b4332" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="row d-flex justify-content-center">
          {/* Brand Info */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-white">Pitch for Profit</h4>
            <p className="text-light fs-6">
              Your trusted platform to connect brilliant startup founders with visionary investors.
              Build, pitch, and fund your next big idea.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="https://www.facebook.com/" target="blank" className="text-white fs-4">
                <FaFacebookF />
              </a>
              <a href="https://www.facebook.com/TwitterInc/" target="blank"  className="text-white fs-4">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/?hl=en" target="blank"  className="text-white fs-4">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/feed/" target="blank"  className="text-white fs-4">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="text-white fw-bold">Quick Links</h5>
            <ul className="list-unstyled text-light fs-6">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="#how" className="text-light text-decoration-none">How It Works</a></li>
              <li><a href="#contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="text-white fw-bold">Get in Touch</h5>
            <ul className="list-unstyled text-light fs-6">
              <li className="mb-2">
                <FaEnvelope className="me-2" /> support@pitchforprofit.com
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" /> +91 98765 43210
              </li>
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" /> Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-light" />

        <p className="text-center text-light fs-6 mb-0">
          © {new Date().getFullYear()} Pitch for Profit. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
