// src/app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import useAuthStore from "@/app/stores/useAuthStore";
export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  // const authToken = "..."; // Retrieve your auth token as required

  const { authToken } = useAuthStore((state) => ({
    authToken: state.authToken,
  }));

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/userPosts", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const text = await response.text(); // Get response as text
        try {
          const data = JSON.parse(text); // Try parsing text as JSON
          setPosts(data.posts.nodes);
        } catch (jsonParseError) {
          console.error("Error parsing JSON:", jsonParseError);
          throw new Error("Invalid JSON response");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-4 pt-[100px] mx-auto">
      <h1>Your Posts</h1>
      {posts.map((post: { id: string; title: string }) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          {/* Implement handleDelete function to delete post */}
          {/* <button onClick={() => handleDelete(post.id)}>Delete</button> */}
        </div>
      ))}
    </div>
  );
}
