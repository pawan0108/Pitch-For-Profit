import React, { useState } from "react";
import axios from "axios";
import '../assets/css/News_Event.css'; // Keeping your custom CSS

const AdminNewsEvents = () => {
  const [newsTitle, setNewsTitle] = useState("");
  const [newsText, setNewsText] = useState("");
  const [newsImage, setNewsImage] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState(null);

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("newsTitle", newsTitle);
      formData.append("newsText", newsText);
      if (newsImage) formData.append("newsImage", newsImage);

      await axios.post("http://localhost:8000/api/add-news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: (status) => status < 500,
      });

      setNewsTitle("");
      setNewsText("");
      setNewsImage(null);
      alert('✅ News posted successfully!');
    } catch (error) {
      console.error('Error uploading news:', error);
      alert('❌ Failed to post news. Please try again.');
    }

  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("eventTitle", eventTitle);
      formData.append("eventDate", eventDate);
      formData.append("eventDescription", eventDescription);
      if (eventImage) formData.append("eventImage", eventImage);

      await axios.post("http://localhost:8000/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: (status) => status < 500,
      });

      setEventTitle("");
      setEventDate("");
      setEventDescription("");
      setEventImage(null);
      alert('✅ Event posted successfully!');
    } catch (error) {
      console.error('Error uploading event:', error);
      alert('❌ Failed to post event. Please try again.');
    }
  };

  const handleNewsImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewsImage(file);
  };

  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setEventImage(file);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 fw-bold" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>
        📢 Add News & 🗓 Events
      </h2>

      <div className="row news">
        {/* News Form */}
     
       <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h4 className="card-title text-center  mb-4">Add News</h4>
            <form onSubmit={handleNewsSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="News Title"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Enter News Text"
                  value={newsText}
                  onChange={(e) => setNewsText(e.target.value)}
                  required
                />
              </div>
              {/* <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleNewsImageChange}
                />
                {newsImage && (
                  <img
                    src={URL.createObjectURL(newsImage)}
                    alt="News Preview"
                    className="image-preview mt-2"
                  />
                )}
              </div> */}
              <button type="submit" className="btn btn-success w-100">Upload News</button>
            </form>
          </div>
        </div>

        {/* Event Form */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h4 className="card-title text-center mb-4">Add Event</h4>
            <form onSubmit={handleEventSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Event Title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="date"
                  className="form-control"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Event Description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleEventImageChange}
                />
                {eventImage && (
                  <img
                    src={URL.createObjectURL(eventImage)}
                    alt="Event Preview"
                    className="image-preview mt-2"
                  />
                )}
              </div>
              <button type="submit" className="btn btn-success w-100">Upload Event</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsEvents;
