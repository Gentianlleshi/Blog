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
