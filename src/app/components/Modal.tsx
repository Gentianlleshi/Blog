// src/app/components/Modal.tsx
"use client";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setImageId } from "@/app/redux/slices/imageSlice";
import { GrSubtractCircle } from "react-icons/gr";
import { IoCameraOutline, IoImagesOutline } from "react-icons/io5";

const Modal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const dispatch = useDispatch(); // Call useDispatch at the top level of your component

  const token = localStorage.getItem("authToken");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileSelected(true);
      const formData = new FormData();
      formData.append("file", file);

      const wpMediaUrl =
        "https://sardinie.web-devtesting.xyz/wp-json/wp/v2/media";

      try {
        const response = await fetch(wpMediaUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Disposition": "attachment; filename=" + file.name,
          },
          body: formData,
        });
        const data = await response.json();
        if (data.id) {
          dispatch(setImageId(data.id)); // Use the dispatch function here
        }
        console.log("File uploaded to WordPress:", data);
      } catch (error) {
        console.error("Error uploading file to WordPress:", error);
      }
    }
  };
  // const handleImageUploadSuccess = (uploadedImageId: string) => {
  //   dispatch(setImageId(uploadedImageId));
  // };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGalleryClick = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="container px-4 fixed bottom-0 left-0 w-full">
      <div className="grid">
        <GrSubtractCircle
          onClick={onClose}
          className="h-10 w-10 text-[#892727] cursor-pointer place-self-end"
        />
        <div className="grid divide-slate-500 divide-y">
          <button
            className="flex items-center max-h-12 gap-12 px-12 py-5"
            onClick={handleCameraClick}
          >
            <IoCameraOutline size={24} />
            <span>Use Camera</span>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e)}
            />
          </button>
          <button
            className="flex items-center max-h-12 gap-12 px-12 py-5"
            onClick={handleGalleryClick}
          >
            <IoImagesOutline size={24} />
            <span>Choose From Gallery</span>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e)}
            />
          </button>
          {fileSelected && (
            <Link
              href="/create-post"
              className="mt-4 bg-blue-500 text-white text-center py-2 px-4 rounded"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
