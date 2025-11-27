"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xlkxaymfdwngulocehuq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa3hheW1mZHduZ3Vsb2NlaHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDM0MzQsImV4cCI6MjA3NTU3OTQzNH0.xJAE644hF986qUFtBuafVeAA4QTlA65ZCg0K7ucZEXk";
const supabase = createClient(supabaseUrl, supabaseKey);

const Signup = () => {
  const router = useRouter();

  // JSON data states
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    email: "",
    contactNumber: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    address: "",
    course: "",
    gender: "",
    yearLevel: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({
    studentId: "",
    password: "",
    general: "",
  });

  // Filtered lists
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredBarangays, setFilteredBarangays] = useState([]);

  // Load JSON files
  useEffect(() => {
    const loadData = async () => {
      const [regionRes, provinceRes, cityRes, barangayRes] = await Promise.all([
        fetch("/data/region.json"),
        fetch("/data/province.json"),
        fetch("/data/city.json"),
        fetch("/data/barangay.json"),
      ]);

      const [regionData, provinceData, cityData, barangayData] = await Promise.all([
        regionRes.json(),
        provinceRes.json(),
        cityRes.json(),
        barangayRes.json(),
      ]);

      setRegions(regionData);
      setProvinces(provinceData);
      setCities(cityData);
      setBarangays(barangayData);
    };

    loadData();
  }, []);

  // Region → Province
  useEffect(() => {
    if (form.region) {
      setFilteredProvinces(provinces.filter((p) => p.region_code === form.region));
      setForm((prev) => ({ ...prev, province: "", city: "", barangay: "" }));
      setFilteredCities([]);
      setFilteredBarangays([]);
    }
  }, [form.region, provinces]);

  // Province → City
  useEffect(() => {
    if (form.province) {
      setFilteredCities(cities.filter((c) => c.province_code === form.province));
      setForm((prev) => ({ ...prev, city: "", barangay: "" }));
      setFilteredBarangays([]);
    }
  }, [form.province, cities]);

  // City → Barangay
  useEffect(() => {
    if (form.city) {
      setFilteredBarangays(barangays.filter((b) => b.city_code === form.city));
      setForm((prev) => ({ ...prev, barangay: "" }));
    }
  }, [form.city, barangays]);

  const handleSubmit = async () => {
    setErrors({ studentId: "", password: "", general: "" });

    // Validation
    if (!form.studentId || isNaN(Number(form.studentId))) {
      setErrors((prev) => ({ ...prev, studentId: "Please enter a valid numeric Student ID." }));
      return;
    }

    if (form.password.trim() !== form.confirmPassword.trim()) {
      setErrors((prev) => ({ ...prev, password: "Passwords do not match!" }));
      return;
    }

    try {
      const fullName = `${form.firstName} ${form.lastName}`;

      const { error } = await supabase.from("students").insert([
        {
          full_name: fullName,
          student_id: form.studentId,
          password: form.password,
          region: form.region,
          province: form.province,
          city: form.city,
          barangay: form.barangay,
          course: form.course,
          gender: form.gender,
          year_level: form.yearLevel,
          contact_number: form.contactNumber,
          address: form.address,
          email: form.email,
        },
      ]);

      if (error) throw error;

      alert("✅ Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, general: "Error creating account: " + err.message }));
    }
  };

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
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section - Create Account */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-400 mb-8">Enter your name and password to get started</p>

            <div className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  placeholder="Enter Student ID"
                  value={form.studentId}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setForm({ ...form, studentId: value });
                      setErrors({ ...errors, studentId: "" });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400"
                />
                {errors.studentId && <p className="text-red-600 text-sm mt-1">{errors.studentId}</p>}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      setErrors({ ...errors, password: "" });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={form.confirmPassword}
                    onChange={(e) => {
                      setForm({ ...form, confirmPassword: e.target.value });
                      setErrors({ ...errors, password: "" });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
              {errors.password && <p className="text-red-600 text-sm -mt-3">{errors.password}</p>}

              {/* Email & Contact Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Contact Number</label>
                  <input
                    type="text"
                    placeholder="09123456789"
                    value={form.contactNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setForm({ ...form, contactNumber: value });
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Course</label>
                <select
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900"
                >
                  <option value="" className="text-gray-400">Select Course</option>
                  <option>Bachelor of Science in Accountancy</option>
                  <option>BSBA - Financial Management & Business Analytics</option>
                  <option>BSBA - Marketing Management & Multimedia Design</option>
                  <option>BSBA - Operations & Service Management</option>
                  <option>BS Computer Science - Software Engineering</option>
                  <option>BS Computer Science - Artificial Intelligence</option>
                  <option>BS Computer Science - Data Science</option>
                  <option>BS Multimedia Arts - Animation & Digital Film</option>
                  <option>BS Information Technology - Animation & Game Development</option>
                  <option>BS Information Technology - Web & Mobile Applications</option>
                  <option>BS Information Technology - Business Analytics</option>
                  <option>BS Information Technology - Innovation & Business</option>
                  <option>BS Information Technology - Cybersecurity</option>
                  <option>BS Civil Engineering</option>
                  <option>BS Computer Engineering</option>
                  <option>BS Electrical Engineering</option>
                  <option>BS Electronics Engineering</option>
                  <option>BS Mechanical Engineering</option>
                </select>
              </div>

              {/* Gender & Year Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900"
                  >
                    <option value="" className="text-gray-400">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Year Level</label>
                  <select
                    value={form.yearLevel}
                    onChange={(e) => setForm({ ...form, yearLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900"
                  >
                    <option value="" className="text-gray-400">Select Year Level</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Address */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Your address</h2>

            <div className="space-y-6">
              {/* Region */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900"
                >
                  <option value="" className="text-gray-400">Select Region</option>
                  {regions.map((r: any) => (
                    <option key={r.region_code} value={r.region_code}>
                      {r.region_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Province */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Province</label>
                <select
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  disabled={!form.region}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                >
                  <option value="" className="text-gray-400">Select Province</option>
                  {filteredProvinces.map((p: any) => (
                    <option key={p.province_code} value={p.province_code}>
                      {p.province_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">City/Municipality</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  disabled={!form.province}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                >
                  <option value="" className="text-gray-400">Select City/Municipality</option>
                  {filteredCities.map((c: any) => (
                    <option key={c.city_code} value={c.city_code}>
                      {c.city_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Barangay */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Barangay</label>
                <select
                  value={form.barangay}
                  onChange={(e) => setForm({ ...form, barangay: e.target.value })}
                  disabled={!form.city}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                >
                  <option value="" className="text-gray-400">Select Barangay</option>
                  {filteredBarangays.map((b: any) => (
                    <option key={b.brgy_code} value={b.brgy_code}>
                      {b.brgy_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  placeholder="House No., Street, Subdivision"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3b66] text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-[#0d3b66] hover:bg-[#0a2847] text-white font-semibold px-16 py-3 rounded-full text-lg transition-all hover:shadow-lg"
          >
            SUBMIT
          </button>
        </div>

        {errors.general && (
          <p className="text-red-600 text-center mt-4">{errors.general}</p>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/login")}
            className="text-[#0d3b66] hover:underline font-medium"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;