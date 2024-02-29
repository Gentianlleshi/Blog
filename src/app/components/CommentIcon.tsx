// CommentIcon.tsx
import React, { useState } from "react";
import { MdAddComment } from "react-icons/md";
import LoginPage from "../auth/login/page"; // Adjust the import path as needed
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Adjust the import path as needed
// import { submitComment } from "../api/addComment/route";

interface CommentIconProps {
  postId: string; // Explicitly typing the postId
}

const CommentIcon = ({ postId }: { postId: string }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("authToken");

  const handleAddCommentClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  };

  // Example of decoding a base64-encoded WordPress post ID
  // This is conceptual and might not match your exact scenario

  const handleSubmitComment = async () => {
    if (isLoggedIn && commentContent.trim() && token) {
      try {
        const response = await fetch("/api/addComment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ postId, content: commentContent }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Comment added successfully", data);
          setCommentContent("");
        } else {
          console.error("Failed to submit comment", data.error);
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  return (
    <>
      <MdAddComment
        onClick={handleAddCommentClick}
        className="cursor-pointer"
      />
      {isLoginModalOpen && (
        <LoginPage onLoginSuccess={() => setIsLoginModalOpen(false)} />
      )}
      {isLoggedIn && (
        <div>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleSubmitComment}>Submit Comment</button>
        </div>
      )}
    </>
  );
};

export default CommentIcon;
