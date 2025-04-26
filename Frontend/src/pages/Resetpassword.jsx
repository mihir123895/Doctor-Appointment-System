import React, { useContext, useState } from 'react';
import axios from 'axios';
import './reset.css'
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';

const Resetpassword = () => {

  const {backendUrl} = useContext(AdminContext)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + '/api/v1/auth/send-reset-otp', { email });
      res.data.success ? toast.success(res.data.message) : toast.error(res.data.message);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    }
  };
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + '/api/v1/auth/reset-password', {
        email,
        otp,
        newPassword: password, // Assuming you already have a `password` state
      });
  
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(1); // Go back to step 1 or redirect user to login
        setEmail('');
        setOtp('');
        setPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP or Password');
    }
  };
  
  return (
    <div className="reset-container">
      <h2>Reset Password</h2>

      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="reset-form">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      )}
{step === 2 && (
  <form onSubmit={handleOtpSubmit} className="reset-form">
    <label>OTP:</label>
    <input
      type="text"
      placeholder="Enter 6-digit OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      maxLength="6"
      required
    />

    <label>New Password:</label>
    <input
      type="password"
      placeholder="Enter new password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button type="submit">Reset Password</button>
  </form>
)}
    
    </div>
  );
};

export default Resetpassword