// app/create-post/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageId, setImageId] = useState(""); // Add state for imageId
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("No auth token found. Please login first.");
      return;
    }

    const response = await fetch("/api/newPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ title, content, imageId }), // Include imageId in the request
    });

    const responseData = await response.json();
    if (response.ok) {
      setTitle("");
      setContent("");
      setImageId(""); // Reset imageId state
      console.log("Post created", responseData);
      router.push("/");
    } else {
      console.error(
        "Failed to create post",
        responseData.message || "An error occurred"
      );
    }
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
