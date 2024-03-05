"use client";
import React, { useState } from "react";
import { BiExpandAlt } from "react-icons/bi";
import { LiaCompressSolid } from "react-icons/lia";

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <button
      onClick={handleFullscreen}
      className="border rounded-full border-white/60 shadow-[0px_0px_30px_-5px_#ae9a9a] flex"
    >
      {isFullscreen ? (
        <LiaCompressSolid className="fill-white/80 m-3" size={10} />
      ) : (
        <BiExpandAlt className="fill-white/80 m-3" size={10} />
      )}
    </button>
  );
};

export default FullscreenToggle;
