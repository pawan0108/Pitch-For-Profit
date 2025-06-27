
import { motion } from "framer-motion";
import { FaLightbulb, FaHandshake, FaCalendarAlt } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="py-5 bg-light" id="about">
      <div className="">
        <motion.h2
          className="mb-4 fw-bold text-success text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About <span className="text-dark">Pitch for Profit</span>
        </motion.h2>

        <motion.p
          className="mb-5 text-muted text-center"
          style={{ maxWidth: "720px", margin: "0 auto", fontSize: "1.1rem" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          🚀 Your launchpad to connect Entrepreneurs with the right Investors. Whether you’re a creator or a backer, we simplify discovery, interaction, and collaboration in the startup world.
        </motion.p>

        <div className="row col-sm-11 mx-auto g-4">
          {[
            {
              icon: <FaLightbulb className="text-warning mb-3" size={50} />,
              title: "Pitch Your Idea",
              text: "Showcase your startup, product, or idea to gain visibility and attract the right investors.",
              delay: 0.2,
            },
            {
              icon: <FaHandshake className="text-primary mb-3" size={50} />,
              title: "Connect with Investors",
              text: "Explore a network of investors ready to support bold innovations and promising entrepreneurs.",
              delay: 0.4,
            },
            {
              icon: <FaCalendarAlt className="text-danger mb-3" size={50} />,
              title: "Schedule Meetings",
              text: "Plan and attend secure video meetings to present your pitch or evaluate opportunities.",
              delay: 0.6,
            },
          ].map((item, index) => (
            <motion.div
              className="col-md-4"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="card border-0 shadow h-100 rounded-4 p-4 bg-white hover-shadow transition">
                <div className="card-body text-center">
                  {item.icon}
                  <h5 className="card-title fw-bold">{item.title}</h5>
                  <p className="card-text text-muted">{item.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
