// src/components/home/HowItWorks.jsx
import { motion } from "framer-motion";
import { FaUserPlus, FaUserCheck, FaSearch, FaVideo } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus size={35} className="text-success" />,
    title: "Register",
    desc: "Sign up as an Entrepreneur or Investor to access the platform.",
    delay: 0.1,
  },
  {
    icon: <FaUserCheck size={35} className="text-success" />,
    title: "Complete Profile",
    desc: "Fill out your professional or business details to stand out.",
    delay: 0.3,
  },
  {
    icon: <FaSearch size={35} className="text-success" />,
    title: "Explore",
    desc: "Entrepreneurs pitch, Investors browse and select relevant ideas.",
    delay: 0.5,
  },
  {
    icon: <FaVideo size={35} className="text-success" />,
    title: "Schedule Meeting",
    desc: "Book video sessions to discuss ideas, deals, and funding.",
    delay: 0.7,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-5 bg-light text-center">
      <div className="col-sm-11 mx-auto">
        <motion.h2
          className="fw-bold mb-4 text-success"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="row g-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="col-md-3 col-sm-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: step.delay, duration: 0.6 }}
            >
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="mb-3">{step.icon}</div>
                  <h5 className="card-title">{step.title}</h5>
                  <p className="card-text text-muted">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
