// PostLayout.tsx
"use client";
import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";
import { SinglePostProps } from "../types";
// Define the TypeScript interfaces based on your data structure
interface AuthorNode {
  id: string;
  name: string;
}

interface CategoryNode {
  id: string;
  slug: string;
  name: string;
}

import { PostNode } from "../types"; // Add the missing import statement
const PostLayout = () => {
  const [posts, setPosts] = useState<PostNode[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/allPosts");
      const data = await response.json(); // Assuming this directly returns the array of posts
      console.log(data);
      setPosts(data.map(({ node }: { node: PostNode }) => node)); // Update based on your data structure
    };

    fetchPosts();
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
