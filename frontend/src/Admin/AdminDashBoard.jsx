import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Filler } from "chart.js";

import {
  Bar,
  Line,
  PolarArea,
  Pie,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
);


ChartJS.register(Filler);

// Chart Card Component
function ChartCard({ title, bg, textColor = "text-white", height = "300px", children }) {
  return (
    <div className="col-12 col-md-6">
      <div className="card h-100 shadow-sm">
        <div className={`card-header ${bg} ${textColor} text-center fw-bold`}>{title}</div>
        <div className="card-body" style={{ height }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashBoard() {
  const [stats, setStats] = useState({
    investors: 0,
    entrepreneurs: 0,
    meetings: 0,
  });

  const [categoryData, setCategoryData] = useState({
    entrepreneurCategory: [],
    investorCategory: [],
  });
  const [countryData, setCountryData] = useState({
    entrepreneurCountry: [],
    investorCountry: [],
  });


  // Fetch dashboard stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetching both stats and aggregation data at once
        const [statsRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/dashboard-stats"),
          axios.get("http://localhost:8000/api/admin/stats"),
        ]);
        console.log(stats)
        console.log("Stats Response:", statsRes.data);
        console.log("Category Response:", categoryRes.data);

        setStats(statsRes.data);
        setCategoryData({
          entrepreneurCategory: categoryRes.data.entrepreneurCategoryAgg,
          investorCategory: categoryRes.data.investorCategoryAgg,
        });
        setCountryData({
          entrepreneurCountry: categoryRes.data.entrepreneurCountryAgg,
          investorCountry: categoryRes.data.investorCountryAgg,
        });

      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchStats();
  }, []);

  // Dynamic chart data
  const barData = useMemo(() => ({
    labels: ["Entrepreneurs", "Investors"],
    datasets: [
      {
        label: "Users Count",
        data: [stats.entrepreneurs, stats.investors],
        backgroundColor: ["#0d6efd", "#198754"],
      },
    ],
  }), [stats]);


  console.log("Meetings data:", stats?.meetings); // Check if value is valid

  const lineData = useMemo(() => ({

    labels: ["Meetings"],
    datasets: [
      {

        label: "Total Meetings",
        data: [stats?.meetings || 0], // Ensure proper fallback value
        borderColor: "#6f42c1",
        backgroundColor: "rgba(111, 66, 193, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  }), [stats]);

  const entrepreneurCategoryData = useMemo(() => ({
    labels: categoryData.entrepreneurCategory.map(item => item._id),
    datasets: [{
      data: categoryData.entrepreneurCategory.map(item => item.count),
      backgroundColor: ["#0dcaf0", "#fd7e14", "#ffc107", "#dc3545", "#20c997"],
    }],
  }), [categoryData]);

  const investorCategoryData = useMemo(() => ({
    labels: categoryData.investorCategory.map(item => item._id),
    datasets: [{
      data: categoryData.investorCategory.map(item => item.count),
      backgroundColor: ["#198754", "#0d6efd", "#6f42c1", "#fd7e14", "#dc3545"],
    }],
  }), [categoryData]);


  const entrepreneurCountryData = useMemo(() => ({
    labels: countryData.entrepreneurCountry.map(item => item._id),
    datasets: [{
      data: countryData.entrepreneurCountry.map(item => item.count),
      backgroundColor: ["#0dcaf0", "#fd7e14", "#ffc107", "#dc3545", "#20c997"],
    }],
  }), [countryData]);

  const investorCountryData = useMemo(() => ({
    labels: countryData.investorCountry.map(item => item._id),
    datasets: [{
      data: countryData.investorCountry.map(item => item.count),
      backgroundColor: ["#198754", "#0d6efd", "#6f42c1", "#fd7e14", "#dc3545"],
    }],
  }), [countryData]);


  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Administrator Dashboard</h2>
      <div className="row g-4">
        <ChartCard title="Users (Entrepreneurs vs Investors)" bg="bg-primary">
          <Bar data={barData} options={defaultOptions} />
        </ChartCard>

        <ChartCard title="Total Meetings" bg="bg-success">
          <Bar data={lineData} options={defaultOptions} />
        </ChartCard>

        {/* Static/dummy charts below can stay or be replaced with more real-time data later */}
        <ChartCard title="Investor Categories" bg="bg-info">
          <PolarArea data={investorCategoryData} options={defaultOptions} />
        </ChartCard>

        <ChartCard title="Entrepreneur Categories" bg="bg-secondary">
          <PolarArea data={entrepreneurCategoryData} options={defaultOptions} />
        </ChartCard>

        <ChartCard title="Investor Countries" bg="bg-warning">
          <PolarArea data={investorCountryData} options={defaultOptions} />
        </ChartCard>

        <ChartCard title="Entrepreneur Countries" bg="bg-danger">
          <PolarArea data={entrepreneurCountryData} options={defaultOptions} />
        </ChartCard>

      </div>
    </div>
  );
}
