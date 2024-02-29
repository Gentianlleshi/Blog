// app/components/Header.tsx
"use client";
import React, { useEffect } from "react";
import { FaUserCircle, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store"; // Adjust the import path as needed
import { setLoginState, logout } from "../redux/slices/authSlice";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // Accessing the isLoggedIn and username directly from the auth state
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");
    if (token && username) {
      dispatch(setLoginState({ isLoggedIn: true, username }));
    }
  }, [dispatch]);
  const { isLoggedIn, username } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <header className="w-full p-4 flex justify-between items-center">
      <div className="cursor-pointer">
        <FaBars onClick={() => console.log("Toggle Categories")} />
      </div>
      <Link href="/">homepage</Link>
      <div>
        {isLoggedIn ? (
          <div className="flex gap-2 cursor-pointer items-center">
            <span>{username}</span>
            <FaSignOutAlt onClick={handleLogout} title="Logout" />
          </div>
        ) : (
          <div
            onClick={() => router.push("/auth/login")}
            className="flex gap-2 items-center cursor-pointer"
          >
            <span>Login</span>
            <FaUserCircle className="h-6 w-6" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
