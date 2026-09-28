"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Passport = {
  passportCode?: string;
  publicToken?: string;
  isPublic?: boolean;
  currentStage?: string;
  finalOutcome?: string | null;
};

type MaterialCategory = {
  id?: string;
  name?: string;
  slug?: string;
};

type CollectorUser = {
  id?: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
};

type CollectorProfile = {
  id?: string;
  user?: CollectorUser;
};

type Lot = {
  id: string;
  referenceId: string;
  description?: string | null;
  approximateWeight?: string | number | null;
  estimatedValueLow?: string | number | null;
  estimatedValueHigh?: string | number | null;
  valuationConfidence?: number | null;
  verificationRequired?: boolean;
  collectionTimestamp?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  materialCategory?: MaterialCategory | null;
  collector?: CollectorProfile | null;
  passport?: Passport | null;
};

function getApiUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:3001/api";
  }

  return `${window.location.protocol}//${window.location.hostname}:3001/api`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatNumber(value?: string | number | null) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return String(value);
}

function getStatusClass(status?: string) {
  switch (status) {
    case "AVAILABLE":
      return "status available";

    case "OFFER_ACCEPTED":
      return "status accepted";

    case "PICKUP_SCHEDULED":
      return "status scheduled";

    case "HANDED_OVER":
      return "status handed";

    case "CLOSED":
      return "status closed";

    case "CANCELLED":
      return "status cancelled";

    default:
      return "status draft";
  }
}

function getPassportUrl(passport?: Passport | null) {
  if (!passport?.publicToken) {
    return null;
  }

  return `/passport/${encodeURIComponent(
    passport.publicToken,
  )}`;
}

