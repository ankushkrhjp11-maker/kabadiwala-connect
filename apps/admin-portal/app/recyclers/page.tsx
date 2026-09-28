"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSection from "../../components/AdminSection";

type RecyclerUser = {
  id: string;
  name: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type Recycler = {
  id: string;
  authorizationStatus?: string;
  createdAt?: string;
  user?: RecyclerUser;
  [key: string]: unknown;
};

const API_URL = "http://localhost:3001/api";

export default function RecyclersPage() {
  const [recyclers, setRecyclers] = useState<Recycler[]>([]);
  const [pendingRecyclers, setPendingRecyclers] = useState<
    Recycler[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRecyclers() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "kabadiwala_admin_access_token",
      );

      if (!token) {
        throw new Error("Admin session not found.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [allResponse, pendingResponse] =
        await Promise.all([
          fetch(`${API_URL}/admin/recyclers`, {
            headers,
          }),
          fetch(`${API_URL}/admin/recyclers/pending`, {
            headers,
          }),
        ]);

      if (!allResponse.ok) {
        throw new Error(
          `Recycler directory request failed (${allResponse.status}).`,
        );
      }

      if (!pendingResponse.ok) {
        throw new Error(
          `Pending recycler request failed (${pendingResponse.status}).`,
        );
      }

      const allData = await allResponse.json();
      const pendingData = await pendingResponse.json();

      setRecyclers(
        Array.isArray(allData) ? allData : [],
      );

      setPendingRecyclers(
        Array.isArray(pendingData)
          ? pendingData
          : [],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load recycler data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecyclers();
  }, []);

  const verifiedCount = useMemo(
    () =>
      recyclers.filter(
        (item) =>
          item.authorizationStatus === "VERIFIED",
      ).length,
    [recyclers],
  );

  const pendingCount = pendingRecyclers.length;

  const activeCount = useMemo(
    () =>
      recyclers.filter(
        (item) => item.user?.isActive === true,
      ).length,
    [recyclers],
  );

  return (
    <AdminSection
      title="Authorized Recyclers"
      icon="♻"
      badge="Recycler Network"
      subtitle="Manage registered recycling facilities, authorization status and operational activity."
      stats={[
        {
          label: "Authorized Recyclers",
          value: loading ? "Loading..." : String(verifiedCount),
          icon: "♻",
          description: "Verified recycling partners",
        },
        {
          label: "Pending Verification",
          value: loading ? "Loading..." : String(pendingCount),
          icon: "◌",
          description: "Applications awaiting review",
        },
        {
          label: "Active Facilities",
          value: loading ? "Loading..." : String(activeCount),
          icon: "●",
          description: "Currently active recycler accounts",
        },
        {
          label: "Total Registered",
          value: loading ? "Loading..." : String(recyclers.length),
          icon: "▦",
          description: "All recycler records",
        },
      ]}
      actions={[
        {
          label: "Recycler Directory",
          icon: "♻",
          description:
            "Browse all registered authorized recycling facilities.",
        },
        {
          label: "Verify Recycler",
          icon: "✓",
          description:
            "Review pending recycler applications and authorization status.",
        },
        {
          label: "Material Acceptance",
          icon: "◫",
          description:
            "Review accepted e-waste material information.",
        },
        {
          label: "Pickup Coverage",
          icon: "⌖",
          description:
            "Monitor operational recycler coverage.",
        },
      ]}
    >
      <div className="recycler-content">
        <div className="section-head">
          <div>
            <h3>Recycler Directory</h3>
            <p>
              Live records loaded from the Kabadiwala Connect
              backend.
            </p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={fetchRecyclers}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          recyclers.length === 0 && (
            <div className="empty-box">
              No recycler records found in the database.
            </div>
          )}

        <div className="recycler-grid">
          {recyclers.map((recycler) => {
            const status =
              recycler.authorizationStatus ??
              "UNKNOWN";

            return (
              <article
                className="recycler-card"
                key={recycler.id}
              >
                <div className="card-top">
                  <div className="recycler-avatar">
                    {recycler.user?.name
                      ?.charAt(0)
                      ?.toUpperCase() ?? "R"}
                  </div>

                  <span
                    className={`status status-${status.toLowerCase()}`}
                  >
                    {status}
                  </span>
                </div>

                <h4>
                  {recycler.user?.name ??
                    "Unnamed Recycler"}
                </h4>

                <p className="phone">
                  {recycler.user?.phone ??
                    "Phone unavailable"}
                </p>

                <div className="details">
                  <div>
                    <span>Recycler ID</span>
                    <strong>
                      {recycler.id}
                    </strong>
                  </div>

                  <div>
                    <span>Account</span>
                    <strong>
                      {recycler.user?.isActive
                        ? "Active"
                        : "Inactive"}
                    </strong>
                  </div>

                  <div>
                    <span>Registered</span>
                    <strong>
                      {recycler.createdAt
                        ? new Date(
                            recycler.createdAt,
                          ).toLocaleDateString(
                            "en-IN",
                          )
                        : "—"}
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .recycler-content {
          margin-top: 28px;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .section-head h3 {
          margin: 0;
          font-size: 17px;
          color: #193328;
        }

        .section-head p {
          margin: 5px 0 0;
          color: #7d8b84;
          font-size: 11px;
        }

        .refresh-button {
          border: 1px solid #d8e5de;
          background: #ffffff;
          color: #246b4a;
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-box {
          padding: 13px 15px;
          border-radius: 10px;
          background: #fff5f4;
          border: 1px solid #f1d1cd;
          color: #a4463e;
          font-size: 11px;
          margin-bottom: 18px;
        }

        .empty-box {
          padding: 30px;
          text-align: center;
          border: 1px dashed #d9e3de;
          border-radius: 14px;
          color: #7f8b85;
          background: #fbfcfb;
          font-size: 12px;
        }

        .recycler-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(245px, 1fr)
          );
          gap: 16px;
        }

        .recycler-card {
          background: #ffffff;
          border: 1px solid #e5ece8;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 8px 24px rgba(24, 55, 41, 0.05);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .recycler-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eaf6ef;
          color: #237c4d;
          font-weight: 800;
          font-size: 16px;
        }

        .status {
          border-radius: 999px;
          padding: 5px 9px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.3px;
        }

        .status-verified {
          background: #eaf8ef;
          color: #247447;
        }

        .status-pending {
          background: #fff7df;
          color: #9a7416;
        }

        .status-rejected {
          background: #fff0ee;
          color: #a84940;
        }

        .status-unknown {
          background: #f0f2f2;
          color: #6d7774;
        }

        .recycler-card h4 {
          margin: 0;
          font-size: 15px;
          color: #193328;
        }

        .phone {
          margin: 5px 0 16px;
          color: #7a8781;
          font-size: 11px;
        }

        .details {
          display: grid;
          gap: 10px;
        }

        .details div {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-top: 9px;
          border-top: 1px solid #edf1ef;
        }

        .details span {
          color: #8a9691;
          font-size: 9px;
        }

        .details strong {
          color: #35463e;
          font-size: 10px;
          font-weight: 700;
          word-break: break-word;
        }

        @media (max-width: 700px) {
          .section-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .refresh-button {
            width: 100%;
          }
        }
      `}</style>
    </AdminSection>
  );
}