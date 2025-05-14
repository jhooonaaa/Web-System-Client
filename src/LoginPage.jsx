import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaKey, FaUserPlus, FaSignInAlt, FaUserEdit } from "react-icons/fa";

function LoginPage({ closeLogin }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
        adminCode,
      });

      if (response.data.success) {
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('username', response.data.username);

        if (response.data.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/borrower');
        }
      } else {
        setShowError(true);
        setErrorMessage(response.data.message || 'Invalid credentials, please try again');
      }
    } catch (err) {
      console.error('Login error:', err);
      setShowError(true);
      setErrorMessage('An error occurred, please try again');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/register', {
        username,
        password,
        full_name: fullName
      });

      if (response.data.success) {
        setIsRegistering(false);
        setShowError(false);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setShowError(false);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[#F2F4EE] to-[#EADCD2] px-4">
      <div className="w-full max-w-sm bg-white p-6 gap-6 rounded-3xl shadow-xl border-4 border-[#DDBEA9] relative">

        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 text-[#A68A64] hover:text-red-500 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h1 className="text-3xl sm:text-4xl text-center font-serif font-bold text-[#6C584C] mb-4">
          {isRegistering ? "Register" : "Login"}
        </h1>

        {showError && (
          <div className="bg-red-400 text-white p-3 rounded-lg font-medium shadow-md mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col mb-4">
          <label htmlFor="username" className="text-[#6C584C] font-medium flex items-center gap-2">
            <FaUser /> Username:
          </label>
          <input
            type="text"
            className="outline-none border-2 border-[#A68A64] p-3 rounded-lg focus:ring-2 focus:ring-[#6C584C] bg-[#F2F4EE]"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="text-[#6C584C] font-medium flex items-center gap-2">
            <FaLock /> Password:
          </label>
          <input
            type="password"
            className="outline-none border-2 border-[#A68A64] p-3 rounded-lg focus:ring-2 focus:ring-[#6C584C] bg-[#F2F4EE]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {!isRegistering && (
          <div className="flex flex-col mb-4">
            <label htmlFor="adminCode" className="text-[#6C584C] font-medium flex items-center gap-2">
              <FaKey /> Admin Code:
            </label>
            <input
              type="password"
              className="outline-none border-2 border-[#A68A64] p-3 rounded-lg focus:ring-2 focus:ring-[#6C584C] bg-[#F2F4EE]"
              onChange={(e) => setAdminCode(e.target.value)}
            />
          </div>
        )}

        {isRegistering && (
          <div className="flex flex-col mb-4">
            <label htmlFor="fullName" className="text-[#6C584C] font-medium flex items-center gap-2">
              <FaUserPlus /> Full Name:
            </label>
            <input
              type="text"
              className="outline-none border-2 border-[#A68A64] p-3 rounded-lg focus:ring-2 focus:ring-[#6C584C] bg-[#F2F4EE]"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <button
          type="button"
          onClick={isRegistering ? handleRegister : handleLogin}
          className="w-full bg-[#A68A64] text-white py-3 font-medium text-xl rounded-lg shadow-md hover:bg-red-500 transition duration-300 flex justify-center items-center gap-2"
        >
          {isRegistering ? <FaUserEdit /> : <FaSignInAlt />}
          {isRegistering ? "Register" : "Login"}
        </button>

        <p className="text-[#6C584C] font-medium text-center mt-4">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button onClick={toggleMode} className="underline font-semibold hover:text-red-500">
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button onClick={toggleMode} className="underline font-semibold hover:text-red-500">
                Register
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
