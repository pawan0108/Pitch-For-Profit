// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import EnpRegistration from './Authentication/EnpRegistration';
import InvestorRegistration from './Authentication/InvestorRegistration';
import Login from './Authentication/Login';
import Layout from './Pages/Layout';
import About from './Pages/AboutUs';
import InvestorView from './Investor/InvestorView';
import InvestorEdit from './Investor/InvestorEdit';
import EntrepreneurView from './Entrepreneur/EntrepreneurView';
import EntrepreneurEdit from './Entrepreneur/EntrepreneurEdit';
import AdminLayout from './Admin/AdminLayout';
import AdminDashBoard from './Admin/AdminDashBoard';
import AdminNewsEvents from './NewsEvents/AdminNewsEvents';
import InvestorLayout from './Investor/InvestorLayout';
import InvestorDashboard from './Investor/InvestorDashboard';
import InvestorProfile from './Investor/InvestorProfile';
import InvestorManage from './Admin/InvestorManage';
import EnpManage from './Admin/EnpManage';
import EntrepreneurDashboard from './Entrepreneur/EntrepreneurDashboard';
import EntrepreneurLayout from './Entrepreneur/EntrepreneurLayout';
import EntrepreneurProfile from './Entrepreneur/EntrepreneurProfile';
import MyPitches from './Entrepreneur/MyPitches';
import SubmitPitch from './Entrepreneur/SubmitPitch';
import Schedule from './Entrepreneur/Schedule';
import EntrepreneurMeetingForm from './Entrepreneur/EntrepreneurMeetingForm';
import InvestorMeeting from './Investor/InvestorMeeting';
import InvestorProfileView from './Investor/InvestorProfileView';
import AllEntrepreneursPitches from './Entrepreneur/AllEntrepreneursPitches';
import ViewSelectedEntrepreneurs from './Investor/ViewSelectedEntrepreneurs';
import EntrepreneurProfileView from './Entrepreneur/EntrepreneurProfileView';
import AdminPaymentApproval from './Subscription/AdminPaymentApproval';
import AboutUs from './Pages/AboutUs';
import FeedbackForm from './Feedback/FeedbackForm';
import NewsEventsTable from './NewsEvents/NewsEventsTable';
import Enquiries from './Admin/Enquiries';
import ShowPitchesAdmin from './Entrepreneur/ShowPitchesAdmin';
import ShowAllMeetigs from './Admin/ShowAllMeetigs';
import AdminFeedbackViewer from './Admin/AdminFeedbackViewer';

// import SubscriptionModal from './Subscription/SubscriptionModal';


function App() {
  document.body.style.zoom = "75%";
  return (
    <Router>
      <Routes>
        {/* Public Layout */}
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/EnpRegistration' element={<EnpRegistration />} />
          <Route path='/InvestorRegistration' element={<InvestorRegistration />} />
          <Route path='/Login' element={<Login />} />
          <Route path='view-enp' element={<EntrepreneurView />} />
          <Route path='/About' element={<AboutUs />} />
          {/* <Route path='/InvestorProfile' element={<InvestorProfile />} /> */}
        </Route>

        {/* Admin Layout */}
        <Route path='/Admin' element={<AdminLayout />}>
          <Route index element={<AdminDashBoard />} />
          <Route path='View' element={<InvestorView />} />
          <Route path='Edit/:id' element={<InvestorEdit />} />
          <Route path='view-enp' element={<EntrepreneurView />} />
          <Route path='edit-enp/:id' element={<EntrepreneurEdit />} />
          <Route path='add-news' element={<AdminNewsEvents />} />
          <Route path='inv-manage' element={<InvestorManage />} />
          <Route path='enp-manage' element={<EnpManage />} />
          <Route path="entrepreneur-profile/:id" element={<EntrepreneurProfileView />} />
          <Route path="investor-profile/:id" element={<InvestorProfileView />} />
          <Route path="payment-approve" element={<AdminPaymentApproval />} />
          <Route path='delete-news-event' element={<NewsEventsTable />} />
          <Route path='enquiries' element={<Enquiries />} />
          <Route path='pitches-admin' element={<ShowPitchesAdmin />} />
          <Route path='show-all-meetings' element={<ShowAllMeetigs />} />
          <Route path='view-feedbacks' element={<AdminFeedbackViewer />} />      
        </Route>

        {/* Investor Layout */}

        <Route path='/investor' element={<InvestorLayout />}>
          <Route index element={<InvestorDashboard />} />
          <Route path="investorProfile" element={<InvestorProfile />} />
          <Route path="inv-viewOnly" element={<InvestorProfileView />} />
          <Route path="inv-view" element={<InvestorMeeting />} />
          <Route path='all-enp' element={<AllEntrepreneursPitches />} />
          <Route path='selected-enp' element={<ViewSelectedEntrepreneurs />} />
          <Route path="entrepreneur-profile/:id" element={<EntrepreneurProfileView />} />
          <Route path="feedback" element={<FeedbackForm />} />
        </Route>

        {/* ENP Layout */}

        <Route path='/entrepreneur' element={<EntrepreneurLayout />}>
          <Route index element={<EntrepreneurDashboard />} />
          <Route path="enpProfile" element={<EntrepreneurProfile />} />
          <Route path="myPitchs" element={<MyPitches />} />
          <Route path="submitPitch" element={<SubmitPitch />} />
          <Route path="sed" element={<Schedule />} />
          <Route path="mform" element={<EntrepreneurMeetingForm />} />
          <Route path='investor-profile/:id' element={<InvestorProfileView />} />

          <Route path="feedback" element={<FeedbackForm />} />

        </Route>


      </Routes>
    </Router>
  );
}

export default App;
