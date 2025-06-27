import React from 'react';
import img1 from '../assets/img/s1.png';
import img2 from '../assets/img/s2.png';
import img3 from '../assets/img/s3.png';
import img4 from '../assets/img/s4.png';
import img5 from '../assets/img/s5.png';
import img6 from '../assets/img/s6.png';
import '../assets/css/Slider.css'; // Make sure this CSS file includes .carousel-img

function Slider() {
  return (
    <div id="carouselExampleControls" className="carousel slide slider-h" data-bs-ride="carousel">
      <div className="carousel-inner image-container">
        <div className="carousel-item active">
          <img src={img1} className="d-block w-100 carousel-img slider-img " alt="..." />
        </div>
        <div className="carousel-item">
          <img src={img2} className="d-block w-100 carousel-img slider-img" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={img3} className="d-block w-100 carousel-img slider-img" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={img4} className="d-block w-100 carousel-img slider-img" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={img5} className="d-block w-100 carousel-img slider-img" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={img6} className="d-block w-100 carousel-img slider-img" alt="..." />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Slider;
