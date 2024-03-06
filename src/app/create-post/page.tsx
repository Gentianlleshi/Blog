// src/app/create-post/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import Image from "next/image";
import { useImageStore } from "@/app/stores/useImageStore";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useStore } from "@/app/stores/useStore";

export default function CreatePostPage() {
  const { imageUrl, imageId } = useImageStore();
  const { isAuthenticated, authToken } = useAuthStore(); // Retrieve authToken along with isAuthenticated
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { triggerPostsRefresh } = useStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!isAuthenticated) {
      console.error("Not logged in. Redirecting to login page.");
      router.push("/login");
      triggerPostsRefresh();
      setIsSubmitting(false);
      return;
    }

    // Now use authToken from useAuthStore instead of localStorage
    if (!authToken) {
      console.error("Auth token is missing. Please login again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/newPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use the authToken directly from the store
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          content,
          imageId, // Ensure imageId is passed for image handling
        }),
        cache: "no-cache",
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Post created successfully", responseData);
        setTitle("");
        setContent("");
        triggerPostsRefresh();
        router.push("/"); // Redirect to home or another page as needed
        triggerPostsRefresh();
      } else {
        throw new Error(responseData.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="pt-[100px] container p-4">
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
            <Image
              src={imageUrl}
              alt="Uploaded"
              width={600}
              height={300}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
