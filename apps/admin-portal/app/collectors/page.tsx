"use client";

import { useEffect, useState } from "react";

type Collector = {
  id: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
  createdAt?: string;
};

export default function CollectorsPage() {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCollectors = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "kabadiwala_admin_access_token"
        );

        if (!token) {
          setError("Admin session not found.");
          return;
        }

        const response = await fetch(
          "http://localhost:3001/api/admin/collectors",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError(
              "Collector API is not connected yet."
            );
            return;
          }

          if (response.status === 401) {
            setError(
              "Admin session expired. Please login again."
            );
            return;
          }

          throw new Error(
            `Request failed with status ${response.status}`
          );
        }

        const data = await response.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.collectors)
            ? data.collectors
            : [];

        setCollectors(list);
      } catch (err) {
        console.error("Collector loading error:", err);

        setError(
          "Unable to load collectors from the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCollectors();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="page">
      <style jsx>{`
        .page {
          min-height: calc(100vh - 82px);
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .title-area h2 {
          margin: 0;
          font-size: 24px;
          color: #172033;
          letter-spacing: -0.6px;
        }

        .title-area p {
          margin: 7px 0 0;
          color: #7d8992;
          font-size: 12px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .action-button {
          border: 1px solid #dfe7e3;
          background: white;
          color: #255d45;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .action-button:hover {
          background: #f3f9f5;
          border-color: #b9d9c8;
        }

        .overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 18px;
        }

        .overview-card {
          background: white;
          border: 1px solid #e7ecef;
          border-radius: 15px;
          padding: 18px;
          box-shadow: 0 3px 14px rgba(20, 35, 28, 0.025);
        }

        .overview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .overview-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #eef8f2;
          color: #278653;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .overview-value {
          margin-top: 14px;
          font-size: 24px;
          font-weight: 800;
          color: #172033;
        }

        .overview-label {
          margin-top: 3px;
          color: #697780;
          font-size: 11px;
          font-weight: 600;
        }

        .panel {
          background: white;
          border: 1px solid #e7ecef;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 3px 14px rgba(20, 35, 28, 0.025);
        }

        .panel-header {
          min-height: 64px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #edf0f2;
        }

        .panel-title h3 {
          margin: 0;
          font-size: 14px;
          color: #1c2930;
        }

        .panel-title p {
          margin: 4px 0 0;
          font-size: 10px;
          color: #8a969e;
        }

        .count {
          padding: 6px 10px;
          border-radius: 20px;
          background: #f1f7f4;
          color: #28734f;
          font-size: 10px;
          font-weight: 800;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        th {
          text-align: left;
          padding: 13px 18px;
          background: #fafcfc;
          color: #7d8991;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #edf0f2;
        }

        td {
          padding: 15px 18px;
          color: #38474f;
          font-size: 11px;
          border-bottom: 1px solid #f0f2f3;
        }

        tr:last-child td {
          border-bottom: 0;
        }

        tbody tr:hover {
          background: #fbfdfc;
        }

        .collector-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #dff5e8;
          color: #20764b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
        }

        .collector-name {
          font-weight: 750;
          color: #25333a;
        }

        .collector-id {
          margin-top: 3px;
          color: #9aa4aa;
          font-size: 9px;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 800;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .active {
          background: #eaf8ef;
          color: #23834d;
        }

        .inactive {
          background: #f8eeee;
          color: #a34a4a;
        }

        .empty-state {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 35px;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 17px;
          background: #f0f5f2;
          color: #789187;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }

        .empty-state h3 {
          margin: 14px 0 5px;
          font-size: 14px;
          color: #26353c;
        }

        .empty-state p {
          max-width: 390px;
          margin: 0;
          color: #89959d;
          font-size: 11px;
          line-height: 1.6;
        }

        .error-box {
          margin: 15px 20px 0;
          padding: 11px 13px;
          border-radius: 10px;
          background: #fff8ed;
          border: 1px solid #f3dfbb;
          color: #93611d;
          font-size: 10px;
        }

        .loading {
          padding: 60px 20px;
          text-align: center;
          color: #849199;
          font-size: 11px;
        }

        .footer-note {
          margin-top: 15px;
          color: #9aa4aa;
          font-size: 10px;
        }

        @media (max-width: 900px) {
          .overview {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
          }
        }

        @media (max-width: 600px) {
          .title-area h2 {
            font-size: 20px;
          }

          .header-actions {
            width: 100%;
          }

          .action-button {
            flex: 1;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="title-area">
          <h2>Collectors</h2>
          <p>
            Manage registered informal e-waste collectors
            and their platform activity.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="action-button"
            onClick={() => window.location.reload()}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <section className="overview">
        <article className="overview-card">
          <div className="overview-top">
            <div className="overview-icon">♙</div>
          </div>

          <div className="overview-value">
            {loading ? "—" : collectors.length}
          </div>

          <div className="overview-label">
            Total Collectors
          </div>
        </article>

        <article className="overview-card">
          <div className="overview-top">
            <div className="overview-icon">✓</div>
          </div>

          <div className="overview-value">
            {loading
              ? "—"
              : collectors.filter(
                  (collector) => collector.isActive !== false
                ).length}
          </div>

          <div className="overview-label">
            Active Accounts
          </div>
        </article>

        <article className="overview-card">
          <div className="overview-top">
            <div className="overview-icon">◷</div>
          </div>

          <div className="overview-value">
            {loading ? "—" : collectors.length}
          </div>

          <div className="overview-label">
            Registered Accounts
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h3>Registered Collectors</h3>
            <p>Collector accounts available in the system</p>
          </div>

          <span className="count">
            {loading ? "Loading" : `${collectors.length} records`}
          </span>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Loading collector records...
          </div>
        ) : collectors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♙</div>

            <h3>No collector records available</h3>

            <p>
              Collector accounts will appear here once
              they are registered and the collector API is
              connected to the admin portal.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Collector</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>

              <tbody>
                {collectors.map((collector) => {
                  const displayName =
                    collector.name?.trim() ||
                    "Unnamed Collector";

                  const initials = displayName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase();

                  const active =
                    collector.isActive !== false;

                  return (
                    <tr key={collector.id}>
                      <td>
                        <div className="collector-cell">
                          <div className="avatar">
                            {initials || "C"}
                          </div>

                          <div>
                            <div className="collector-name">
                              {displayName}
                            </div>

                            <div className="collector-id">
                              ID: {collector.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {collector.phone || "—"}
                      </td>

                      <td>
                        {collector.email || "—"}
                      </td>

                      <td>
                        <span
                          className={`status ${
                            active
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          <span className="status-dot" />
                          {active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {formatDate(collector.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="footer-note">
        Collector information is loaded from the
        Kabadiwala Connect backend.
      </div>
    </main>
  );
}