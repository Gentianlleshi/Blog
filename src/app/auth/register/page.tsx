// app/auth/register/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  const registerUser = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      setIsRegistered(true); // Set the flag when registration is successful
    } else {
      const errorData = await response.json();
      setError(errorData.message || "An error occurred during registration.");
    }
  };

  // Redirect after registration
  useEffect(() => {
    // Now we can safely use router.push or other router methods here
    if (isRegistered) {
      router.push("/auth/login");
    }
  }, [isRegistered]);

  return (
    <div className="form-wrapper mt-[56px]">
      <h1 className="text-center font-semibold text-3xl pt-10">Register</h1>
      <form
        onSubmit={registerUser}
        className="flex flex-col w-full p-12 mt-14 gap-8 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]"
      >
        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-left">Already have an account? </p>
        <div className="flex justify-between">
          <div className="login-button">
            <Link href="/auth/login" className="">
              Login
            </Link>
          </div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
