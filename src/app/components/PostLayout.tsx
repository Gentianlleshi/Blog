// PostLayout.tsx
"use client";
import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";
import useStore from "../stores/useStore";
import { unstable_noStore as noStore } from "next/cache";

import { PostNode } from "../types";
const PostLayout = () => {
  noStore();
  const [posts, setPosts] = useState<PostNode[]>([]);
  const postsRefreshTrigger = useStore((state) => state.postsRefreshTrigger);

  useEffect(() => {
    const fetchPosts = async () => {
      const cacheBuster = new Date().getTime();
      const response = await fetch(`/api/allPosts?_=${cacheBuster}`);
      const data = await response.json();
      setPosts(data.map(({ node }: { node: PostNode }) => node));
    };

    fetchPosts();
    // const interval = setInterval(fetchPosts, 10 * 1000); // Re-fetch every 10 seconds

    // return () => clearInterval(interval);
  }, [postsRefreshTrigger]);

  return (
    <div className="grid gap-20">
      {posts.map((post) => (
        <SinglePost key={post.id} post={post as PostNode} />
      ))}
    </div>
  );
};

export default PostLayout;
