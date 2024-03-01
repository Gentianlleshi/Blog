// PostLayout.tsx
"use client";
import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";

import { PostNode } from "../types";
const PostLayout = () => {
  const [posts, setPosts] = useState<PostNode[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/allPosts");
      const data = await response.json();
      console.log(response);
      console.log(data);
      setPosts(data.map(({ node }: { node: PostNode }) => node));
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 10 * 1000); // Re-fetch every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <SinglePost key={post.id} post={post as PostNode} />
      ))}
    </div>
  );
};

export default PostLayout;
