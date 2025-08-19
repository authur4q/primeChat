"use client"
import React, { useState } from "react";
import styles from "./reg.module.css"
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setMessage("Registration successful!");
        setName("");
        setEmail("");
        setPassword("");
        router.push("/login")
      } else {
        const errorData = await res.json();
        setMessage(` Error: ${errorData.message || "Something went wrong"}`);
      }
    } catch (error) {
      setMessage("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
        <p className={styles.loginText}>
  Already have an account?{" "}
  <Link href="/login" className={styles.loginLink}>
    Login
  </Link>
</p>
      </form>
    </div>
  );
};

export default Register;