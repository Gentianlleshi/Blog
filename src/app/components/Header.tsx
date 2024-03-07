// app/components/Header.tsx
"use client";
import React from "react";
import { FaUserCircle, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../stores/useAuthStore"; // Adjust the import path as needed
import FullscreenToggle from "./FullscreenToggle";
import { CiHome } from "react-icons/ci";

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
    <header className="container p-4 flex justify-between items-center fixed top-0 bg-black/[0.9] backdrop-blur-[36px]">
      <div className="cursor-pointer w-1/3">
        <FullscreenToggle />
        {/* <FaBars onClick={() => console.log("Toggle Categories")} /> */}
      </div>
      <div className="w-1/3 flex justify-center">
        <Link
          href="/"
          className="border rounded-full border-white/60 shadow-[0px_0px_30px_-5px_#ae9a9a]"
        >
          <CiHome className="fill-white m-2" />
        </Link>
      </div>
      <div className="w-1/3">
        {isAuthenticated ? (
          <div className="flex gap-2 cursor-pointer items-center justify-end">
            <span className="text-white/80">{username}</span>
            <div className="border rounded-full border-white/60 shadow-[0px_0px_30px_-5px_#ae9a9a]">
              <FaSignOutAlt
                onClick={handleLogout}
                title="Logout"
                className="fill-white/90 m-2"
              />
            </div>
          </div>
        ) : (
          <div
            onClick={() => router.push("/auth/login")}
            className="flex gap-2 items-center cursor-pointer  justify-end"
          >
            <span className="text-white/80">Login</span>
            <div className="border rounded-full border-white/60 shadow-[0px_0px_30px_-5px_#ae9a9a]">
              <FaUserCircle className=" fill-white/90 m-2" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
