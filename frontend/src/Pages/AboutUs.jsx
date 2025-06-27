import React from "react";
import { motion } from "framer-motion";
import { FaHandshake, FaUsers, FaRocket, FaShieldAlt, FaGlobe, FaChartLine } from "react-icons/fa";

const AboutUs = () => {
  return (
    <section className="py-5 bg-white" id="about">
      <div className="container">
        {/* Heading */}
        <motion.h2
          className="text-center fw-bold text-success mb-5 display-4"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Pitch for Profit
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          className="text-center text-muted mb-5 fs-5"
          style={{ maxWidth: "900px", margin: "0 auto" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Pitch for Profit is India’s leading startup-investor matchmaking platform, created to bridge the gap between passionate entrepreneurs and visionary investors. Our platform empowers startups to showcase their ideas, get noticed, and raise funds, while helping investors discover high-potential opportunities.
        </motion.p>

        {/* Feature highlights */}
        <div className="row g-5">
          {/* Secure Platform */}
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="d-flex align-items-start gap-4">
              <FaShieldAlt size={50} className="text-success" />
              <div>
                <h4 className="fw-bold">Secure & Trusted</h4>
                <p className="text-muted fs-6">
                  We use top-grade security systems to ensure that your ideas, profile data, and communications remain fully protected.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Founder-Investor Matching */}
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="d-flex align-items-start gap-4">
              <FaHandshake size={50} className="text-success" />
              <div>
                <h4 className="fw-bold">Smart Founder-Investor Matching</h4>
                <p className="text-muted fs-6">
                  AI-driven matching system connects you with ideal investors or startups based on your preferences, industry, and stage.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Networking & Collaboration */}
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="d-flex align-items-start gap-4">
              <FaUsers size={50} className="text-success" />
              <div>
                <h4 className="fw-bold">Collaborative Community</h4>
                <p className="text-muted fs-6">
                  We promote open networking with mentors, experts, and like-minded founders, helping your startup grow beyond investment.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tools to Scale */}
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="d-flex align-items-start gap-4">
              <FaRocket size={50} className="text-success" />
              <div>
                <h4 className="fw-bold">Tools to Scale Fast</h4>
                <p className="text-muted fs-6">
                  Schedule meetings, chat securely, get pitch analytics, and track engagement — all in one place.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Global Vision */}
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="d-flex align-items-start gap-4">
              <FaGlobe size={50} className="text-success" />
              <div>
                <h4 className="fw-bold">Global Reach</h4>
                <p className="text-muted fs-6">
                  Startups and investors from all across India and abroad use our platform to explore global business potential.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Growth-Focused Insights */}
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="d-flex align-items-start gap-4">
              <FaChartLine size={50} className="text-success" />
              <div>
                <h4 className="fw-bold">Growth-Focused Insights</h4>
                <p className="text-muted fs-6">
                  Access actionable feedback and platform-generated insights to improve your pitch and business plan.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          className="mt-5 bg-light p-5 rounded-4 shadow text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="fw-bold text-success mb-3">Our Mission</h4>
          <p className="text-muted fs-5">
            To become India’s most trusted platform where startups and investors thrive together. We aim to simplify funding, foster collaboration, and accelerate innovation that drives economic growth.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
