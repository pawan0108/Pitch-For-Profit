import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../assets/css/FeedbackList.css'; // Use the updated CSS
import defaultImg from '../assets/img/admin/admin.png';

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/feedback');
        console.log(response.data.feedback);
        setFeedbacks(response.data.feedback || []);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderFeedbacks = () =>
    feedbacks.map((fb) => {
      const user = fb.user || {};
      const date = fb.createdAt ? new Date(fb.createdAt) : null;

      console.log(date?.toLocaleString());
      

      return (
        <Col key={fb._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card className="animated-card shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={user.profilePic || defaultImg}
                  alt={user.name || "User"}
                  className="rounded-circle me-2"
                  style={{ width: 50, height: 50, objectFit: 'cover' }}
                />
                <div>
                  <Card.Title className="mb-0">{user.name || "Unknown User"}</Card.Title>
                  <Card.Text className="text-muted">{fb.userType}</Card.Text>
                </div>
              </div>

              <div className="mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < fb.rating ? '#ffc107' : '#e4e5e9'}
                    size={16}
                  />
                ))}
              </div>

              <Card.Text className="text-dark">{fb.message}</Card.Text>
              <small className="text-muted">Posted on: {date?.toLocaleDateString()}</small>

            </Card.Body>
          </Card>
        </Col>
      );
    });

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">🌟 All User Feedback</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : feedbacks.length === 0 ? (
        <p className="text-center">No feedback submitted yet.</p>
      ) : (
        <Row>{renderFeedbacks()}</Row>
      )}

      <div className="d-flex justify-content-center mt-4">
        <Link className="btn btn-outline-primary" to="">
          See More
        </Link>
      </div>
    </div>
  );
};

export default AllFeedbacks;
