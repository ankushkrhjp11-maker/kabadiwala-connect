"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveAccessToken,
  saveRefreshToken,
  apiFetch,
} from "../api";

type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanPhone) {
      setError("Please enter your registered phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch<LoginResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            phone: cleanPhone,
          }),
          skipAuth: true,
        },
      );

      if (!response.accessToken) {
        throw new Error("Login succeeded but access token was not received.");
      }

      saveAccessToken(response.accessToken);

      if (response.refreshToken) {
        saveRefreshToken(response.refreshToken);
      }

      router.replace("/");
    } catch (err) {
      console.error("Recycler login failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "linear-gradient(135deg, #eefbf4 0%, #f7faf8 50%, #eaf5ef 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "38px",
          boxShadow: "0 20px 60px rgba(20, 70, 45, 0.12)",
          border: "1px solid #e3eee7",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "16px",
            background: "#159653",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            marginBottom: "20px",
          }}
        >
          ♻
        </div>

        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              color: "#159653",
            }}
          >
            KABADIWALA CONNECT
          </p>

          <h1
            style={{
              margin: "8px 0 8px",
              fontSize: "30px",
              color: "#14251c",
            }}
          >
            Recycler Portal
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718078",
              lineHeight: 1.6,
            }}
          >
            Sign in to manage e-waste lots, offers and transactions.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 700,
              color: "#25362d",
              marginBottom: "8px",
            }}
          >
            Registered Phone Number
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter registered phone number"
            maxLength={15}
            disabled={loading}
            style={{
              width: "100%",
              height: "52px",
              border: "1px solid #d8e4dc",
              borderRadius: "12px",
              padding: "0 15px",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "16px",
            }}
          />

          {error && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fff1f1",
                border: "1px solid #ffd6d6",
                color: "#c0392b",
                fontSize: "13px",
                lineHeight: 1.5,
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "52px",
              border: "none",
              borderRadius: "12px",
              background: loading ? "#83bd9e" : "#159653",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in to Portal →"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #edf1ee",
            textAlign: "center",
          }}
        >
          <small style={{ color: "#829088" }}>
            Authorized recycler access • Kabadiwala Connect
          </small>
        </div>
      </div>
    </main>
  );
}