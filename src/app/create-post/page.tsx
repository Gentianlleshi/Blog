// src/app/create-post/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const imageId = useSelector((state: RootState) => state.image.imageId);

  // Fetch the image URL when the component mounts and the imageId is available
  useEffect(() => {
    const fetchImageUrl = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken && imageId) {
        const mediaUrl = `https://sardinie.web-devtesting.xyz/wp-json/wp/v2/media/${imageId}`;
        try {
          const response = await fetch(mediaUrl, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch image data");
          }
          const mediaData = await response.json();
          setImageUrl(mediaData.source_url);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
    };

    fetchImageUrl();
  }, [imageId]);

  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new window.Image(); // Use window.Image to access the global Image constructor

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };

      img.src = imageUrl;
    }
  }, [imageUrl]);

  const editImageOnServer = async () => {
    try {
      // Convert the image URL to a Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Send the image to the server for processing
      const editResponse = await fetch("/api/editImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: JSON.stringify({ buffer: buffer }),
      });

      if (editResponse.ok) {
        // Convert the response back to a Blob
        const editedBlob = await editResponse.blob();
        // Create a URL for the edited image Blob
        const editedImageUrl = URL.createObjectURL(editedBlob);
        // Update your state or UI with the edited image URL
        setImageUrl(editedImageUrl);
      } else {
        console.error("Failed to edit image");
      }
    } catch (error) {
      console.error("Error while editing image:", error);
    }
  };

  const startEditing = () => {
    setEditing(true);
    // Initialize your image editing library with the imageRef and imageUrl
  };

  const saveEdit = () => {
    // Save the edited image data
    setEditing(false);
    // You would typically extract the image data from your library and set it to state or upload it
  };

  const resetEdit = () => {
    // Reset the image editing library to the original imageUrl
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Prevent further submits

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("No auth token found. Please login first.");
      setIsSubmitting(false); // Allow retrying if there's no token
      return;
    }

    const mediaUrl = `https://sardinie.web-devtesting.xyz/wp-json/wp/v2/media/${imageId}`;
    try {
      const mediaResponse = await fetch(mediaUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!mediaResponse.ok) {
        throw new Error("Failed to fetch image data");
      }

      const mediaData = await mediaResponse.json();
      const imageUrl = mediaData.source_url;

      const contentWithImage = imageUrl
        ? `<img src="${imageUrl}" alt="Uploaded Image" />`
        : content;

      const response = await fetch("/api/newPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title, content: contentWithImage }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      console.log("Post created successfully");
      setTitle("");
      setContent("");
      router.push("/"); // Redirect to the desired page
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // Re-enable the submit button upon completion
    }
  };

  return (
    <div className="mt-[56px] container p-4">
      <h1 className="text-center font-semibold text-3xl pt-10">
        Create a New Post
      </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-300 rounded p-2"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {imageUrl && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Preview:</h2>
          <div className="border rounded p-4 mt-2">
            <p className="mt-2">{title || "Post title will appear here"}</p>
            {editing ? (
              <>
                <Image
                  src={imageUrl}
                  alt="Uploaded"
                  width={600}
                  height={300}
                  layout="responsive"
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </>
            ) : (
              <canvas ref={canvasRef} width={600} height={400} />
            )}
          </div>
          <div>
            <button onClick={startEditing} className="your-button-styles">
              {!editing ? "Edit" : ""}
            </button>
            {editing && (
              <div className="flex gap-1">
                <button onClick={saveEdit}>Save</button>
                <button onClick={resetEdit}>Reset</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
