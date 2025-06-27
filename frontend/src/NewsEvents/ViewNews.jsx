import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewNews.css";

const ViewNews = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/add-news");
      setNewsList(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };


  return (
    <div className="news-page pr-2 ">
      <div className="marquee-outer">
        <div className="marquee-inner">
          {[...newsList, ...newsList].map((news, index) => (
            <div className="news-card" key={index}>
              <h1 className="news-title">{news.newsTitle}</h1>
              <div className="news-meta">
                By Admin | {new Date().toLocaleDateString()}
              </div>
              <p className="news-text">{news.newsText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ViewNews;