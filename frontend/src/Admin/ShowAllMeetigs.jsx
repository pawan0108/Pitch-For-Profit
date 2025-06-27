// ShowAllMeetigs

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const statusColor = {
  approved: "success",
  pending: "warning",
  cancelled: "danger"
};

const ShowAllMeetigs = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/meetings/all");
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <section className="py-5" style={{ backgroundColor: "#f4f8fb" }}>
      <div className="container">
        <motion.h2
          className="text-center text-primary fw-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🗓 All Scheduled Meetings
        </motion.h2>

        {loading ? (
          <p className="text-center text-muted">Loading meetings...</p>
        ) : meetings.length === 0 ? (
          <p className="text-center text-muted">No meetings found.</p>
        ) : (
          <motion.div
            className="row g-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {meetings.map((meeting) => (
              <motion.div
                key={meeting._id}
                className="col-lg-4 col-md-6"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className={`card border-0 shadow-lg rounded-4 border-start border-${statusColor[meeting.status] || 'secondary'} border-4`}>
                  <div className="card-body">
                    <h5 className="fw-bold mb-1 text-success">{meeting.enpname}</h5>
                    <p className="mb-1 text-muted small"><strong>Email:</strong> {meeting.enpemailaddress}</p>
                    <p className="mb-1"><strong>Investor:</strong> {meeting.investorname || "N/A"}</p>
                    <p className="mb-1"><strong>Date:</strong> {new Date(meeting.meetingdate).toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Time:</strong> {meeting.meetingtime}</p>
                    <span className={`badge bg-${statusColor[meeting.status] || 'secondary'}`.trim()}>
                      {meeting.status.toUpperCase()}
                    </span>
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

export default ShowAllMeetigs;
