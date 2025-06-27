import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function EntrepreneurView() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEnps();
  }, []);

  const fetchEnps = async () => {
    try {
      const res = await axios.get('http://localhost:8000/enp/all');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:8000/enp/${id}`);
        fetchEnps();
      } catch (error) {
        console.error('Error deleting entrepreneur:', error);
      }
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
    
    if (value.trim() === '') {
      fetchEnps(); // If empty, load all
    } else {
      try {
        const res = await axios.get(`http://localhost:8000/enp/search?query=${value}`);
        setData(res.data);
      } catch (error) {
        console.error('Error searching entrepreneurs:', error);
      }
    }
  };
  

  return (
    <>
      <div className="row  d-flex justify-content-center">
       <div className="col-lg-11 shadow mt-3">
         {/* Heading and Search Input */}
         <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-center">Entrepreneur List</h2>
          <motion.input
            type="text"
            value={search}
            onChange={handleInputChange}
            placeholder="Search Entrepreneurs..."
            className="form-control"
            style={{ width: "250px", borderRadius: "20px" }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Table */}
        <table className="table table-bordered table-hover">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Firm</th>
              <th>Category</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Reg Date</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((enp, index) => (
                <motion.tr
                  key={enp._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{index + 1}</td>
                  <td>{enp.name}</td>
                  <td>{enp.gender}</td>
                  <td>{enp.fname}</td>
                  <td>{enp.categories}</td>
                  <td>{enp.email}</td>
                  <td>{enp.mobile}</td>
                  <td>{new Date(enp.regdate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/Admin/edit-enp/${enp._id}`} className="btn btn-sm btn-warning me-2">Update</Link>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(enp._id)}>Delete</button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-danger py-4">
                  No Entrepreneurs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
       </div>
      </div>
    </>
  );
}

export default EntrepreneurView;
