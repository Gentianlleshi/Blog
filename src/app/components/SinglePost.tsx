// components/SinglePost.tsx
import React from "react";
import { FaRegUser } from "react-icons/fa";
import { SinglePostProps } from "../types";

import Image from "next/image";
// import CommentIcon from "./CommentIcon";

interface AuthorNode {
  id: string;
  name: string;
}

interface CommentNode {
  id: string;
  content: string;
  author: {
    node: AuthorNode; // Not an array, assuming each comment has a single author
  };
}

interface CommentEdge {
  node: CommentNode[];
}

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
  const extractImageSrc = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const image = doc.querySelector("img");
    return image ? image.src : null;
  };
  // Extract the src URL from the post content
  const imageSrc = extractImageSrc(post.content);
  // Render the post details
  return (
    <article>
      <div className="flex gap-1 items-center">
        <FaRegUser />
        <h3>{post.author.node.name}</h3>
      </div>
      <h2 className="text-lg font-bold text-white/80">{post.title}</h2>
      <div key={post.id}>
        {imageSrc && (
          <Image
            // key={post.id}
            src={imageSrc}
            alt={post.title + " Post Image"}
            width={600}
            height={300}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg bg-black"
          />
        )}
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
  );
};

export default SinglePost;
