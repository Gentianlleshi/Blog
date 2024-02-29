// CommentIcon.tsx
import React, { useState } from "react";
import { MdAddComment } from "react-icons/md";
import LoginPage from "../auth/login/page"; // Adjust the import path as needed
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Adjust the import path as needed
import { submitComment } from "../api/addComment/route";

interface CommentIconProps {
  postId: string; // Explicitly typing the postId
}

const CommentIcon: React.FC<CommentIconProps> = ({ postId }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [writeComment, setWriteComment] = useState(false);
  // Use isLoggedIn from auth state instead of token
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");

  const handleAddCommentClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      // User is authenticated, proceed with adding a comment
      setWriteComment(true);
    }
  };

  // Example of decoding a base64-encoded WordPress post ID
  // This is conceptual and might not match your exact scenario

  const handleSubmitComment = async () => {
    if (isLoggedIn && commentContent.trim()) {
      // Correctly calling decodePostId to convert from base64 to numeric ID
      const numericPostId = decodePostId(postId);
      if (numericPostId && token) {
        try {
          // Make sure to pass numericPostId to submitComment, not the encoded postId
          const responseData = await submitComment({
            postId: numericPostId.toString(), // Ensure this is what your backend expects
            content: commentContent,
            token: token,
          });
          console.log("Decoded Post ID:", numericPostId); // Log the decoded numeric ID
          console.log("Comment added successfully:", responseData);
          setCommentContent("");
        } catch (error) {
          console.error("Failed to submit comment:", error);
        }
      }
    }
  };

  return (
    <>
      <MdAddComment
        onClick={handleAddCommentClick}
        className="cursor-pointer"
      />
      {isLoggedIn && writeComment && (
        <div>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleSubmitComment}>Submit Comment</button>
        </div>
      )}
      {isLoginModalOpen && (
        <div className="fixed top-0 left-0 bg-black w-screen h-screen flex justify-center items-center">
          <div className="w-80 h-[30rem] backdrop-blur-xl bg-white/30 rounded-2xl">
            <LoginPage onLoginSuccess={() => setIsLoginModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default CommentIcon;

function decodePostId(encodedId: string): number | null {
  try {
    const decodedString = atob(encodedId); // Decode from Base64
    const parts = decodedString.split(":");
    if (parts.length > 1 && !isNaN(parseInt(parts[1], 10))) {
      return parseInt(parts[1], 10); // Extract and return the numeric ID part
    }
  } catch (error) {
    console.error("Error decoding post ID:", error);
  }
  return null;
}
