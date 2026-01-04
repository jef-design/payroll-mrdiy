import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoMdLogOut, IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useStore } from "../services/useStore";
import axiosInstance from "../services/axiosInstance";
import { MdOutlineAccountCircle } from "react-icons/md";

const Header = () => {
  const [open, setOpen] = useState(false);       // user dropdown
  const [menuOpen, setMenuOpen] = useState(false); // slide menu
  const navigate = useNavigate();
  const { setLogOutUser, user } = useStore();

  const handleLogout = async () => {
    setLogOutUser();
    await axiosInstance.get("/employee/logout");
    navigate("/signin");
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">

          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <GiHamburgerMenu className="h-6 w-6 text-gray-700" />
            </button>

            <img
              src="../src/assets/diy-logo.png"
              className="h-9"
              alt="DIY Logo"
            />
          </div>

          {/* RIGHT: User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <MdOutlineAccountCircle  className="h-4 w-4 text-gray-500"/>
              <span className="text-sm font-medium text-gray-700">
                {user?.name || "User"}
              </span>
              <IoChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <IoMdLogOut />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= OVERLAY ================= */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ================= SLIDE MENU ================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* MENU HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-lg font-semibold text-gray-800">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-md cursor-pointer hover:bg-gray-100"
          >
            <IoMdClose className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* ================= MENU ITEMS (EDIT HERE) ================= */}
        <nav className="p-4 space-y-2">

          <MenuItem
            label="Dashboard"
            onClick={() => {
              navigate("/employee/profile");
              setMenuOpen(false);
            }}
          />

          <MenuItem
            label="Apply Leave"
            onClick={() => {
              navigate("/leave");
              setMenuOpen(false);
            }}
          />

          <MenuItem
            label="My Leave Requests"
            onClick={() => {
              navigate("/leave/history");
              setMenuOpen(false);
            }}
          />

          <MenuItem
            label="Profile"
            onClick={() => {
              navigate("/employee/profile");
              setMenuOpen(false);
            }}
          />

          {/* Divider */}
          <hr className="my-3" />

          <button
            onClick={handleLogout}
            className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
          >
            <IoMdLogOut />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Header;

/* ================= MENU ITEM COMPONENT ================= */
const MenuItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-md cursor-pointer
      text-gray-700 hover:bg-gray-100 transition"
    >
      {label}
    </button>
  );
};
