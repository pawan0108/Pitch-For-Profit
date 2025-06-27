import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // <- IMPORT motion


function InvestorView() {
  const [investors, setInvestors] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  // Fetch all investors
  const fetchInvestors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/investor/all');
      setInvestors(response.data);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  // Search investors
  const searchInvestors = async (key) => {
    try {
      if (key.trim() === '') {
        fetchInvestors();
      } else {
        const response = await axios.get(`http://localhost:8000/investor/search?query=${key}`);
        setInvestors(response.data);
      }
    } catch (error) {
      console.error("Error searching investors:", error);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  // Delete investor by ID
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this investor?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/investor/${id}`);
        fetchInvestors(); // Refresh list
      } catch (error) {
        console.error("Error deleting investor:", error);
      }
    }
  };

  return (
    <>
      <div className="row ">
        <div className="col-lg-11 shadow mx-auto mt-3">
          <div className="table-responsive">

            {/* Heading and Search Row */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Investors List</h2>
              <motion.input
                type="text"
                className="form-control mt-1 me-1"
                placeholder="Search Investors..."
                value={searchKey}
                onChange={(e) => {
                  setSearchKey(e.target.value);
                  searchInvestors(e.target.value);
                }}
                style={{ width: "250px", borderRadius: "20px" }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Table */}
            <table className="table table-bordered table-striped">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Firm</th>
                  <th>Category</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {investors.length > 0 ? (
                  investors.map((inv, index) => (
                    <motion.tr
                      key={inv._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td>{index + 1}</td>
                      <td>{inv.name}</td>
                      <td>{inv.gender}</td>
                      <td>{inv.email}</td>
                      <td>{inv.mobile}</td>
                      <td>{inv.fname}</td>
                      <td>{inv.categories}</td>
                      <td>
                        <Link to={`/Admin/Edit/${inv._id}`} className="btn btn-sm btn-warning me-2">Update</Link>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(inv._id)} className="btn btn-sm btn-danger">Delete</button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-danger py-4">
                      No investors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
}

export default InvestorView;
