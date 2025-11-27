"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xlkxaymfdwngulocehuq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa3hheW1mZHduZ3Vsb2NlaHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDM0MzQsImV4cCI6MjA3NTU3OTQzNH0.xJAE644hF986qUFtBuafVeAA4QTlA65ZCg0K7ucZEXk";
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_ID = "99999";

const admin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Comments data
  const [allComments, setAllComments] = useState([]);
  const [positiveComments, setPositiveComments] = useState([]);
  const [negativeComments, setNegativeComments] = useState([]);
  
  // Statistics
  const [totalComments, setTotalComments] = useState(0);
  const [totalPositive, setTotalPositive] = useState(0);
  const [totalNegative, setTotalNegative] = useState(0);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const storedStudentId = localStorage.getItem("student_id");

      if (storedStudentId !== ADMIN_ID) {
        // Not admin, redirect to login
        router.push("/login");
        return;
      }

      setIsLoading(false);
      fetchComments();
    };

    checkAuth();
  }, [router]);

  // Fetch all comments from database
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setAllComments(data);
        
        // Filter positive and negative comments
        const positive = data.filter(c => c.sentiment === "positive");
        const negative = data.filter(c => c.sentiment === "negative");
        
        setPositiveComments(positive);
        setNegativeComments(negative);
        
        // Update statistics
        setTotalComments(data.length);
        setTotalPositive(positive.length);
        setTotalNegative(negative.length);
      }
    } catch (err: any) {
      console.error("Error fetching comments:", err.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("student_id");
    localStorage.removeItem("student_name");
    router.push("/login");
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-[#0d3b66] px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <img src="/Logo.png" alt="Veridale University" className="w-full h-full object-contain" />
            </div>
            <div className="text-white">
              <div className="text-xl font-serif tracking-wide">VERIDALE</div>
              <div className="text-xl font-serif tracking-wide">UNIVERSITY</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-500 font-medium transition-colors duration-300"
            >
            Logout
        </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard - Comment Analysis</h1>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Comments</h3>
            <p className="text-4xl font-bold text-[#0d3b66]">{totalComments}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Positive Feedback</h3>
            <p className="text-4xl font-bold text-green-600">{totalPositive}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Negative Feedback</h3>
            <p className="text-4xl font-bold text-red-600">{totalNegative}</p>
          </div>
        </div>

        {/* Comments Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* All Comments */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">List of Comments</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {allComments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              ) : (
                allComments.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
                    <p className="text-sm font-semibold text-gray-700">{comment.student_name}</p>
                    <p className="text-sm text-gray-600 mt-1">{comment.comment}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        comment.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                        comment.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {comment.sentiment}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Positive Feedback */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Positive Feedback</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {positiveComments.length === 0 ? (
                <p className="text-gray-500 text-sm">No positive feedback yet.</p>
              ) : (
                positiveComments.map((comment: any) => (
                  <div key={comment.id} className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm font-semibold text-gray-700">{comment.student_name}</p>
                    <p className="text-sm text-gray-600 mt-1">{comment.comment}</p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(comment.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Negative Feedback */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Negative Feedback</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {negativeComments.length === 0 ? (
                <p className="text-gray-500 text-sm">No negative feedback yet.</p>
              ) : (
                negativeComments.map((comment: any) => (
                  <div key={comment.id} className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <p className="text-sm font-semibold text-gray-700">{comment.student_name}</p>
                    <p className="text-sm text-gray-600 mt-1">{comment.comment}</p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(comment.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={fetchComments}
            className="bg-[#0d3b66] hover:bg-[#0a2847] text-white font-semibold px-8 py-3 rounded-full transition-all"
          >
            REFRESH DATA
          </button>
        </div>
      </div>
    </div>
  );
};

export default admin;