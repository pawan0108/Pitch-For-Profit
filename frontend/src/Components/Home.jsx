// rfce

import React from 'react'

import Quiz from './Quiz'


import { Outlet } from 'react-router-dom'
import Navbar from '../Elements/Navbar'
import Slider from './Slider'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import HowItWorks from './HowItWorks'
import Testimonials from './Testimonials'
import StatsSection from './StatsSection'
import NewsSection from './NewsSection'
import ContactForm from './ContactForm'
import FeedbackList from '../Feedback/FeedbackList'
import ViewNews from './ViewNews'
import AllFeedbacks from '../Feedback/AllFeedbacks'




function Home() {
  return (
    <>

      <div className="row">
      <Slider/>
      <Outlet />
    <div className='row' style={{ height: '730px' }}>
        <div className='col-sm-9'><HeroSection/></div>
        <div className='col-sm-3'><ViewNews/></div>
    </div>
      <AboutSection/>
      <HowItWorks/>
  <div id="feedback-section" className='row '>
  <FeedbackList />
</div>

      <StatsSection/>
{/* <NewsSection/> */}
<ContactForm/>

{/* <ViewNews/> */}

{/* <AllFeedbacks/> */}
</div>
        {/* <div className="col-sm-9">
     
          <Profile />
          
          <FreeEbook />
          <MasterClass />
          <Quiz />
          <Workshop />
          <Coaching />
          <AmazonBook />

        </div>
        <div className="col-sm-3 bg-light ">
          <h1>News</h1>
        </div> */}
   
    </>
  )
}

export default Home