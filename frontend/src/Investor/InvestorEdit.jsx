import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Admin/Sidebar';
import Topbar from '../Admin/Topbar';

function InvestorEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [form, setForm] = useState({
      name: "",
      gender: "",
      address: "",
      country: "",
      state: "",
      city: "",
      fname: "",
      faddress: "",
      categories: "",
      mobile: "",
      email: "",
      regdate: "",
      password: "",
    });
  
    useEffect(() => {
      axios.get(`http://localhost:8000/investor/${id}`)
        .then((res) => {
          const data = res.data;
          data.regdate = data.regdate?.split('T')[0];
          setForm(data);
        })
        .catch((err) => console.error("Error loading investor:", err));
    }, [id]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(`http://localhost:8000/investor/${id}`, form);
        alert("Investor updated successfully!");
        navigate("/Admin/view");
      } catch (err) {
        console.error("Update failed:", err);
      }
    };
  
    return (
      <>
   
      <div className="container-fluid" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-12">
        
            <form method='post' onSubmit={handleSubmit} className="p-5 bg-white rounded shadow-sm fs-5 rounded-4 shadow-lg mt-3">
            <h2 className="text-center mb-4 ">Edit Investor</h2>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <div className='fs-6'>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={handleChange} />
                      <label className="form-check-label">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={handleChange} />
                      <label className="form-check-label">Female</label>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" name="address" value={form.address} onChange={handleChange}></textarea>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Country</label>
                  <input type="text" className="form-control" name="country" value={form.country} onChange={handleChange} />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <input type="text" className="form-control" name="state" value={form.state} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Firm Name</label>
                  <input type="text" className="form-control" name="fname" value={form.fname} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Firm Address</label>
                  <textarea className="form-control" name="faddress" value={form.faddress} onChange={handleChange}></textarea>
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Categories</label>
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
                  <label className="form-label">Contact No.</label>
                  <input type="text" className="form-control" name="mobile" value={form.mobile} onChange={handleChange} />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Registration Date</label>
                  <input type="date" className="form-control" name="regdate" value={form.regdate} onChange={handleChange} />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} />
                </div>
              </div>
  
              <div className="row">
                <div className="col-sm-6">
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success btn-lg" >Update</button>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-grid">
                    <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/Admin/view')}>Cancel</button>
                  </div>
                </div>
              </div>
  
            </form>
          </div>
        </div>
      </div>
      </>
    );
  }


export default InvestorEdit