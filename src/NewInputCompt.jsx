import React, { useState } from 'react';
import axios from 'axios';
import './NewInputCompt.css';

function NewInputCompt() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post('http://localhost:8001/formcom/formcomregister/',data);
      console.log('Form submitted:', response);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
  };

   const submit1 = async (e) => {
    
    try {
      const response = await axios.get(`http://localhost:8001/formcom/formcomregister/?id=${2}`);
      console.log('Form submitted:', response);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">User Form</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input id="age" type="number" placeholder="Enter your age" value={formData.age} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input id="address" type="text" placeholder="Enter your address" value={formData.address} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
      <button onClick={submit1} className="submit-button">GET DATA</button>
    </div>
  );
}

export default NewInputCompt;
