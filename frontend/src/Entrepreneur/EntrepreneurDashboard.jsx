import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
);

const EntrepreneurDashboard = () => {
  const entrepreneur = JSON.parse(localStorage.getItem("entrepreneur"));
  const entrepreneurId = entrepreneur?._id;

  console.log('Entrepreneur ID:', entrepreneurId);
  const [stats, setStats] = useState({
    totalPitches: 0,
    raised: 0,
    investmentStatus: {},
    categoryCount: {},
    monthlyMeetings: [],
    monthlyPitches: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const pitchRes = await axios.get(`http://localhost:8000/api/pitches/stats/${entrepreneurId}`);
        const meetingRes = await axios.get(`http://localhost:8000/api/meetings/monthly/${entrepreneurId}`);
        const pitchMonthlyRes = await axios.get(`http://localhost:8000/api/pitches/monthly/${entrepreneurId}`);
        const categoryStatsRes = await axios.get(`http://localhost:8000/api/pitches/category-stats/${entrepreneurId}`);
  
        setStats({
          totalPitches: pitchRes.data?.totalPitches || 0,
          raised: pitchRes.data?.raisedPitches || 0, 
          investmentStatus: pitchRes.data?.investmentStatus || {},
          categoryCount: categoryStatsRes.data?.categoryCount || {},  // Update this
          monthlyMeetings: meetingRes.data || [],
          monthlyPitches: pitchMonthlyRes.data || []
        });
  
      } catch (err) {
        console.error('📉 Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, [entrepreneurId]);
  

  useEffect(() => {
    // Log the updated stats here, after the state has been updated
    console.log("Updated Stats:", stats);
  }, [stats]);  // This effect runs every time `stats` state changes

  if (loading) {
    return <div>Loading...</div>;
  }

  const statCards = [
    { name: 'Total Pitches', value: stats.totalPitches },
    { name: 'Total Raised Pitches', value: stats.raised },
    {
      name: 'Meetings Scheduled',
      value: Array.isArray(stats.monthlyMeetings)
        ? stats.monthlyMeetings.reduce((a, b) => a + b, 0)
        : 0
    },
  ];

  const RaisedInvestors = {
    labels: ['Pending', 'Approved', 'Cancelled'],
    datasets: [{
      label: 'Investor Status',
      data: [
        stats.investmentStatus?.pending || 0,
        stats.investmentStatus?.approved || 0,
        stats.investmentStatus?.cancelled || 0
      ],
      backgroundColor: ['#f6c23e', '#1cc88a', '#e74a3b']
    }]
  };
  
  const monthlyMeetingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Meetings Scheduled',
      data: stats.monthlyMeetings.length ? stats.monthlyMeetings : Array(12).fill(0),
      backgroundColor: '#36b9cc'
    }]
  };

  const monthlyPitchesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Pitches Submitted',
      data: stats.monthlyPitches.length ? stats.monthlyPitches : Array(12).fill(0),
      backgroundColor: '#4e73df'
    }]
  };

  const pieData = {
    labels: Object.keys(stats.categoryCount || {}),
    datasets: [{
      label: 'Pitches by Category',
      data: Object.values(stats.categoryCount || {}),
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
    }]
  };
  
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Entrepreneur Dashboard</h2>

      <div className="row mb-5">
        {statCards.map((stat, index) => (
          <div className="col-12 col-md-4 mb-3" key={index}>
            <div className="card text-center shadow-sm">
              <div className="card-body p-4">
                <h6 className="card-title text-muted">{stat.name}</h6>
                <h4 className="card-text fw-bold">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h5 className="text-center mb-2">Monthly Pitches</h5>
          <div className="card shadow-sm p-3">
            <div style={{ height: '250px' }}>
              <Bar
                data={monthlyPitchesData}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <h5 className="text-center mb-2">Meetings Scheduled</h5>
          <div className="card shadow-sm p-3">
            <div style={{ height: '250px' }}>
              <Bar
                data={monthlyMeetingData}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <h5 className="text-center mb-2">Pitches Categories</h5>
          <div className="card shadow-sm p-3">
            <div style={{ height: '250px' }}>
              <Pie
                data={pieData}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <h5 className="text-center mb-2">Raised Investors</h5>
          <div className="card shadow-sm p-3">
            <div style={{ height: '250px' }}>
              <Doughnut
                data={RaisedInvestors}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
