import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/css/EnpRegistration.css'; // 🔥 Custom styles scoped to this page only

function EnpRegistration() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [fname, setFname] = useState("");
  const [faddress, setFaddress] = useState("");
  const [categories, setCategories] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [regdate, setRegdate] = useState("");
  const [password, setPassword] = useState("");

  var EnpData = async (e) => {
    e.preventDefault();
    // ✅ Basic validation
    if (!name || !gender || !address || !country || !state || !city || !fname || !faddress || !categories || !mobile || !email || !regdate || !password) {
      alert("All fields are required.");
      return;
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Enter a valid email address.");
      return;
    }

    // ✅ Mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      alert("Enter a valid 10-digit mobile number.");
      return;
    }

    var user = { name, gender, address, country, state, city, fname, faddress, categories, mobile, email, regdate, password };
    console.log(user);
    await axios.post('http://localhost:8000/api/enp', user);
    alert("Registration successful!");

      // 👇 Redirect to login
    navigate('/login');

    // Reset form
    setName("");
    setGender("");
    setAddress("");
    setCountry("");
    setState("");
    setCity("");
    setFname("");
    setFaddress("");
    setCategories("");
    setMobile("");
    setEmail("");
    setRegdate("");
    setPassword("");
  };

  return (
    <>
      <div className="enp-page">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <motion.form
              method='post'
              onSubmit={EnpData}
              className="enp-form fs-5 rounded-4 shadow-lg"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-center mb-4">Entrepreneur Registration</h2>

              {/* Row 1 */}
              <div className="row mb-3 mt-5">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" value={name} id="name" onChange={(e) => { setName(e.target.value) }} placeholder="Enter your name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <div className='fs-6'>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="gender" value='Male' onChange={(e) => { setGender(e.target.value) }} id="male" />
                      <label className="form-check-label" htmlFor="male">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="gender" value='Female' onChange={(e) => { setGender(e.target.value) }} id="female" />
                      <label className="form-check-label" htmlFor="female">Female</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="address" className="form-label">Address</label>
                  <textarea className="form-control" id="address" rows="2" value={address} onChange={(e) => { setAddress(e.target.value) }} placeholder="Enter your address"></textarea>
                </div>
                <div className="col-md-6">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input type="text" className="form-control" id="country" value={country} onChange={(e) => { setCountry(e.target.value) }} placeholder="Enter country" />
                </div>
              </div>

              {/* Row 3 */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="state" className="form-label">State</label>
                  <input type="text" className="form-control" id="state" value={state} onChange={(e) => { setState(e.target.value) }} placeholder="Enter state" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">City</label>
                  <input type="text" className="form-control" id="city" value={city} onChange={(e) => { setCity(e.target.value) }} placeholder="Enter city" />
                </div>
              </div>

              {/* Row 4 */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="firmName" className="form-label">Firm Name</label>
                  <input type="text" className="form-control" id="firmName" value={fname} onChange={(e) => { setFname(e.target.value) }} placeholder="Enter firm name" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="firmAddress" className="form-label">Firm Address</label>
                  <textarea className="form-control" id="firmAddress" rows="2" value={faddress} onChange={(e) => { setFaddress(e.target.value) }} placeholder="Enter firm address"></textarea>
                </div>
              </div>

              {/* Row 5 */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="categories" className="form-label">Categories</label>
                  <select className="form-select" id="categories" value={categories} onChange={(e) => setCategories(e.target.value)}>
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
                  <label htmlFor="contactNo" className="form-label">Contact No. </label>
                  <input type="tel" className="form-control" id="contactNo" value={mobile} onChange={(e) => { setMobile(e.target.value) }} placeholder="Enter contact number" />
                </div>
              </div>

              {/* Row 6 */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter email address" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="regDate" className="form-label">Registration Date</label>
                  <input type="date" className="form-control" value={regdate} onChange={(e) => { setRegdate(e.target.value) }} id="regDate" />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                </div>
              </div>

              {/* Buttons */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success btn-lg">Register</button>
                  </div>
                </div>
                <div className="col-sm-6 register">
                  <div className="d-grid">
                    <button type="reset" className="btn btn-success btn-lg"
                      onClick={() => {
                        setName("");
                        setGender("");
                        setAddress("");
                        setCountry("");
                        setState("");
                        setCity("");
                        setFname("");
                        setFaddress("");
                        setMobile("");
                        setEmail("");
                        setRegdate("");
                        setPassword("");
                      }}
                    >Reset</button>
                  </div>
                </div>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EnpRegistration;
