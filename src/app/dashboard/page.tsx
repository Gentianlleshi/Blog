// src/app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useAuthStore from "@/app/stores/useAuthStore";
export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const extractImageSrc = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const image = doc.querySelector("img");
    return image ? image.src : null;
  };

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

        // Use the .json() method to directly parse the response body as JSON
        const data = await response.json();
        console.log(data);
        setPosts(data.posts.nodes);
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
    // <div className="container p-4 pt-[100px] mx-auto ">
    //   <h1>Your Posts</h1>
    //   {posts.map((post: { id: string; title: string; content: string }) => (
    //     <div key={post.id}>
    //       <h2>{post.title}</h2>
    //       <Image
    //         src={extractImageSrc(post.content) || ""}
    //         alt={post.title + " Post Image"}
    //         width={600}
    //         height={300}
    //         className="w-full h-auto max-h-[500px] object-contain rounded-lg bg-black"
    //       />
    //     </div>
    //   ))}
    // </div>
    <div className="container p-4 pt-[100px] mx-auto grid gap-20">
      {posts.map((post: { id: string; title: string; content: string }) => (
        <article key={post.id}>
          <h2 className="text-lg font-bold text-white/80 my-3">{post.title}</h2>
          <div key={post.id}>
            <Image
              // key={post.id}
              src={extractImageSrc(post.content) || ""}
              alt={post.title + " Post Image"}
              width={600}
              height={300}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg bg-black"
            />
            <div className="flex gap-1 my-2 items-center"></div>
          </div>
          {/* <div>
          {post.comments.edges.map((comment) => (
            <div key={comment.node.id} className="flex gap-1">
              <p>{comment.node.author.node.name}</p>
              <p dangerouslySetInnerHTML={{ __html: comment.node.content }} />
            </div>
          ))}
        </div>
        <CommentIcon postId={post.id} /> */}
        </article>
      ))}
    </div>
  );
}
