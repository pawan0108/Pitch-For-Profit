import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsEventsTable = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [newsList, setNewsList] = useState([]);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    if (activeTab === "news") fetchNews();
    else fetchEvents();
  }, [activeTab]);

  // Fetch News
  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/add-news"); // Ensure this API endpoint is correct
      setNewsList(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/events"); // Adjust this API endpoint if needed
      setEventList(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Delete News
  const handleDeleteNews = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/add-news/${id}`);
      fetchNews();
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  // Update News (Placeholder for navigation or a modal)
  const handleUpdateNews = (id) => {
    console.log("Navigate to update form for News ID:", id);
    // navigate(/update-news/${id});
  };

  // Delete Event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Update Event (Placeholder for navigation or a modal)
  const handleUpdateEvent = (id) => {
    console.log("Navigate to update form for Event ID:", id);
    // navigate(/update-event/${id});
  };

  return (
    <div className="container my-5">
      {/* Tab Buttons */}
      <div className="mb-4 d-flex gap-3">
        <button
          className={`btn ${activeTab === "news" ? "me-3 btn-success" : "btn-outline-success"}`}
          onClick={() => setActiveTab("news")}
        >
          News
        </button>
        <button
          className={`btn ${activeTab === "events" ? " ms-3 btn-success" : "btn-outline-success"}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
      </div>

      {/* News Table */}
      {activeTab === "news" && (
        <>
          <h4 className="mb-3">News List</h4>
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>S.N.</th>
                <th>Title</th>
                <th>Text</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No news available
                  </td>
                </tr>
              ) : (
                newsList.map((news, index) => (
                  <tr key={news._id}>
                    <td>{index + 1}</td>
                    <td>{news.newsTitle}</td>
                    <td>{news.newsText}</td>
                    <td>{new Date(news.newsDate).toLocaleDateString()}</td>
                    <td>
                      {/* <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleUpdateNews(news._id)}
                      >
                        Update
                      </button> */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteNews(news._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Events Table */}
      {activeTab === "events" && (
        <>
          <h4 className="mb-3">Events List</h4>
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Event Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No events available
                  </td>
                </tr>
              ) : (
                eventList.map((event, index) => (
                  <tr key={event._id}>
                    <td>{index + 1}</td>
                    <td>{event.eventTitle}</td>
                    <td>{event.eventDescription}</td>
                    <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td>
                      {/* <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleUpdateEvent(event._id)}
                      >
                        Update
                      </button> */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default NewsEventsTable;