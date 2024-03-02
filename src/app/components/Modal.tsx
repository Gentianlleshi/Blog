// src/app/components/Modal.tsx
"use client";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setImageId } from "@/app/redux/slices/imageSlice";
import { GrSubtractCircle } from "react-icons/gr";
import { IoCameraOutline, IoImagesOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

const Modal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, uploaded, error

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Generate preview URL
      setUploadStatus("idle");
    }
  };

  const handleUploadDirectly = () => {
    // Call upload function directly if user decides not to edit
    uploadImage();
  };

  const uploadImage = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Replace with edited image file if editing is implemented

    const wpMediaUrl =
      "https://sardinie.web-devtesting.xyz/wp-json/wp/v2/media";
    const token = localStorage.getItem("authToken");

    setUploadStatus("uploading");

    try {
      const response = await fetch(wpMediaUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Disposition": `attachment; filename=${file.name}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.id) {
        dispatch(setImageId(data.id));
        setPreviewUrl(null); // Reset preview URL
        setUploadStatus("uploaded");
        console.log("File uploaded to WordPress:", data.guid.rendered);
      }
    } catch (error) {
      console.error("Error uploading file to WordPress:", error);
      setUploadStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="container p-4 fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div className="relative flex flex-col bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <GrSubtractCircle
          onClick={onClose}
          className="absolute top-4 right-4 h-6 w-6 text-red-600 cursor-pointer"
        />
        {previewUrl && (
          <div>
            <Image
              src={previewUrl}
              width={600}
              height={300}
              layout="responsive"
              className="w-full h-auto max-h-[500px] object-contain mx-auto"
              alt="Preview"
            />
            <button
              onClick={handleUploadDirectly}
              className="py-2 px-4 bg-blue-500 text-white rounded"
            >
              Upload
            </button>
          </div>
        )}
        {!previewUrl && uploadStatus !== "uploaded" && (
          <div className="flex flex-col items-center">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded mt-4"
              onClick={() => cameraInputRef.current?.click()}
            >
              <IoCameraOutline size={24} />
              Use Camera
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded mt-4"
              onClick={() => galleryInputRef.current?.click()}
            >
              <IoImagesOutline size={24} />
              Choose From Gallery
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        )}
        {uploadStatus === "uploaded" && (
          <Link
            href="/create-post"
            className="mt-4 bg-blue-500 text-white text-center py-2 px-4 rounded"
            onClick={onClose}
          >
            Next
          </Link>
        )}
        {uploadStatus === "uploading" && <p>Uploading...</p>}
        {uploadStatus === "uploaded" && (
          <p className="text-center">Image uploaded successfully!</p>
        )}
        {uploadStatus === "error" && (
          <p>Error uploading image. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
