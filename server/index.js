const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoURI = 'mongodb+srv://bunnyv082:FbAoulxukMcwOqaR@backenddb.ibpjj1l.mongodb.net/social-media-submission?retryWrites=true&w=majority&appName=BackendDB'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define a user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  socialMediaHandle: { type: String, required: true },
  images: { type: [String], required: true }, // Array of image paths
});

// Create a User model
const User = mongoose.model('User', userSchema);



// POST endpoint to submit user data
app.post('/api/addUser', async (req, res) => {
  try {
    const { name, socialMediaHandle, images } = req.body;
    //console.log(req.body);
    //const images = req.files.map(file => file.path); // Assuming images are stored on the server

    const newUser = new User({ name, socialMediaHandle, images });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error submitting user data:', error);
    res.status(500).json({ error: 'Internal Server Errorr' });
  }
});

// GET API for Check the Server is working or not
app.get('/', async (req, res) => {
  try {
    
    res.send('Express Server is Working...');
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}); 


// GET endpoint to fetch user data
app.get('/api/usersdata', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
    //res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// delete all users data
app.delete('/api/deleteAllUsersData', async (req, res) => {
  try {
    const users = await User.deleteMany();
    res.status(201).json({ message: 'User data Deleted successfully' });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}); 
// Start the server
const PORT =  5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
