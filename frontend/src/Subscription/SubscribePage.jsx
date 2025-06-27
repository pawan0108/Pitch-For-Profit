import React, { useState } from 'react';

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    const user = JSON.parse(localStorage.getItem('entrepreneur'));
    if (!user?.email) return alert("Entrepreneur not found in localStorage");

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/entrepreneur/subscribe', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      const data = await res.json();
      if (res.ok) {
        // Update localStorage
        localStorage.setItem('entrepreneur', JSON.stringify(data.entrepreneur));
        setMessage("You are now subscribed!");
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="container py-5 text-center">
      <h2>Subscribe to Request Meetings</h2>
      <button className="btn btn-success px-4" onClick={handleSubscribe} disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe Now"}
      </button>
      {message && <p className="mt-3 text-info">{message}</p>}
    </div>
  );
}
