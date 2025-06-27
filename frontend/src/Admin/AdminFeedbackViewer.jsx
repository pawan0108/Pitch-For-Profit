import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Button, Form, Card, Row, Col, Pagination } from 'react-bootstrap';
import { FaReply, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const AdminFeedbackViewer = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [replies, setReplies] = useState({});
    const feedbacksPerPage = 6;

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const { data } = await axios.get('/api/feedback');
            setFeedbacks(data.feedback);
            setFilteredFeedbacks(data.feedback);
        } catch (err) {
            console.error('Failed to fetch feedbacks', err);
        }
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
        setCurrentPage(1);
        if (type === 'All') setFilteredFeedbacks(feedbacks);
        else setFilteredFeedbacks(feedbacks.filter(fb => fb.userType === type));
    };

    const handleCardClick = (feedback) => {
        setSelectedFeedback(feedback);
        setShowModal(true);
    };

    const handleReplyChange = (e) => {
        setReplies({ ...replies, [selectedFeedback.id]: e.target.value });
    };

    const handleReplySubmit = () => {
        alert(`Reply sent: ${replies[selectedFeedback.id]}`);
        setShowModal(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/feedback/${id}`);
            fetchFeedbacks();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const indexOfLast = currentPage * feedbacksPerPage;
    const indexOfFirst = indexOfLast - feedbacksPerPage;
    const currentFeedbacks = Array.isArray(filteredFeedbacks)
        ? filteredFeedbacks.slice(indexOfFirst, indexOfLast)
        : [];

    const totalPages = Array.isArray(filteredFeedbacks)
        ? Math.ceil(filteredFeedbacks.length / feedbacksPerPage)
        : 0;


    return (
        <div className="container py-4">
            <h3 className="mb-3">Admin Feedback Viewer</h3>

            <div className="mb-4">
                <Form.Select
                    value={filterType}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    style={{ maxWidth: '250px' }}
                >
                    <option value="All">All</option>
                    <option value="Investor">Investor</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                </Form.Select>
            </div>

            <Row className="g-4">
                {currentFeedbacks.map((fb, index) => (
                    <Col key={fb.id} xs={12} sm={6} md={4}>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            onClick={() => handleCardClick(fb)}
                        >
                            <Card className="h-100 shadow">
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={fb.user.profilePic || 'https://via.placeholder.com/50'}
                                            alt="profile"
                                            className="rounded-circle me-3"
                                            width="50"
                                            height="50"
                                        />
                                        <div>
                                            <h6 className="mb-0">{fb.user.name}</h6>
                                            <small className="text-muted">{fb.userType}</small>
                                        </div>
                                    </div>
                                    <p className="mb-2"><strong>Rating:</strong> {fb.rating}⭐</p>
                                    <p className="text-truncate" style={{ maxHeight: '3em' }}>{fb.message}</p>
                                    <div className="d-flex justify-content-end gap-3 mt-2">
                                        <Button variant="outline-primary" size="sm" onClick={(e) => { e.stopPropagation(); handleCardClick(fb); }}><FaReply /></Button>
                                        <Button variant="outline-danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(fb.id); }}><FaTrash /></Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    {[...Array(totalPages).keys()].map(number => (
                        <Pagination.Item
                            key={number + 1}
                            active={number + 1 === currentPage}
                            onClick={() => setCurrentPage(number + 1)}
                        >
                            {number + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Feedback Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFeedback && (
                        <>
                            <p><strong>From:</strong> {selectedFeedback.user.name}</p>
                            <p><strong>Type:</strong> {selectedFeedback.userType}</p>
                            <p><strong>Rating:</strong> {selectedFeedback.rating}⭐</p>
                            <p><strong>Message:</strong> {selectedFeedback.message}</p>
                            <Form.Group className="mt-3">
                                <Form.Label>Reply:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={replies[selectedFeedback.id] || ''}
                                    onChange={handleReplyChange}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleReplySubmit}>
                        Send Reply
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminFeedbackViewer;
