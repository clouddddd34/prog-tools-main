"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xlkxaymfdwngulocehuq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa3hheW1mZHduZ3Vsb2NlaHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDM0MzQsImV4cCI6MjA3NTU3OTQzNH0.xJAE644hF986qUFtBuafVeAA4QTlA65ZCg0K7ucZEXk";
const supabase = createClient(supabaseUrl, supabaseKey);

const CommentAnalyzer = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");

  // Comment submission state
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const storedStudentId = localStorage.getItem("student_id");
      const storedStudentName = localStorage.getItem("student_name");

      if (!storedStudentId || !storedStudentName) {
        // No credentials found, redirect to login
        router.push("/login");
        return;
      }

      // Set the student info
      setStudentId(storedStudentId);
      setStudentName(storedStudentName);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("student_id");
    localStorage.removeItem("student_name");
    router.push("/login");
  };

  // Handle Comment Submission
  const handleSubmitComment = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    // Validate comment (must be 1 sentence)
    if (!comment.trim()) {
      setSubmitError("Please enter a comment.");
      return;
    }

    const sentenceCount = comment.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    if (sentenceCount > 1) {
      setSubmitError("Only 1 sentence is allowed.");
      return;
    }

    try {
      // Perform lexical analysis
      const tokens = comment.trim().split(/\s+/);
      
      // Define positive and negative word patterns
      const positiveWords = ["good", "great", "excellent", "amazing", "wonderful", "fantastic", "awesome", "love", "best", "helpful", "nice", "perfect", "superb", "outstanding"];
      const negativeWords = ["bad", "terrible", "horrible", "worst", "awful", "poor", "hate", "useless", "disappointing", "difficult", "confusing", "boring", "unfair"];

      let sentiment = "neutral";
      let positiveCount = 0;
      let negativeCount = 0;

      // Analyze tokens
      tokens.forEach(token => {
        const lowerToken = token.toLowerCase().replace(/[^a-z]/g, '');
        if (positiveWords.includes(lowerToken)) {
          positiveCount++;
        }
        if (negativeWords.includes(lowerToken)) {
          negativeCount++;
        }
      });

      // Determine sentiment
      if (positiveCount > negativeCount) {
        sentiment = "positive";
      } else if (negativeCount > positiveCount) {
        sentiment = "negative";
      }

      // Save to database
      const { error } = await supabase.from("comments").insert([
        {
          student_id: studentId,
          student_name: studentName,
          comment: comment.trim(),
          sentiment: sentiment,
          submitted_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitSuccess("✅ Comment submitted successfully!");
      setComment("");
    } catch (err: any) {
      setSubmitError("Error submitting comment: " + err.message);
    }
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
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Comment Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Comment</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Your Comment (1 sentence only)
                </label>
                <textarea
                  placeholder="Enter your comment here..."
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setSubmitError("");
                    setSubmitSuccess("");
                  }}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>

              {submitError && (
                <p className="text-red-600 text-sm">{submitError}</p>
              )}

              {submitSuccess && (
                <p className="text-green-600 text-sm">{submitSuccess}</p>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleSubmitComment}
                  className="bg-[#0d3b66] hover:bg-[#0a2847] text-white font-semibold px-16 py-3 rounded-full transition-all"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Feedback</h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                <p className="text-gray-600 text-center">
                  {submitSuccess ? "Thank you for your feedback!" : "Your feedback will appear here after submission."}
                </p>
              </div>

              <div className="text-sm text-gray-500 mt-4">
                <p className="font-medium">Welcome, {studentName}!</p>
                <p className="mt-2">Student ID: {studentId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentAnalyzer;