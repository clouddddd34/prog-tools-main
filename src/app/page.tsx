"use client";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xs brightness-110 opacity-50"
        style={{ backgroundImage: "url('/background.png')" }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="bg-[#0d3b66] px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left side - Logo and University Name */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16">
                <img src="/Logo.png" alt="Veridale University" className="w-full h-full object-contain" />
              </div>

              <div className="text-white">
                <div className="text-2xl font-serif tracking-wide">
                  VERIDALE
                </div>
                <div className="text-2xl font-serif tracking-wide">
                  UNIVERSITY
                </div>
              </div>
            </div>

            {/* Right side - Login and Sign Up buttons */}
            <div className="flex items-center gap-12">
              <button
                onClick={() => router.push("/login")}
                className="text-white text-lg font-serif tracking-wider hover:text-gray-300 transition-colors"
              >
                LOGIN
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="text-white text-lg font-serif tracking-wider hover:text-gray-300 transition-colors"
              >
                SIGNUP
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content - Centered Logo */}
        <div className="flex items-center justify-center min-h-[calc(100vh-88px)] pt-8">
          <div className="w-[400px] h-[400px] relative top-[-20px] left-[-20px]">
            <img src="/LogoName.png" alt="" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;