"use client";
import { useRouter } from "next/navigation";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Homepage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-[#092c4f] px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left side - Logo and University Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <img src="/Logo.png" alt="Veridale University" className="w-full h-full object-contain" />
            </div>

            <div className="text-white">
              <div className={`${cinzel.className} text-xl tracking-wide`}>
                VERIDALE
              </div>
              <div className={`${cinzel.className} text-xl tracking-wide`}>
                UNIVERSITY
              </div>
            </div>
          </div>

          {/* Right side - Login and Sign Up buttons */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => router.push("/login")}
              className={`${cinzel.className} text-white text-sm tracking-wider hover:text-gray-500 transition-colors`}
            >
              LOGIN
            </button>

            <button
              onClick={() => router.push("/signup")}
              className={`${cinzel.className} text-white text-sm tracking-wider hover:text-gray-500 transition-colors`}
            >
              SIGN UP
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered Logo */}
      <div className="flex items-center justify-center pt-12">
        <div className="w-[500px] h-[500px]">
          <img src="/LogoName.png" alt="" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
