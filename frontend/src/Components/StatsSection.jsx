// src/components/home/StatsSection.jsx
import { motion } from "framer-motion";
import { FaUsers, FaLightbulb, FaVideo } from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers size={30} className="text-success mb-2" />,
    label: "Entrepreneurs",
    value: "200+",
    delay: 0.2,
  },
  {
    icon: <FaUsers size={30} className="text-success mb-2" />,
    label: "Investors",
    value: "50+",
    delay: 0.4,
  },
  {
    icon: <FaLightbulb size={30} className="text-success mb-2" />,
    label: "Ideas Pitched",
    value: "300+",
    delay: 0.6,
  },
  {
    icon: <FaVideo size={30} className="text-success mb-2" />,
    label: "Meetings Scheduled",
    value: "120+",
    delay: 0.8,
  },
];

const StatsSection = () => {
  return (
    <section className="py-5 text-center bg-light">
      <div className="col-sm-11 mx-auto">
        <motion.h2
          className="fw-bold text-success mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Platform at a Glance
        </motion.h2>

        <div className="row g-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="col-6 col-md-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, duration: 0.5 }}
            >
              <div className="p-4 border rounded shadow-sm bg-white">
                {stat.icon}
                <h3 className="fw-bold">{stat.value}</h3>
                <p className="text-muted mb-0">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
