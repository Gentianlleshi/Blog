// src/app/create-post/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import from 'next/router'
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
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
    <div className="mt-[56px]">
      <h1>Create a New Post</h1>
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
        <div className="p-4 mt-[56px]">
          <h2 className="text-lg font-semibold">Preview:</h2>
          <article>
            <h2 className="mt-2">{title || "Post title will appear here"}</h2>
            <div className="">
              <Image
                src={imageUrl}
                alt="Uploaded"
                width={600}
                height={300}
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
