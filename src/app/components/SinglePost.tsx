// components/SinglePost.tsx
import React from "react";
import { FaRegUser } from "react-icons/fa";

import Image from "next/image";
import CommentIcon from "./CommentIcon";

interface SinglePostProps {
  post: PostNode;
}
interface AuthorNode {
  name: string;
  // Add other author-related fields as needed
}
interface CommentNode {
  id: string;
  content: string;
  // Add other comment-related fields as needed
}

interface PostNode {
  id: string;
  title: string;
  content: string;
  author: {
    node: AuthorNode;
  };
  comments: {
    edges: {
      node: CommentNode;
    }[];
  };
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
      <h2>{post.title}</h2>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={post.title + " Post Image"}
          width={600}
          height={300}
          className="w-full h-auto max-h-[500px] object-contain"
        />
      )}
      <div className="flex gap-1"></div>
      <div>
        {post.comments.edges.map((comment) => (
          <div key={comment.node.id}>
            {/* <p>{comment.author.node.name}</p> */}
            <p dangerouslySetInnerHTML={{ __html: comment.node.content }} />
          </div>
        ))}
      </div>
      <CommentIcon postId={post.id} />
    </article>
  );
};

export default SinglePost;
