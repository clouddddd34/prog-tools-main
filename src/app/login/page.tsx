"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xlkxaymfdwngulocehuq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa3hheW1mZHduZ3Vsb2NlaHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDM0MzQsImV4cCI6MjA3NTU3OTQzNH0.xJAE644hF986qUFtBuafVeAA4QTlA65ZCg0K7ucZEXk";
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_ID = "99999"; // Admin's special student ID
const ADMIN_PASSWORD = "admin123"; // Admin's password

const Login = () => {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!studentId || isNaN(Number(studentId))) {
      setError("Please enter a valid numeric Student ID.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // Check if it's admin login
    if (studentId === ADMIN_ID && password === ADMIN_PASSWORD) {
      localStorage.setItem("student_id", ADMIN_ID);
      localStorage.setItem("student_name", "Admin");
      router.push("/admin");
      return;
    }

    // Regular student login
    try {
      const { data, error: loginError } = await supabase
        .from("students")
        .select("*")
        .eq("student_id", studentId.trim())
        .eq("password", password)
        .maybeSingle();

      if (loginError) throw loginError;

      if (!data) {
        setError("Invalid Student ID or Password.");
      } else {
        // Store student info in localStorage for student page to access
        localStorage.setItem("student_id", data.student_id);
        localStorage.setItem("student_name", data.full_name);
        
        // Redirect to student page
        router.push("/student");
      }
    } catch (err: any) {
      setError("Error logging in: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2342] to-[#1c3a6b] flex items-center justify-center p-4 relative">
      {/* Faded overlay */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>

      <div className="glass-card relative bg-white/85 backdrop-blur-xl rounded-[3rem] md:rounded-[3rem_1.5rem_3rem_1.5rem] shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden border border-white/30">
        {/* Left Section - Image */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative items-center justify-center"
          style={{ backgroundImage: "url('/student_stock.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#0a2342]/50"></div>
          <div className="relative text-center px-10 z-10">
            <h2 className="text-white text-3xl font-serif font-semibold mb-3">
              Welcome to Veridale
            </h2>
            <p className="text-gray-200 text-sm leading-relaxed">
              Your journey to excellence begins here.
            </p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-12">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/LogoName.png"
              alt="Veridale University Logo"
              className="w-80 mb-4"
            />

            <h1 className="text-4xl font-semibold text-[#0a2342] tracking-wide mb-1">
              Student Login
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in with your student credentials
            </p>
          </div>

          <div>
            <div className="mb-5">
              <label htmlFor="studentId" className="block text-gray-700 font-medium mb-2">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setStudentId(value);
                    setError("");
                  }
                }}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a2342] bg-white/80 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a2342] bg-white/80 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-[#0a2342] hover:bg-[#0c2e5b] text-white font-semibold py-3 rounded-xl shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg"
            >
              Log In
            </button>
          </div>

          <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
            <button
              onClick={() => router.push("/signup")}
              className="text-[#0a2342] hover:underline font-medium"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;