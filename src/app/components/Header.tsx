// app/components/Header.tsx
"use client";
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    if (token && username) {
      setIsLoggedIn(true);
      setUsername(username);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear user token and username from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    // Update state to reflect logout
    setIsLoggedIn(false);
    setUsername("");

    // Redirect to homepage or login page
    router.push("/auth/login");
  };

  return (
    <header className="w-full flex justify-between items-center">
      <div className="cursor-pointer">
        <FaBars onClick={() => console.log("Toggle Categories")} />
      </div>
      <Link href="/">homepage</Link>
      <div>
        {isLoggedIn ? (
          <div className="flex gap-2 cursor-pointer items-center">
            <span>{username}</span>
            <FaUserCircle />
          </div>
        ) : (
          <div
            onClick={() => router.push("/auth/login")}
            className="flex gap-2 items-center cursor-pointer"
          >
            <span>Login</span>
            <FaUserCircle className="h-6" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
