'use client'
import { useState } from "react";
import LoginForm from "./LoginForm";
import OTPForm from "./OTPForm";


export default function LoginPage() {
  const [step, setStep] = useState("login"); // Tracks login or OTP step
  const [email, setEmail] = useState(""); // Stores email entered during login
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

console.log('server', serverUrl)
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {step === "login" ? (
          <LoginForm setStep={setStep} setEmail={setEmail} serverUrl={serverUrl}/>
        ) : (
          <OTPForm email={email} serverUrl={serverUrl}/>
        )}
      </div>
    </div>
  );
}
