import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import '../assets/css/FeedbackList.css';
import defaultImg from '../assets/img/admin/admin.png';
import { Link } from 'react-router-dom';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/feedback');
        const feedbackData = response.data.feedback;

        setFeedbacks(feedbackData);

        // const uniqueUserIds = [...new Set(feedbackData.map(fb => fb.userId))];
        // const userFetches = uniqueUserIds.map(id =>
        //   axios.get(`http://localhost:8000/user/${id}`)
        // );
        // const users = await Promise.all(userFetches);

        // const userMap = {};
        // users.forEach(res => {
        //   const user = res.data.user;
        //   userMap[user._id] = user;
        // });

        // setUserDetails(userMap);
      } catch (error) {
        console.error('Error fetching feedbacks or user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderFeedbacks = () => (
    feedbacks.map((fb) => {
      const user = userDetails[fb.userId] || fb.user || {};
      return (
        
        <div className="feedback-card" key={fb._id}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={user.profilePic || defaultImg}
                  alt={user.name || "User"}
                  className="rounded-circle"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    marginRight: '10px'
                  }}
                />
                <div>
                  <Card.Title className="mb-0">{user.name || "Unknown User"}</Card.Title>
                  <Card.Text className="user-meta">{fb.userType}</Card.Text>
                </div>
              </div>
              <div className="mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < fb.rating ? '#ffc107' : '#e4e5e9'}
                    size={18}
                  />
                ))}
              </div>
              <Card.Text className="card-text">{fb.message}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      );
    })
  );

  return (
    <>
   <div className="container py-5 ms-3 mx-auto">
  <h3 className="mb-4 text-center">🌟 All User Feedback</h3>

  {loading ? (
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
    </div>
  ) : feedbacks.length === 0 ? (
    <p className="text-center">No feedback submitted yet.</p>
  ) : (
    <div className="marquee-container px-3">
      <div className="marquee-content">
        {renderFeedbacks()}
        {renderFeedbacks()} {/* Duplicate for loop */}
      </div>
    </div>
  )}

  <div className='mx-auto d-flex justify-content-center mt-3'>
    <Link className='fs-1' to=''>See More</Link>
  </div>
</div>


    </>
  );
};

export default FeedbackList;
