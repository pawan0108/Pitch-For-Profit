import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#34a853', '#fbbc05'];

const InvestorDashboard = () => {
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const investorId = localStorage.getItem("investorId");
      if (!investorId) {
        console.warn("❌ investorId not found in localStorage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/investor-stats/${investorId}`);
        const result = await response.json();
        console.log("✅ API Data:", result);

        const apiData = [
          { name: 'Active Entrepreneurs', value: result.totalPitches },
          { name: 'Pitches Raised', value: result.totalRaised },
         
          { name: 'Approved Pitches', value: result.selected },
          { name: 'Meetings', value: result.totalMeetings },
        ];
        setData(apiData);

        const apiPieData = [
          { name: 'Selected Entrepreneurs', value: result.selected },
          { name: 'Not Selected', value: result.notSelected },
        ];
        setPieData(apiPieData);
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      }
    };

    fetchData();
  }, []);

  const hasBarData = data.some(item => item.value > 0);
  const hasPieData = pieData.some(item => item.value > 0);

  return (
    <div className="d-flex">
      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Content Area */}
        <div className="content p-4">
          <h1 className='text-center'>Dashboard Overview</h1>

          <div className="row mt-4">
            {data.map((item, idx) => (
              <div key={idx} className="col-md-3 mb-3">
                <div className="card shadow-sm text-center">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text display-6">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Graph Section */}
          <div className="row mt-5">
            <div className="col-md-6 mb-4">
              <h4 className="mb-3 text-center">Entrepreneurs Overview</h4>
              {hasBarData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#34a853" animationDuration={2000} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted">No bar chart data available</p>
              )}
            </div>

            <div className="col-md-6 mb-4">
              <h4 className="mb-3 text-center">Selection Ratio</h4>
              {hasPieData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                      animationDuration={2000}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted">No pie chart data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
