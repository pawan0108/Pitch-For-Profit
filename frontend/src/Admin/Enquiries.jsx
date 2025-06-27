import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/contact");
      const data = await response.json();
      setEnquiries(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      setLoading(false);
    }
  };

  const deleteEnquiry = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/contact/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (response.ok) {
          setEnquiries(enquiries.filter((item) => item._id !== id));
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error deleting enquiry:", error);
      }
    }
  };


  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <section className="py-5" style={{ backgroundColor: "#eef3f7" }}>
      <div className="container">
        <motion.h2
          className="text-center fw-bold text-primary mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📩 User Enquiries
        </motion.h2>

        {loading ? (
          <motion.p
            className="text-center text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading enquiries...
          </motion.p>
        ) : enquiries.length === 0 ? (
          <motion.p
            className="text-center text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No enquiries found.
          </motion.p>
        ) : (
          <motion.div
            className="row g-4"
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {enquiries.map((item, index) => (
              <motion.div
                key={item._id}
                className="col-md-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="card border-0 shadow rounded-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold text-success">{item.name}</h5>
                        <p className="text-muted mb-1">
                          <strong>Email:</strong> {item.email}
                        </p>
                        <p className="text-dark">{item.message}</p>
                        <p className="text-muted small mb-0">
                          {new Date(item.date).toLocaleString()}
                        </p>
                      </div>

                    </div>
                   <div align="center">
                     <button 
                      className="btn btn-sm  btn-outline-danger "
                      onClick={() => deleteEnquiry(item._id)}
                    >
                      🗑
                    </button>
                   </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Enquiries;
