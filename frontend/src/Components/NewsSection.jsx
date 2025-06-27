// src/components/home/NewsSection.jsx
import { motion } from "framer-motion";
import { FaRegNewspaper } from "react-icons/fa";

const newsItems = [
  {
    title: "Startup Pitch Week – May 15",
    date: "May 5, 2025",
    desc: "Join us for our biggest virtual event where over 100 startups will pitch live to investors.",
    delay: 0.2,
  },
  {
    title: "New Investor Categories Added",
    date: "May 3, 2025",
    desc: "We’ve added HealthTech, EdTech, and FinTech categories to better match investors.",
    delay: 0.4,
  },
  {
    title: "Video Meetings Upgraded",
    date: "April 28, 2025",
    desc: "Enjoy smoother video calls with improved meeting scheduling and link handling.",
    delay: 0.6,
  },
];

const NewsSection = () => {
  return (
    <section className="py-5 text-center bg-white">
      <div className="container">
        <motion.h2
          className="fw-bold mb-4 text-success"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          News & Events
        </motion.h2>

        <div className="row g-4">
          {newsItems.map((item, index) => (
            <motion.div
              key={index}
              className="col-md-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.6 }}
            >
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-start">
                  <div className="d-flex align-items-center mb-2">
                    <FaRegNewspaper className="text-success me-2" />
                    <small className="text-muted">{item.date}</small>
                  </div>
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text text-muted">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
