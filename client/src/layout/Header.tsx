import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useStore } from "../services/useStore";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setLogOutUser, user } = useStore(); // adjust based on your store

  const handleLogout = () => {
    navigate('/signin') 
    setLogOutUser();  

  };

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo */}
        <img
          src="../src/assets/diy-logo.png"
          className="h-10"
          alt="DIY Logo"
        />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <span className="text-sm font-medium text-gray-700">
              {user?.name || "User"}
            </span>
            <IoChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <IoMdLogOut/>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
