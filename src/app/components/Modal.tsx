// src/app/components/Modal.tsx
import React, { useState, useRef } from "react";
// import { useAuthStore } from "@/app/stores/useAuthStore";
import { useImageStore } from "@/app/stores/useImageStore";
import { GrSubtractCircle } from "react-icons/gr";
import { IoCameraOutline, IoImagesOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";

const Modal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // const { authToken, setAuthToken } = useAuthStore();

  // console.log(authToken);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "uploaded" | "error"
  >("idle");
  const { setImageData } = useImageStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setUploadStatus("idle");
    }
  };
  const uploadImage = async () => {
    // Retrieve the authToken from localStorage
    const auth = localStorage.getItem("auth");
    const authParsed = auth ? JSON.parse(auth) : null;
    const authToken = authParsed ? authParsed.state.authToken : null;
    console.log("AuthToken from localStorage in Modal:", authToken);
    if (!file || !authToken) return;

    const formData = new FormData();
    formData.append("file", file);

    const wpMediaUrl =
      "https://sardinie.web-devtesting.xyz/wp-json/wp/v2/media";

    setUploadStatus("uploading");

    try {
      const response = await fetch(wpMediaUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.source_url, data.id);
        const imageId = data.id; // Replace with actual data field names
        const imageUrl = data.source_url; // Replace with actual data field names
        setImageData(imageId, imageUrl);
        setUploadStatus("uploaded");

        isOpen = false;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="container p-4 fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center">
      <div className="relative flex flex-col bg-black/80 rounded-lg shadow-lg p-6 w-full max-w-lg">
        <GrSubtractCircle
          onClick={onClose}
          size={8}
          className="absolute h-[25px] w-[25px] top-4 right-4 cursor-pointer fill-white/80  bg-black/45 rounded-full"
        />
        {previewUrl && (
          <div className="grid">
            <Image
              src={previewUrl}
              width={600}
              height={300}
              layout="responsive"
              className="w-full h-auto max-h-[500px] object-contain mx-auto"
              alt="Preview"
            />
            {uploadStatus !== "uploaded" && (
              <button
                onClick={uploadImage}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded mt-4 justify-center"
              >
                Upload
              </button>
            )}
          </div>
        )}
        {!previewUrl && uploadStatus !== "uploaded" && (
          <div className="flex flex-col items-center">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded mt-4"
              onClick={() => cameraInputRef.current?.click()}
            >
              <IoCameraOutline size={24} />
              Use Camera
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded mt-4"
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