export default function LotsPage() {
  const router = useRouter();

  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // HANDOVER STATE
  // =========================================================

  const [handoverLotId, setHandoverLotId] =
    useState<string | null>(null);

  const [handoverSuccess, setHandoverSuccess] =
    useState("");

  // =========================================================
  // RECYCLER RECEIVED STATE
  // =========================================================

  const [
    recyclerReceivedLotId,
    setRecyclerReceivedLotId,
  ] = useState<string | null>(null);

  const [
    recyclerReceivedSuccess,
    setRecyclerReceivedSuccess,
  ] = useState("");

  // =========================================================
  // FETCH LOTS
  // =========================================================

  async function fetchLots(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem(
        "kabadiwala_admin_access_token",
      );

      if (!token) {
        setError(
          "Admin session not found. Please login again.",
        );

        setLots([]);
        return;
      }

      const response = await fetch(
        `${getApiUrl()}/admin/lots`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Admin session expired. Please login again.",
          );
        } else {
          setError(
            `Unable to load lots. Server returned ${response.status}.`,
          );
        }

        setLots([]);
        return;
      }

      const data = await response.json();

      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.lots)
          ? data.lots
          : [];

      setLots(rows);
    } catch (err) {
      console.error(
        "Failed to load lots:",
        err,
      );

      setError(
        "Unable to connect to the admin API.",
      );

      setLots([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // =========================================================
  // CONFIRM HANDOVER
  // =========================================================

  async function confirmHandover(lot: Lot) {
    if (!lot.id) {
      setError("Lot ID is missing.");
      return;
    }

    if (
      lot.status !== "AVAILABLE" &&
      lot.status !== "PICKUP_SCHEDULED"
    ) {
      setError(
        `This lot cannot be handed over from ${
          lot.status || "DRAFT"
        } status.`,
      );
      return;
    }

    if (
      !lot.passport?.passportCode ||
      !lot.passport?.publicToken
    ) {
      setError(
        "E-Waste Passport is not available for this lot.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Confirm handover for ${lot.referenceId}?\n\n` +
        "This will update:\n" +
        "• Lot status → HANDED_OVER\n" +
        "• Passport stage → HANDOVER_CONFIRMED\n" +
        "• Traceability timeline → HANDOVER_CONFIRMED",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setHandoverSuccess("");
      setRecyclerReceivedSuccess("");
      setHandoverLotId(lot.id);

      const token = localStorage.getItem(
        "kabadiwala_admin_access_token",
      );

      if (!token) {
        setError(
          "Admin session not found. Please login again.",
        );
        return;
      }

      const response = await fetch(
        `${getApiUrl()}/lots/${encodeURIComponent(
          lot.id,
        )}/handover`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Admin session expired. Please login again.",
          );
        } else {
          setError(
            data?.message ||
              `Handover failed. Server returned ${response.status}.`,
          );
        }

        return;
      }

      setHandoverSuccess(
        `Handover confirmed successfully for ${lot.referenceId}.`,
      );

      await fetchLots(true);
    } catch (err) {
      console.error(
        "Failed to confirm handover:",
        err,
      );

      setError(
        "Unable to connect to the handover API.",
      );
    } finally {
      setHandoverLotId(null);
    }
  }

  // =========================================================
  // CONFIRM RECEIVED BY RECYCLER
  // =========================================================

  async function confirmRecyclerReceived(lot: Lot) {
    if (!lot.id) {
      setError("Lot ID is missing.");
      return;
    }

    if (lot.status !== "HANDED_OVER") {
      setError(
        `This lot cannot be received by recycler from ${
          lot.status || "DRAFT"
        } status.`,
      );
      return;
    }

    if (
      lot.passport?.currentStage ===
      "RECEIVED_BY_RECYCLER"
    ) {
      setError(
        "This lot has already been marked as received by recycler.",
      );
      return;
    }

    if (!lot.passport?.passportCode) {
      setError(
        "E-Waste Passport is not available for this lot.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Confirm recycler receipt for ${lot.referenceId}?\n\n` +
        "This will update:\n" +
        "• Passport stage → RECEIVED_BY_RECYCLER\n" +
        "• Traceability timeline → RECEIVED_BY_RECYCLER",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setHandoverSuccess("");
      setRecyclerReceivedSuccess("");
      setRecyclerReceivedLotId(lot.id);

      const token = localStorage.getItem(
        "kabadiwala_admin_access_token",
      );

      if (!token) {
        setError(
          "Admin session not found. Please login again.",
        );
        return;
      }

      const response = await fetch(
        `${getApiUrl()}/lots/${encodeURIComponent(
          lot.id,
        )}/recycler-received`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Admin session expired. Please login again.",
          );
        } else {
          setError(
            data?.message ||
              `Recycler receipt failed. Server returned ${response.status}.`,
          );
        }

        return;
      }

      setRecyclerReceivedSuccess(
        `Recycler receipt confirmed successfully for ${lot.referenceId}.`,
      );

      await fetchLots(true);
    } catch (err) {
      console.error(
        "Failed to confirm recycler receipt:",
        err,
      );

      setError(
        "Unable to connect to the recycler receipt API.",
      );
    } finally {
      setRecyclerReceivedLotId(null);
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchLots();
  }, []);

  // =========================================================
  // STATS
  // =========================================================

  const totalLots = lots.length;

  const activeLots = useMemo(() => {
    return lots.filter(
      (lot) =>
        lot.status !== "CLOSED" &&
        lot.status !== "CANCELLED",
    ).length;
  }, [lots]);

  const valuedLots = useMemo(() => {
    return lots.filter(
      (lot) =>
        lot.estimatedValueLow !== null &&
        lot.estimatedValueLow !== undefined &&
        lot.estimatedValueHigh !== null &&
        lot.estimatedValueHigh !== undefined,
    ).length;
  }, [lots]);

  const unvaluedLots =
    totalLots - valuedLots;

  const passportCount = useMemo(() => {
    return lots.filter(
      (lot) => !!lot.passport?.publicToken,
    ).length;
  }, [lots]);

  const handedOverCount = useMemo(() => {
    return lots.filter(
      (lot) => lot.status === "HANDED_OVER",
    ).length;
  }, [lots]);

  const recyclerReceivedCount = useMemo(() => {
    return lots.filter(
      (lot) =>
        lot.passport?.currentStage ===
        "RECEIVED_BY_RECYCLER",
    ).length;
  }, [lots]);

  const materialCount = useMemo(() => {
    return new Set(
      lots
        .map(
          (lot) =>
            lot.materialCategory?.name ||
            lot.materialCategory?.id,
        )
        .filter(Boolean),
    ).size;
  }, [lots]);

  return (
    <main className="page">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #f5f7fb;
          color: #172033;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          padding: 30px 32px 50px;
          background: #f5f7fb;
        }

        .container {
          max-width: 1500px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 22px;
        }

        .title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .title-icon {
          width: 52px;
          height: 52px;
          border-radius: 15px;
          background: #eaf7ef;
          border: 1px solid #d7eee0;
          color: #278653;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
        }

        h1 {
          margin: 0;
          font-size: 26px;
          letter-spacing: -0.7px;
        }

        .subtitle {
          margin: 7px 0 0;
          color: #7c8992;
          font-size: 12px;
          line-height: 1.6;
          max-width: 720px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .button {
          border: 1px solid #dfe6e9;
          background: white;
          color: #33434a;
          border-radius: 11px;
          padding: 10px 15px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .button:hover {
          background: #f7faf8;
          border-color: #b9dcca;
        }

        .button.primary {
          color: white;
          background: #176b4f;
          border-color: #176b4f;
        }

        .button.primary:hover {
          background: #125b43;
        }

        .button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 14px;
          margin-bottom: 18px;
        }

        .stat {
          background: white;
          border: 1px solid #e7ecef;
          border-radius: 16px;
          padding: 18px;
          min-height: 122px;
          box-shadow:
            0 4px 18px rgba(20, 35, 28, 0.025);
        }

        .stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #eef8f2;
          color: #268653;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }

        .stat-value {
          margin-top: 15px;
          font-size: 24px;
          font-weight: 850;
          letter-spacing: -0.6px;
        }

        .stat-label {
          margin-top: 3px;
          color: #4a5960;
          font-size: 11px;
          font-weight: 750;
        }

        .main-card {
          background: white;
          border: 1px solid #e7ecef;
          border-radius: 18px;
          overflow: hidden;
          box-shadow:
            0 4px 18px rgba(20, 35, 28, 0.025);
        }

        .card-header {
          min-height: 68px;
          padding: 0 21px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid #edf0f2;
        }

        .card-header h2 {
          margin: 0;
          font-size: 14px;
        }

        .card-header span {
          color: #89959d;
          font-size: 10px;
        }

        .error {
          margin: 18px;
          padding: 14px 16px;
          border-radius: 12px;
          background: #fff1ef;
          border: 1px solid #ffd6d0;
          color: #9c382c;
          font-size: 12px;
          line-height: 1.5;
        }

        .success {
          margin: 18px;
          padding: 14px 16px;
          border-radius: 12px;
          background: #eaf8ef;
          border: 1px solid #c9ead5;
          color: #236a42;
          font-size: 12px;
          line-height: 1.5;
        }

        .loading {
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #71808a;
          font-size: 13px;
        }

        .empty {
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 28px;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          border-radius: 17px;
          background: #f0f5f2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #658075;
        }

        .empty h3 {
          margin: 13px 0 5px;
          font-size: 14px;
        }

        .empty p {
          margin: 0;
          color: #89959d;
          max-width: 360px;
          font-size: 11px;
          line-height: 1.6;
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1450px;
        }

        th {
          text-align: left;
          padding: 13px 16px;
          background: #fafcfc;
          border-bottom: 1px solid #edf0f2;
          color: #7f8b93;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        td {
          padding: 15px 16px;
          border-bottom: 1px solid #f0f2f3;
          vertical-align: middle;
          font-size: 12px;
        }

        tr:last-child td {
          border-bottom: 0;
        }

        tr:hover td {
          background: #fbfdfc;
        }

        .reference {
          font-family: monospace;
          font-size: 12px;
          font-weight: 800;
          color: #173f32;
        }

        .description {
          margin-top: 4px;
          max-width: 220px;
          color: #7b878e;
          line-height: 1.45;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .material {
          display: inline-flex;
          align-items: center;
          padding: 6px 9px;
          border-radius: 999px;
          background: #eef8f2;
          border: 1px solid #d7eee0;
          color: #26704a;
          font-weight: 750;
          font-size: 10px;
        }

        .collector {
          font-weight: 750;
          color: #33434a;
        }

        .muted {
          margin-top: 4px;
          color: #8b969d;
          font-size: 10px;
        }

        .value-range {
          font-weight: 750;
          color: #33434a;
          white-space: nowrap;
        }

        .status {
          display: inline-flex;
          align-items: center;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .status.draft {
          background: #f1f3f5;
          color: #64717a;
        }

        .status.available {
          background: #eaf7ef;
          color: #247247;
        }

        .status.accepted {
          background: #fff5df;
          color: #986317;
        }

        .status.scheduled {
          background: #eef4ff;
          color: #3f64a1;
        }

        .status.handed {
          background: #edeafb;
          color: #5d4fa0;
        }

        .status.closed {
          background: #e7f7ef;
          color: #1d7547;
        }

        .status.cancelled {
          background: #fff0ee;
          color: #a44237;
        }

        .passport-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 999px;
          background: #eaf7ff;
          border: 1px solid #d7eefa;
          color: #2d668c;
          font-size: 9px;
          font-weight: 850;
        }

        .passport-missing {
          color: #9aa4aa;
          font-size: 10px;
        }

        .stage-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          padding: 5px 8px;
          border-radius: 999px;
          background: #f2f7f4;
          border: 1px solid #dfece4;
          color: #45685a;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
        }

        .stage-badge.received {
          background: #e9f8ef;
          border-color: #cbe9d7;
          color: #277148;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          min-width: 340px;
        }

        .mini-button {
          border: 1px solid #dfe6e9;
          background: white;
          color: #43535b;
          border-radius: 9px;
          padding: 7px 9px;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
          white-space: nowrap;
        }

        .mini-button:hover {
          background: #f5faf7;
          border-color: #b9dcca;
          color: #196346;
        }

        .mini-button.passport {
          background: #176b4f;
          border-color: #176b4f;
          color: white;
        }

        .mini-button.passport:hover {
          background: #125b43;
        }

        .mini-button.handover {
          background: #5d4fa0;
          border-color: #5d4fa0;
          color: white;
        }

        .mini-button.handover:hover {
          background: #4d4189;
        }

        .mini-button.recycler {
          background: #287c59;
          border-color: #287c59;
          color: white;
        }

        .mini-button.recycler:hover {
          background: #206c4d;
        }

        .mini-button.done {
          background: #eef7f1;
          border-color: #cce6d5;
          color: #287148;
        }

        .mini-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .footer {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid #e5e9eb;
          display: flex;
          justify-content: space-between;
          color: #909ba2;
          font-size: 10px;
        }

        @media (max-width: 1350px) {
          .stats {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 900px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 800px) {
          .page {
            padding: 20px 15px 35px;
          }

          .header {
            flex-direction: column;
          }

          .footer {
            flex-direction: column;
            gap: 6px;
          }
        }

        @media (max-width: 520px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions .button {
            flex: 1;
          }
        }
      `}</style>

      <div className="container">

        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <header className="header">
          <div className="title-wrap">
            <div className="title-icon">
              ▣
            </div>

            <div>
              <h1>Lots & Materials</h1>

              <p className="subtitle">
                Monitor collection lots, material
                categories, valuation and E-Waste
                Passport traceability.
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="button"
              onClick={() => fetchLots(true)}
              disabled={loading || refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

            <button
              className="button primary"
              onClick={() =>
                router.push("/")
              }
            >
              ← Dashboard
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* STATS */}
        {/* ========================================================= */}

        <section className="stats">

          <article className="stat">
            <div className="stat-icon">▣</div>

            <div className="stat-value">
              {totalLots}
            </div>

            <div className="stat-label">
              Total Lots
            </div>
          </article>

          <article className="stat">
            <div className="stat-icon">◉</div>

            <div className="stat-value">
              {activeLots}
            </div>

            <div className="stat-label">
              Active Lots
            </div>
          </article>

          <article className="stat">
            <div className="stat-icon">₹</div>

            <div className="stat-value">
              {valuedLots}
            </div>

            <div className="stat-label">
              Valued Lots
            </div>
          </article>

          <article className="stat">
            <div className="stat-icon">!</div>

            <div className="stat-value">
              {unvaluedLots}
            </div>

            <div className="stat-label">
              Unvalued Lots
            </div>
          </article>

          <article className="stat">
            <div className="stat-icon">QR</div>

            <div className="stat-value">
              {passportCount}
            </div>

            <div className="stat-label">
              Passport Ready
            </div>
          </article>

          <article className="stat">
            <div className="stat-icon">✓</div>

            <div className="stat-value">
              {handedOverCount}
            </div>

            <div className="stat-label">
              Handed Over
            </div>
          </article>

          <article className="stat">
            <div className="stat-icon">♻</div>

            <div className="stat-value">
              {recyclerReceivedCount}
            </div>

            <div className="stat-label">
              Recycler Received
            </div>
          </article>

        </section>

        {/* ========================================================= */}
        {/* MAIN CARD */}
        {/* ========================================================= */}

        <section className="main-card">

          <div className="card-header">
            <div>
              <h2>E-Waste Collection Lots</h2>

              <span>
                {materialCount} material categories
                detected
              </span>
            </div>

            <span>
              Live database records
            </span>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {handoverSuccess && (
            <div className="success">
              {handoverSuccess}
            </div>
          )}

          {recyclerReceivedSuccess && (
            <div className="success">
              {recyclerReceivedSuccess}
            </div>
          )}

          {loading ? (
            <div className="loading">
              Loading lots from admin API...
            </div>
          ) : lots.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                ▣
              </div>

              <h3>No lots available</h3>

              <p>
                No collection lots were returned
                from the admin API yet.
              </p>
            </div>
          ) : (
            <div className="table-wrap">

              <table>

                <thead>
                  <tr>
                    <th>Lot</th>
                    <th>Material</th>
                    <th>Collector</th>
                    <th>Weight</th>
                    <th>Estimated Value</th>
                    <th>Status</th>
                    <th>Passport</th>
                    <th>Collection</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {lots.map((lot) => {

                    const passportUrl =
                      getPassportUrl(
                        lot.passport,
                      );

                    const collectorName =
                      lot.collector?.user?.name ||
                      "Unknown Collector";

                    const collectorPhone =
                      lot.collector?.user?.phone;

                    const valueLow =
                      lot.estimatedValueLow;

                    const valueHigh =
                      lot.estimatedValueHigh;

                    const canHandover =
                      (lot.status ===
                        "AVAILABLE" ||
                        lot.status ===
                          "PICKUP_SCHEDULED") &&
                      !!lot.passport?.passportCode &&
                      !!lot.passport?.publicToken;

                    const isHandoverLoading =
                      handoverLotId === lot.id;

                    const isRecyclerReceived =
                      lot.passport?.currentStage ===
                      "RECEIVED_BY_RECYCLER";

                    const canRecyclerReceive =
                      lot.status ===
                        "HANDED_OVER" &&
                      !isRecyclerReceived;

                    const isRecyclerReceiveLoading =
                      recyclerReceivedLotId ===
                      lot.id;

                    return (
                      <tr key={lot.id}>

                        {/* LOT */}

                        <td>
                          <div className="reference">
                            {lot.referenceId}
                          </div>

                          <div className="description">
                            {lot.description ||
                              "No description"}
                          </div>
                        </td>

                        {/* MATERIAL */}

                        <td>
                          <span className="material">
                            {lot.materialCategory
                              ?.name ||
                              "Unknown"}
                          </span>
                        </td>

                        {/* COLLECTOR */}

                        <td>
                          <div className="collector">
                            {collectorName}
                          </div>

                          {collectorPhone && (
                            <div className="muted">
                              {collectorPhone}
                            </div>
                          )}
                        </td>

                        {/* WEIGHT */}

                        <td>
                          {lot.approximateWeight
                            ? `${formatNumber(
                                lot.approximateWeight,
                              )} kg`
                            : "—"}
                        </td>

                        {/* VALUE */}

                        <td>
                          {valueLow !== undefined &&
                          valueLow !== null &&
                          valueHigh !== undefined &&
                          valueHigh !== null ? (
                            <div className="value-range">
                              ₹
                              {formatNumber(
                                valueLow,
                              )}{" "}
                              – ₹
                              {formatNumber(
                                valueHigh,
                              )}
                            </div>
                          ) : (
                            "Not valued"
                          )}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={getStatusClass(
                              lot.status,
                            )}
                          >
                            {lot.status ||
                              "DRAFT"}
                          </span>
                        </td>

                        {/* PASSPORT */}

                        <td>
                          {lot.passport
                            ?.publicToken ? (
                            <>
                              <span className="passport-badge">
                                ✓{" "}
                                {lot.passport
                                  .passportCode ||
                                  "Passport"}
                              </span>

                              {lot.passport
                                .currentStage && (
                                <div
                                  className={`stage-badge ${
                                    isRecyclerReceived
                                      ? "received"
                                      : ""
                                  }`}
                                >
                                  {isRecyclerReceived
                                    ? "♻ Recycler Received"
                                    : lot.passport
                                        .currentStage}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="passport-missing">
                              Not ready
                            </span>
                          )}
                        </td>

                        {/* COLLECTION */}

                        <td>
                          {formatDate(
                            lot.collectionTimestamp,
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="actions">

                            {/* VIEW */}

                            <button
                              className="mini-button"
                              onClick={() => {
                                if (
                                  passportUrl
                                ) {
                                  window.open(
                                    passportUrl,
                                    "_blank",
                                    "noopener,noreferrer",
                                  );
                                }
                              }}
                              disabled={
                                !passportUrl
                              }
                            >
                              View
                            </button>

                            {/* QR PASSPORT */}

                            <button
                              className="mini-button passport"
                              onClick={() => {
                                if (
                                  passportUrl
                                ) {
                                  router.push(
                                    passportUrl,
                                  );
                                }
                              }}
                              disabled={
                                !passportUrl
                              }
                            >
                              QR Passport
                            </button>

                            {/* HANDOVER */}

                            <button
                              className="mini-button handover"
                              onClick={() =>
                                confirmHandover(
                                  lot,
                                )
                              }
                              disabled={
                                !canHandover ||
                                isHandoverLoading ||
                                isRecyclerReceiveLoading
                              }
                            >
                              {isHandoverLoading
                                ? "Confirming..."
                                : lot.status ===
                                    "HANDED_OVER"
                                  ? "Handover Done"
                                  : "Confirm Handover"}
                            </button>

                            {/* RECEIVED BY RECYCLER */}

                            {lot.status ===
                              "HANDED_OVER" && (
                              <button
                                className={`mini-button ${
                                  isRecyclerReceived
                                    ? "done"
                                    : "recycler"
                                }`}
                                onClick={() =>
                                  confirmRecyclerReceived(
                                    lot,
                                  )
                                }
                                disabled={
                                  isRecyclerReceived ||
                                  isRecyclerReceiveLoading ||
                                  isHandoverLoading
                                }
                              >
                                {isRecyclerReceiveLoading
                                  ? "Updating..."
                                  : isRecyclerReceived
                                    ? "Recycler Received"
                                    : "Received by Recycler"}
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* FOOTER */}

        <footer className="footer">
          <span>
            Kabadiwala Connect • Admin Portal
          </span>

          <span>
            E-Waste Passport Traceability
          </span>
        </footer>

      </div>
    </main>
  );
}