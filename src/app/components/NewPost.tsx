// src/components/NewPost.tsx
"use client";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
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
            <IoAddCircleOutline
              className="h-10 w-10 text-[#892727] cursor-pointer fixed bottom-5 right-5"
              onClick={() => setIsModalOpen(true)}
            />
          )}
        </div>
      )}
    </>
  );
}
