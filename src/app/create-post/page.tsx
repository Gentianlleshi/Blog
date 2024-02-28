// app/create-post/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Make sure you're using 'next/router'
import { useSelector } from "react-redux";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submission state
  const router = useRouter();

  const imageId = useSelector((state) => state.image.imageId); // Make sure the path to imageId is correct

  const handleSubmit = async (e) => {
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
        ? `<p><img src="${imageUrl}" alt="Uploaded Image" />\n${content}</p>`
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
      console.error(error.message);
    } finally {
      setIsSubmitting(false); // Re-enable the submit button upon completion
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
