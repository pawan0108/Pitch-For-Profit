import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const entrepreneur = JSON.parse(localStorage.getItem('entrepreneur'));
  const investor = JSON.parse(localStorage.getItem('investor'));

  // Decide based on availability of only one
  let user = null;
  let userType = null;

  if (entrepreneur && !investor) {
    user = entrepreneur._id;
    userType = 'Entrepreneur';
  } else if (!entrepreneur && investor) {
    user = investor._id;
    userType = 'Investor';
  } else if (entrepreneur && investor) {
    // Both present: check for some distinguishing flag or assume based on route
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('entrepreneur')) {
      user = entrepreneur._id;
      userType = 'Entrepreneur';
    } else if (currentPath.includes('investor')) {
      user = investor._id;
      userType = 'Investor';
    } else {
      // Default fallback (pick one or throw error)
      user = entrepreneur._id;
      userType = 'Entrepreneur';
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !userType) {
      setError('User not identified in this tab. Please log in again.');
      return;
    }

    if (rating === 0 || !message.trim()) {
      setError('Please provide a rating and feedback message.');
      return;
    }

    const feedbackData = {
      userType,
      user,
      rating,
      message,
    };

    try {
      const response = await axios.post('http://localhost:8000/feedback', feedbackData);
      console.log('Feedback submitted successfully:', response.data);
      setSubmitted(true);
      setError('');
      setMessage('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('There was an error submitting your feedback. Please try again later.');
    }
  };

  return (
    <div className="container card h-75 w-50 p-4 my-5" style={{ maxWidth: '800px' }}>
      <h4 className="mb-3">Rate Your Experience</h4>
      <div className="mb-3 d-flex">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <label key={index} style={{ cursor: 'pointer' }}>
              <FaStar
                size={30}
                color={starValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          );
        })}
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="feedbackTextarea" className="mb-3">
          <Form.Label>Your Feedback</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your experience..."
            required
          />
        </Form.Group>
        <Button type="submit" variant="success" disabled={rating === 0 || !message.trim()}>
          Submit
        </Button>
        {submitted && (
          <div className="alert alert-success mt-3">
            ✅ Thank you for your feedback!
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-3">
            ❌ {error}
          </div>
        )}
      </Form>
    </div>
  );
};

export default FeedbackForm;