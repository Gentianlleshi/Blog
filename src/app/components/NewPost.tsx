// app/components/NewPost.tsx
"use client";
import { useState, useEffect } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import Modal from "./Modal";

export default function NewPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This should be dynamically set based on your auth logic

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      {isLoggedIn && (
        <div>
          {isModalOpen ? (
            <></>
          ) : (
            <IoAddCircleOutline
              className="h-10 w-10 text-[#892727] cursor-pointer fixed bottom-5 right-5"
              onClick={() => setIsModalOpen(true)}
            />
          )}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      )}
    </>
  );
}
