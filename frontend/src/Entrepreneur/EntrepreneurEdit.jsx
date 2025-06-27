import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EntrepreneurEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    gender: '',
    address: '',
    country: '',
    state: '',
    city: '',
    fname: '',
    faddress: '',
    mobile: '',
    email: '',
    regdate: '',
    password: '',
    categories: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/enp/${id}`)
      .then((res) => {
        const data = res.data;
        data.regdate = data.regdate?.split('T')[0]; // Format date
        setForm(data);
      })
      .catch((err) => console.error("Error loading entrepreneur:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/enp/${id}`, form);
      alert("Entrepreneur updated successfully!");
      navigate("/Admin/view-enp");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <form method="post" onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm fs-5">
            <h2 className="text-center mb-4">Edit Entrepreneur</h2>

            {/* Name & Gender */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="col-md-6 ">
                <label className="form-label">Gender</label> <br />
                <div className="form-check form-check-inline">
                  <input type="radio" className="form-check-input " name="gender" value="Male" checked={form.gender === 'Male'} onChange={handleChange} />
                  <label className="form-check-label">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input type="radio" className="form-check-input" name="gender" value="Female" checked={form.gender === 'Female'} onChange={handleChange} />
                  <label className="form-check-label">Female</label>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Address</label>
                <textarea className="form-control" name="address" value={form.address} onChange={handleChange}></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <input type="text" className="form-control" name="country" value={form.country} onChange={handleChange} />
              </div>
            </div>

            {/* State & City */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">State</label>
                <input type="text" className="form-control" name="state" value={form.state} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} />
              </div>
            </div>

            {/* Firm */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Firm Name</label>
                <input type="text" className="form-control" name="fname" value={form.fname} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Firm Address</label>
                <textarea className="form-control" name="faddress" value={form.faddress} onChange={handleChange}></textarea>
              </div>
            </div>

            {/* Categories Contact Info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select className="form-select" name="categories" value={form.categories} onChange={handleChange}>
                  <option value="">-- Select Category --</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Mobile</label>
                <input type="text" className="form-control" name="mobile" value={form.mobile} onChange={handleChange} />
              </div>
            </div>

            {/* Contact Info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Registration Date</label>
                <input type="date" className="form-control" name="regdate" value={form.regdate} onChange={handleChange} />
              </div>
            </div>

            {/* Date & Password */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} />
              </div>
            </div>

            <div className="text-center mb-4 d-flex">
              <div className="col-sm-6">
              <button type="submit" className="btn btn-success btn-lg ">Update</button>
              </div>
              <div className="col-sm-6">
                  <button type="button" className="btn btn-success btn-lg ms-3" onClick={() => navigate('/Admin/view-enp')}>Cancel</button>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EntrepreneurEdit;
