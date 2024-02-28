// pages/api/media/[imageId].ts
import type { NextApiRequest, NextApiResponse } from "next";

// Function to get media information from WordPress
async function getMedia(imageId: string, authToken: string) {
  const url = `https://sardinie.web-devtesting.xyz/wp-json/wp/v2/media/${imageId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch image data");
  }

  return response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { imageId },
    headers: { authorization },
  } = req;

  // Extract the Bearer token from the Authorization header
  const authToken = authorization?.split(" ")[1];

  if (!authToken) {
    return res.status(401).json({ message: "Auth token is missing" });
  }

  try {
    const media = await getMedia(imageId as string, authToken);
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
