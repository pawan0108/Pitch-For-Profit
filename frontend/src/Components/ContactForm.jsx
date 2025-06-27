import React, { useState } from "react";
import { motion } from "framer-motion";

const ContactForm = () => {
const [form, setForm] = useState({ name: "", email: "", message: "" });

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Thank you! We’ll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } else {
      alert(result.error || "Something went wrong!");
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("Error submitting form. Please try again later.");
  }
};


return (
<section id="contact" className="py-5" style={{ backgroundColor: "#f5f5f5" }}>
<div className="container">
<motion.h2
className="text-center fw-bold text-success mb-5"
initial={{ opacity: 0, y: -20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
>
Get in Touch
</motion.h2>
<motion.div
      className="row g-4 align-items-center justify-content-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Side - Quote */}
      <div className="col-lg-5">
        <div className="p-4 bg-white shadow-lg rounded-4 h-100 d-flex flex-column justify-content-center">
          <h4 className="text-success fw-bold mb-3">🤝 Build Connections that Matter</h4>
          <p className="text-muted fs-5 fst-italic">
            “Every big idea needs a believer. Let's create that bridge between vision and investment.”
          </p>
          <hr className="my-3" />
          <p className="text-muted small mb-0">
            We're here to help you turn ideas into action.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="col-lg-7">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control form-control-lg rounded-3"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control form-control-lg rounded-3"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="col-12">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="form-control form-control-lg rounded-3"
                  rows="5"
                  placeholder="Your Message"
                  required
                />
              </div>
              <div className="col-12 text-center">
                <button
                  type="submit"
                  className="btn btn-success btn-lg px-5 rounded-pill shadow-sm"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>

);
};

export default ContactForm;