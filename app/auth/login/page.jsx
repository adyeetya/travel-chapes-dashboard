'use client'
import { useState } from "react";
import LoginForm from "./LoginForm";
import OTPForm from "./OTPForm";
import { ServerUrl } from "@/app/config";

export default function LoginPage() {
  const [step, setStep] = useState("login"); // Tracks login or OTP step
  const [email, setEmail] = useState(""); // Stores email entered during login


// console.log('server', serverUrl)
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {step === "login" ? (
          <LoginForm setStep={setStep} setEmail={setEmail} serverUrl={ServerUrl}/>
        ) : (
          <OTPForm email={email} serverUrl={ServerUrl}/>
        )}
      </div>
    </div>
  );
}
