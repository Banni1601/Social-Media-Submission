import React, { useState } from 'react';
import axios from 'axios';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import './UserForm.css';

const UserForm = () => {
  const [name, setName] = useState('');
  const [socialMediaHandle, setSocialMediaHandle] = useState('');
  const [images, setImages] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [message, setMessage] = useState('Please wait, User Data is Loading');
  const [showMessage, setShowMessage] = useState(false);

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowMessage(true);
    let d = {
      name: name,
      socialMediaHandle: socialMediaHandle,
    };

    let arr = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        try {
          const data = new FormData();
          data.append('file', images[i]);
          data.append('upload_preset', 'usersImages');
          data.append('cloud_name', 'dwn5ul84h');
          const response = await fetch(
            'https://api.cloudinary.com/v1_1/dwn5ul84h/image/upload',
            {
              method: 'POST',
              body: data,
            }
          );
          const cloudData = await response.json();
          arr.push(cloudData.secure_url);
          setTrigger(true);
        } catch (error) {
          setMessage('Network Issue. Please try later.');
          console.log({ error: error.message });
        }
      }
    }

    try {
      d.images = arr;
      const response = await axios.post('http://localhost:5000/api/addUser', d);
      if (response.status === 201) {
        setMessage('User successfully added!');
        setShowMessage(true);
        //console.log(response.data);
        const interval = setInterval(() => {
          setShowMessage(false);
          setMessage('Please wait, User Data is Loading');
        }, 2000);
      } else if (response.status === 500) {
        setMessage('Server error. Please try later.');
      }

      // Reset form after successful submission
      setName('');
      setSocialMediaHandle('');
      setImages([]);
    
    } catch (error) {
      setMessage('Network Issue. Please try later.');
      console.error('Error submitting user data:', error);
    }
  };

  return (
    <div className='form-admin-div' >
      <form onSubmit={handleSubmit}>
        <label className="grey-label" htmlFor="name" >Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        
        <label className="grey-label" htmlFor="socialMediaHandle">Social Media Handle:</label>
        <input
          type="text"
          id="socialMediaHandle"
          value={socialMediaHandle}
          onChange={(e) => setSocialMediaHandle(e.target.value)}
          placeholder="Enter your social media handle"
          required
        />

        <label className="grey-label" htmlFor="photos">Upload Photos:</label>
        <input
          type="file"
          id="photos"
          onChange={handleImageChange}
          multiple
          accept="image/*"
          required
          name="Photos"
        />

        <button type="submit">Submit</button>
      </form>
      {showMessage && <h1>{message}</h1>}
      <AdminDashboard trigger={trigger} />
    </div>
  );
};

export default UserForm;
