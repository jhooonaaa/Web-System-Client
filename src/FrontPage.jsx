import { useState } from 'react';
import { FaSignInAlt, FaBookOpen, FaGlobe } from 'react-icons/fa';
import LoginPage from './LoginPage';

function FrontPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="w-screen h-screen flex flex-col font-serif">
      {/* Navbar */}
      <nav className="w-full flex justify-end p-4 bg-[#DDBEA9] shadow-md">
        <button
          onClick={() => setShowLogin(true)}
          className="flex items-center gap-2 bg-[#A68A64] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#8C7152] transition"
        >
          <FaSignInAlt />
          Login
        </button>
      </nav>

      {/* Page Content */}
      <div className="flex-grow flex justify-center items-center bg-gradient-to-r from-[#F2F4EE] to-[#EADCD2] transition-all">
        {showLogin ? (
          <LoginPage closeLogin={() => setShowLogin(false)} />
        ) : (
          <div className="text-center space-y-6 px-4">
            <h1 className="text-5xl font-serif font-bold text-[#6C584C] drop-shadow-sm flex justify-center items-center gap-4">
              <FaBookOpen className="text-[#A68A64]" />
              Welcome to the Online Library System
            </h1>
            <p className="text-xl text-[#7F674C] font-medium flex items-center justify-center gap-2">
              <FaGlobe className="text-[#B99B79]" />
              Explore and borrow books with ease, anytime, anywhere.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FrontPage;
