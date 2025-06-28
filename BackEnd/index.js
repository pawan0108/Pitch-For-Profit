const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const enpRouter = require('./Routes/enpRouter');
const investorRouter = require('./Routes/investorRouter');
const newsRouter = require('./Routes/newsRouter');        // News API route
const eventRouter = require('./Routes/eventRouter');     // Events API route
const adminRouter = require('./Routes/adminRouter');
const paymentRouter = require('./Routes/paymentRouter');
const path = require('path');                             // 🔧 REQUIRED for file path resolution
const meetingRoutes = require('./Routes/meetingRoutes'); // adjust path if needed
const contactRouter = require('./Routes/contactRouter');

// const fileUpload = require('express-fileupload');

const app = express();
const port = 8000;

mongoose.connect('mongodb+srv://pawanmaurya979452:Pawan%401999@cluster0.bdx1flu.mongodb.net/PitchForProfit');
console.log("MongoDB Connected");

app.use(cors());
app.use(express.json());

// app.use(fileUpload({
//     useTempFiles:true
// }))

//Entrepreneur Router
app.use('/entrepreneur', enpRouter);

app.use('/api/enp', enpRouter);   
//Investor Router
app.use('/investor', investorRouter);

// Serve static files (images)
app.use('/uploads', express.static('uploads'));


// API routes for News and Events
app.use('/api/add-news', newsRouter);   // News route
app.use('/api/events', eventRouter); // Events route


app.use('/admin', adminRouter);

app.use('/api/admin', adminRouter);

// Submit Pitches

const pitchRouter = require('./Routes/pitchRouter'); 
app.use('/pitches', pitchRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Metting
// app.use('/api/investor', require('./Routes/investorRouter'));
app.use('/api', require('./Routes/meetingRoutes'));

app.use('/api/meetings', meetingRoutes);

//Investoment 
const investmentRouter = require('./Routes/investmentRouter');
app.use('/investments', investmentRouter);

// app.use('/api', pitchRouter);

// Payment

app.use('/api/payment', paymentRouter); 



app.use('/api', pitchRouter);


app.use('/api/pitches', pitchRouter);
app.use('/api/meetings', meetingRoutes);

// Feedback
const feedbackRouter = require('./Routes/feedbackRouter');
app.use('/feedback', feedbackRouter)
app.use("/api/feedback", feedbackRouter);

app.use('/api/contact', contactRouter);

app.listen(port, ()=>{
    console.log(`Server Running on ${port}`);
});