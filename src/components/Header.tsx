"use client";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ChevronDown, CircleUserRound } from "lucide-react";
import useCustomerConfig from "../hooks/useCustomerConfig";
import { generateImageUrl } from "../utils/common";
import { themeImages } from "../data/mockData";

const Header = ({ isBack = false }: { isBack?: boolean }) => {
  const { customerConfig, userConfig, setUserConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for persisted user data on component mount
    let access = localStorage.getItem("access");
    let refresh = localStorage.getItem("refresh");
    if (userConfig && access && refresh) {
      dispatch({
        type: "auth/rehydrate",
        payload: {
          user: userConfig,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      });
    }
  }, [dispatch, userConfig]);

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
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUserConfig(null);
    setIsDropdownOpen(false);
    navigate("/auth");
  };

  return (
    <header className="bg-transparent">
      <div className="mx-auto px-4 sm:px-4 lg:px-6 py-2 sm:py-4 grid grid-cols-5 justify-between items-center">
        <div
          className="flex items-end lg:items-center cursor-pointer"
          onClick={() => {
            // window.location.href = "/tickets";
            navigate("/tickets");
          }}
        >
          <img
            src={themeImages["logo"]}
            alt={""}
            className="h-8 lg:h-12 m-auto"
          />
          <div className="w-[1px] h-8 lg:h-12 bg-black"></div>
        </div>
        <div className="flex items-center">
          {isBack && (
            <div data-title={"Go Back"} className="w-fit px-1">
              <ArrowLeft
                onClick={() => navigate("/tickets")}
                className="w-5 h-5 text-black cursor-pointer"
              />
            </div>
          )}
          <h2 className=" px-2 text-xs md:text-xl font-medium capitalize text-[#222222]">
            {customer?.Customer?.customerName}
          </h2>
        </div>
        <div className="col-span-3 flex justify-end items-center space-x-2 md:space-x-4 ">
          {userConfig ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-2">
                <span
                  className="text-xs text-[#222222] truncate "
                  title={`Welcome to Customer Portal, ${userConfig?.firstName}`}
                >
                  Welcome,{" "}
                  <span
                    style={{ color: customer?.primary_color }}
                    className={`font-bold `}
                  >
                    {userConfig?.firstName} {userConfig?.middleName}{" "}
                    {userConfig?.lastName}
                  </span>
                </span>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {userConfig?.profile_image ? (
                    <>
                      <img
                        src={userConfig?.profile_image}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-black"
                      />
                      <ChevronDown className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <CircleUserRound className="w-5 h-5 rounded-full object-cover stroke-[1.2]" />
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl py-0 z-20 border border-gray-100">
                  {/* Actions */}
                  <div className="py-2">
                    <div
                      style={{ borderColor: customer?.secondary_color }}
                      className={`border-t text-center my-1`}
                    />
                    <Link
                      to="/reset-password"
                      className="block px-4 py-1 text-xs text-[#222222] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Reset Password
                    </Link>
                    <div
                      style={{ borderColor: customer?.secondary_color }}
                      className={`border-t  text-center my-1`}
                    />
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
            <div className="flex flex-row  gap-1 justify-center items-center space-x-2">
              <Link
                to={"/auth"}
                style={{ background: customer?.primary_color }}
                className={`py-2 px-4 text-xs rounded-full text-white`}
              >
                Sign up
              </Link>
              <span className="text-xs text-[#222222]">
                <span className="max-sm:hidden">Already have an account?</span>
                {"  "}
                <Link
                  to="/auth"
                  style={{ color: customer?.primary_color }}
                  className={`text-xs hover:underline`}
                >
                  Sign in
                </Link>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
