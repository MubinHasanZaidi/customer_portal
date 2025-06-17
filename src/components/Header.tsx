"use client";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import logo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { CircleUserRound } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check for persisted user data on component mount
    const persistedUser = localStorage.getItem("user");
    if (persistedUser) {
      const userData = JSON.parse(persistedUser);
      if (userData && !isAuthenticated) {
        // If we have persisted user data but not authenticated, rehydrate the state
        dispatch({
          type: "auth/rehydrate",
          payload: {
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          },
        });
      }
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    // Clear persisted user data
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-transparent">
      <div className="2xl:max-w-[85vw] mx-auto px-2 sm:px-4 lg:px-6 pt-2 sm:pt-4 flex justify-between items-center">
        <Link to="/jobs" className="flex items-end lg:items-center">
          <img
            src={logo}
            alt="Dynasoft Cloud"
            className="h-8 lg:h-14 mx-auto mb-4"
          />
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-2">
                <span
                  className="text-xs text-[#222222] truncate max-w-[150px]"
                  title={`Welcome, ${user.name}`}
                >
                  Welcome,{" "}
                  <span className="font-medium text-[#0093DD]">
                    {user.name}
                  </span>
                </span>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <CircleUserRound className="w-5 h-5 rounded-full object-cover" />
                  )}
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl py-0 z-20 border border-gray-100">
                  {/* Actions */}
                  <div className="py-2">
                    <Link
                      to="/applicant-form"
                      className="block px-4 py-1 text-xs text-[#222222] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <div className="border-t border-[#E6F8FF] text-center my-1" />
                    <Link
                      to="/reset-password"
                      className="block px-4 py-1 text-xs text-[#222222] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Reset Password
                    </Link>
                    <div className="border-t border-[#E6F8FF] text-center my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-1 text-xs text-[#222222] transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to={"/auth"}
                className={`py-2 px-4 text-xs rounded-full bg-[#0093DD] text-white`}
              >
                Sign up
              </Link>
              <span className="text-xs text-[#222222]">
                Already have account?{"  "}
                <Link
                  to="/auth"
                  className="text-xs text-[#0093DD] hover:underline"
                >
                  Sign in
                </Link>
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
