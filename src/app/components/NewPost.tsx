// src/components/NewPost.tsx
"use client";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";

import Modal from "./Modal";
import { useAuthStore } from "@/app/stores/useAuthStore"; // Adjust the import path as needed

export default function NewPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Use Zustand to determine if the user is authenticated
  // console.log(isAuthenticated);

  return (
    <>
      {isAuthenticated && ( // Check if the user is logged in using Zustand state
        <div>
          {isModalOpen ? (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          ) : (
            // <div className="border rounded-full border-white/60 shadow-[0px_0px_30px_-5px_#000]">
            <IoIosAddCircleOutline
              className="fill-white h-10 w-10 text-[#892727] bg-black/45 rounded-full cursor-pointer fixed bottom-5 right-4"
              size={10}
              onClick={() => setIsModalOpen(true)}
            />
            // </div>
          )}
        </div>
      )}
    </>
  );
}
