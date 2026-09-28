"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setError("Please enter your admin email or phone.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/admin/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: cleanIdentifier,
            password,
          }),
        },
      );

      let data: {
        accessToken?: string;
        user?: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          role?: string;
        };
        message?: string | string[];
      } = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response received from admin server.");
      }

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;

        throw new Error(
          message || "Invalid email/phone or password.",
        );
      }

      if (!data.accessToken) {
        throw new Error(
          "Authentication token was not returned by the server.",
        );
      }

      localStorage.setItem(
        "kabadiwala_admin_access_token",
        data.accessToken,
      );

      if (data.user) {
        localStorage.setItem(
          "kabadiwala_admin_user",
          JSON.stringify(data.user),
        );
      }

      window.location.href = "/";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect to admin server.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #f4f7f5;
          color: #172033;
        }

        button,
        input {
          font: inherit;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 10% 15%,
              rgba(56, 161, 105, 0.09),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 85%,
              rgba(16, 37, 29, 0.08),
              transparent 30%
            ),
            #f4f7f5;
        }

        .background-circle {
          position: absolute;
          width: 420px;
          height: 420px;
          border: 1px solid rgba(31, 93, 67, 0.07);
          border-radius: 50%;
          right: -180px;
          top: -170px;
        }

        .background-circle.two {
          width: 280px;
          height: 280px;
          left: -130px;
          bottom: -130px;
          right: auto;
          top: auto;
        }

        .login-card {
          width: 100%;
          max-width: 920px;
          min-height: 570px;
          background: white;
          border: 1px solid #e4eae7;
          border-radius: 24px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          box-shadow: 0 24px 70px rgba(18, 43, 31, 0.11);
          position: relative;
          z-index: 2;
        }

        .brand-panel {
          background: linear-gradient(145deg, #10251d, #20553e);
          color: white;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .brand-panel::before {
          content: "";
          position: absolute;
          width: 330px;
          height: 330px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          right: -160px;
          top: -100px;
        }

        .brand-panel::after {
          content: "";
          position: absolute;
          width: 210px;
          height: 210px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 50%;
          left: -130px;
          bottom: -100px;
        }

        .brand-content {
          position: relative;
          z-index: 2;
        }

        .logo {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: #38a169;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 27px;
          font-weight: 850;
          box-shadow: 0 12px 30px rgba(56, 161, 105, 0.28);
        }

        .brand-name {
          margin-top: 20px;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .brand-label {
          margin-top: 5px;
          color: #a9c2b6;
          font-size: 12px;
        }

        .brand-heading {
          margin-top: 75px;
          max-width: 350px;
          font-size: 31px;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .brand-description {
          margin-top: 15px;
          max-width: 370px;
          color: #bdd2c8;
          font-size: 13px;
          line-height: 1.7;
        }

        .features {
          margin-top: 27px;
          display: grid;
          gap: 12px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #d7e7e0;
          font-size: 11px;
        }

        .feature-icon {
          width: 27px;
          height: 27px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.09);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7ee2a8;
          font-weight: 800;
        }

        .brand-footer {
          position: relative;
          z-index: 2;
          color: #8fa99d;
          font-size: 10px;
        }

        .form-panel {
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .mobile-logo {
          display: none;
        }

        .form-heading h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.7px;
        }

        .form-heading p {
          margin: 8px 0 0;
          color: #7c8991;
          font-size: 12px;
          line-height: 1.5;
        }

        .secure-badge {
          margin-top: 25px;
          width: fit-content;
          padding: 7px 10px;
          border-radius: 20px;
          background: #eef8f2;
          color: #277c50;
          font-size: 10px;
          font-weight: 750;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .secure-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #35a567;
        }

        .login-form {
          margin-top: 26px;
        }

        .field {
          margin-bottom: 17px;
        }

        .field-label {
          display: block;
          margin-bottom: 7px;
          color: #33414a;
          font-size: 11px;
          font-weight: 700;
        }

        .input-wrap {
          position: relative;
        }

        .input {
          width: 100%;
          height: 46px;
          border: 1px solid #dfe6e3;
          border-radius: 10px;
          outline: none;
          padding: 0 13px;
          color: #1d2931;
          background: #fbfcfc;
          font-size: 12px;
          transition: 0.18s ease;
        }

        .input.password {
          padding-right: 68px;
        }

        .input:focus {
          border-color: #45a875;
          background: white;
          box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #6d7a82;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
        }

        .error {
          margin-bottom: 16px;
          padding: 11px 12px;
          border-radius: 9px;
          background: #fff4f3;
          border: 1px solid #f4d2ce;
          color: #a43d35;
          font-size: 10px;
          line-height: 1.5;
        }

        .login-button {
          width: 100%;
          height: 47px;
          border: 0;
          border-radius: 10px;
          background: #237c4d;
          color: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 750;
          box-shadow: 0 8px 20px rgba(35, 124, 77, 0.18);
          transition: 0.18s ease;
        }

        .login-button:hover:not(:disabled) {
          background: #1c693f;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-note {
          margin-top: 20px;
          padding: 12px;
          border-radius: 10px;
          background: #f7f9f8;
          border: 1px solid #e8edeb;
          color: #7a878e;
          font-size: 10px;
          line-height: 1.5;
          text-align: center;
        }

        .bottom-text {
          margin-top: 25px;
          text-align: center;
          color: #9aa4aa;
          font-size: 9px;
        }

        @media (max-width: 760px) {
          .login-page {
            padding: 15px;
          }

          .login-card {
            max-width: 470px;
            min-height: auto;
            display: block;
            border-radius: 19px;
          }

          .brand-panel {
            display: none;
          }

          .mobile-logo {
            display: flex;
            width: 50px;
            height: 50px;
            border-radius: 14px;
            background: #38a169;
            color: white;
            align-items: center;
            justify-content: center;
            font-size: 25px;
            font-weight: 850;
            margin-bottom: 22px;
          }

          .form-panel {
            padding: 32px 25px;
          }

          .form-heading h1 {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="background-circle" />
      <div className="background-circle two" />

      <section className="login-card">
        <div className="brand-panel">
          <div className="brand-content">
            <div className="logo">K</div>

            <div className="brand-name">
              Kabadiwala Connect
            </div>

            <div className="brand-label">
              Administration Portal
            </div>

            <div className="brand-heading">
              Manage the complete recycling network.
            </div>

            <div className="brand-description">
              A centralized control center for collectors,
              authorized recyclers, materials, transactions,
              AI verification and platform operations.
            </div>

            <div className="features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>
                  Centralized platform management
                </span>
              </div>

              <div className="feature">
                <span className="feature-icon">♻</span>
                <span>
                  Recycler authorization & monitoring
                </span>
              </div>

              <div className="feature">
                <span className="feature-icon">✦</span>
                <span>
                  AI verification oversight
                </span>
              </div>
            </div>
          </div>

          <div className="brand-footer">
            Kabadiwala Connect • Secure Administration
          </div>
        </div>

        <div className="form-panel">
          <div className="mobile-logo">K</div>

          <div className="form-heading">
            <h1>Welcome back</h1>

            <p>
              Sign in to access the Kabadiwala Connect
              administration center.
            </p>
          </div>

          <div className="secure-badge">
            <span className="secure-dot" />
            Protected administrator access
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="field">
              <label
                className="field-label"
                htmlFor="identifier"
              >
                Admin Email or Phone
              </label>

              <input
                id="identifier"
                type="text"
                className="input"
                placeholder="Enter admin email or phone"
                value={identifier}
                onChange={(event) =>
                  setIdentifier(event.target.value)
                }
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label
                className="field-label"
                htmlFor="password"
              >
                Password
              </label>

              <div className="input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  disabled={loading}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Checking access..."
                : "Sign in to Admin Portal"}
            </button>
          </form>

          <div className="login-note">
            Your credentials are verified securely by the
            Kabadiwala Connect backend.
          </div>

          <div className="bottom-text">
            Authorized administrators only
          </div>
        </div>
      </section>
    </main>
  );
}