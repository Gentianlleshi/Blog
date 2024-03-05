// app/components/Header.tsx
"use client";
import React from "react";
import { FaUserCircle, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../stores/useAuthStore"; // Adjust the import path as needed

const Header = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // const username = useAuthStore((state) => state.username);
  const username = useAuthStore((state) => state.username);

  // console.log("username", username);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    // Implement the logout logic here, which should clear the HTTP-only cookie
    logout(); // Reset the auth state using Zustand
    router.push("/auth/login"); // Redirect to the login page
  };

  return (
    <header className="container p-4 flex justify-between items-center fixed top-0 bg-black/[0.2] backdrop-blur-[36px]">
      <div className="cursor-pointer">
        <FaBars onClick={() => console.log("Toggle Categories")} />
      </div>
      <Link href="/">homepage</Link>
      <div>
        {isAuthenticated ? (
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
