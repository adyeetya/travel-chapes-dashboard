'use client'
import { useState } from "react";
import axios from "axios";

export default function LoginForm({ setStep, setEmail, serverUrl }) {
  const [email, setLocalEmail] = useState(""); // Local email state
  const [password, setPassword] = useState(""); // Local password state
  const [error, setError] = useState(""); // Error message state
// '/api/v1/admin/loginOtp'
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending the data in the exact format required by the backend
      const response = await axios.post(`${serverUrl}/api/v1/admin/loginOtp`, {
        email: email.toLowerCase(), // Convert email to lowercase
        password, // Include password
      });
      console.log('res', response)
      setEmail(email); // Store email for OTP verification
      setStep("otp"); // Move to OTP step
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };
 

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setLocalEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Send OTP
      </button>
    </form>
  );
}
