'use client'
import { useState } from "react";
import axios from "axios";
import { setToken, isAuthenticated } from "@/utils/auth";
export default function OTPForm({ email, serverUrl }) {
    const [otp, setOtp] = useState(""); // OTP state
    const [error, setError] = useState(""); // Error message state
    const [success, setSuccess] = useState(null); // Login success state

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending the data in the exact format required by the backend
            const response = await axios.put(`${serverUrl}/api/v1/admin/verifyLoginOtp`, {
                email: email.toLowerCase(), // Ensure email matches backend format
                otp: Number(otp), // OTP as a number
            });
            const token = response.data.result.token
            
            
            
            setToken(token) // Store token in localStorage
            if(isAuthenticated()){
            setSuccess("Login Successful"); // Indicate login success
            }
           
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResendOtp = async () => {
        try {
            const response = await axios.post(`${serverUrl}/api/v1/admin/resendOtp`, {
                email: email.toLowerCase(), // Ensure email matches backend format

            });
            console.log(response.data)
            setSuccess("Otp Sent Again");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">OTP</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Verify OTP
                </button>
            </form>
            <button onClick={handleResendOtp} className="text-sm ">
                Resend OTP
            </button>
        </div>

    );
}
