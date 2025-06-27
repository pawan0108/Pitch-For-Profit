// src/components/home/Testimonials.jsx
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Ravi Sharma",
    role: "Entrepreneur",
    message:
      "Pitch for Profit helped me connect with the right investor and secure funding for my startup in just a few weeks!",
    delay: 0.2,
  },
  {
    name: "Sneha Mehra",
    role: "Investor",
    message:
      "I discovered some incredible business ideas through this platform. It’s easy to use and incredibly efficient.",
    delay: 0.4,
  },
  {
    name: "Amit Verma",
    role: "Entrepreneur",
    message:
      "The scheduling and video call features make the entire pitching process smooth and professional.",
    delay: 0.6,
  },
];

const Testimonials = () => {
  return (
    <section className="py-5 bg-white text-center">
      <div className="container">
        <motion.h2
          className="fw-bold mb-4 text-success"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What Our Users Say
        </motion.h2>

        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="col-md-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: testimonial.delay, duration: 0.6 }}
            >
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <FaQuoteLeft size={24} className="text-success mb-3" />
                  <p className="text-muted">"{testimonial.message}"</p>
                  <h6 className="mt-3 mb-0 fw-bold">{testimonial.name}</h6>
                  <small className="text-muted">{testimonial.role}</small>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
