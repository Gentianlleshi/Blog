// src/app/auth/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { NextPage } from "next";

// Define a type for the props expected by LoginPage
interface LoginPageProps {
  onLoginSuccess?: () => void; // Optional function prop
}

const LoginPage: NextPage<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { authToken, username }: { authToken: string; username: string } =
        await response.json();
      console.log("authToken", authToken);
      localStorage.setItem("authToken", authToken); // Optional, based on security considerations
      localStorage.setItem("username", username);

      // Only call onLoginSuccess if it's provided
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      } else {
        // If onLoginSuccess isn't provided, default to pushing to the homepage
        router.push("/");
      }
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Login failed");
    }
  };

  return (
    <div>
      <h1 className="text-center font-semibold text-3xl mt-10">Login</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col w-full p-12 mt-14 gap-8 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]"
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
