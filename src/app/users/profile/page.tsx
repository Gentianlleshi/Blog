"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch the user profile data after the page has loaded on the client side
    const fetchProfile = async () => {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    };

    fetchProfile();
  }, []);

  if (!profileData) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>{(profileData as { name: string }).name}</h1>
      <h2>user profile</h2>
    </div>
  );
}
