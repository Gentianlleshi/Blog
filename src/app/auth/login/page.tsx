// src/app/auth/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import Link from "next/link";
import { useAuthStore } from "@/app/stores/useAuthStore"; // Adjust the path as necessary

import { jwtDecode } from "jwt-decode";
interface JWTPayload {
  data: {
    user: {
      id: string;
    };
  };
  // ... any other properties you expect in the payload
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { setAuthToken } = useAuthStore();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const jsonResponse = await response.json();

    const authToken = jsonResponse.authToken;

    // Decode the JWT to get the user ID
    const decodedToken = jwtDecode<JWTPayload>(authToken); // Use type assertion here
    const userId = decodedToken.data.user.id;

    if (response.ok) {
      useAuthStore.getState().setCredentials(username, authToken, userId);
      console.log(
        "Login successful",
        // username,
        // authToken,
        userId
      );
      router.push("/"); // Redirect
    } else {
      // Handle error
    }

    // Later in the application, retrieving the authToken
    // const authToken = useAuthStore((state) => state.authToken); // From Zustand
    // console.log("Retrieved authToken from Zustand:", authToken);

    const storedToken = localStorage.getItem("authToken"); // From localStorage
    console.log("Retrieved authToken from localStorage:", storedToken);
  };

  return (
    <div className="pt-[100px] h-screen">
      <h1 className="text-center font-semibold text-3xl pt-10">Login</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col w-full p-12 mt-14 gap-8 shadow-[rgba(17, 17, 26, 0.1) 0px 0px 16px]"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-left">Don't have an account? </p>
        <div className="flex justify-between">
          <div className="register-button">
            <Link href="/auth/register">Register</Link>
          </div>
          <button type="submit">Login</button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
