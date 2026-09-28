"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSection from "../../components/AdminSection";

type MaterialCategory = {
  id?: string;
  name?: string;
  code?: string;
  description?: string | null;
  isActive?: boolean;
  [key: string]: unknown;
};

type PriceRecord = {
  id: string;
  location?: string;
  buyingPrice?: string | number | null;
  unit?: string | null;
  marketMin?: string | number | null;
  marketMax?: string | number | null;
  offeredPrice?: string | number | null;
  effectiveDate?: string | null;
  source?: string | null;
  createdAt?: string;
  updatedAt?: string;
  materialCategory?: MaterialCategory | null;
  [key: string]: unknown;
};

const API_URL = "http://localhost:3001/api";

function numberValue(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function formatMoney(value?: string | number | null) {
  const amount = numberValue(value);

  if (amount === null) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatUnit(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value.replaceAll("_", " ");
}

export default function PriceBoardPage() {
  const [records, setRecords] = useState<PriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPriceBoard() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "kabadiwala_admin_access_token",
      );

      if (!token) {
        throw new Error("Admin session not found.");
      }

      const response = await fetch(
        `${API_URL}/admin/price-board`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let data: unknown = null;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from admin server.",
        );
      }

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data
            ? (data as { message?: unknown }).message
            : undefined;

        throw new Error(
          Array.isArray(message)
            ? message.join(", ")
            : typeof message === "string"
              ? message
              : `Unable to load price board (${response.status}).`,
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid price board response from server.",
        );
      }

      setRecords(data as PriceRecord[]);
    } catch (err) {
      setRecords([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load price board data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPriceBoard();
  }, []);

  const categoryCount = useMemo(() => {
    const categories = new Set(
      records
        .map(
          (record) =>
            record.materialCategory?.id ??
            record.materialCategory?.name ??
            record.materialCategory?.code,
        )
        .filter(Boolean),
    );

    return categories.size;
  }, [records]);

  const locationCount = useMemo(() => {
    const locations = new Set(
      records
        .map((record) => record.location?.trim())
        .filter(Boolean),
    );

    return locations.size;
  }, [records]);

  const latestUpdateCount = useMemo(() => {
    if (records.length === 0) {
      return 0;
    }

    const latestDate = records
      .map((record) =>
        record.updatedAt
          ? new Date(record.updatedAt).getTime()
          : 0,
      )
      .sort((a, b) => b - a)[0];

    if (!latestDate) {
      return 0;
    }

    const latestDay = new Date(latestDate);
    const today = new Date();

    const sameDay =
      latestDay.getFullYear() === today.getFullYear() &&
      latestDay.getMonth() === today.getMonth() &&
      latestDay.getDate() === today.getDate();

    return sameDay ? 1 : 0;
  }, [records]);

  return (
    <AdminSection
      title="Price Board"
      icon="₹"
      badge="Market Pricing"
      subtitle="Live market price records used for valuation reference, recycler offers and e-waste pricing decisions."
      stats={[
        {
          label: "Price Records",
          value: loading ? "Loading..." : String(records.length),
          icon: "₹",
          description: "Stored market price records",
        },
        {
          label: "Material Categories",
          value: loading ? "Loading..." : String(categoryCount),
          icon: "◇",
          description: "Categories represented in pricing data",
        },
        {
          label: "Market Locations",
          value: loading ? "Loading..." : String(locationCount),
          icon: "⌖",
          description: "Locations represented in dataset",
        },
        {
          label: "Latest Updates",
          value: loading ? "Loading..." : String(latestUpdateCount),
          icon: "↻",
          description: "Updated records from today",
        },
      ]}
      actions={[
        {
          label: "Current Prices",
          icon: "₹",
          description:
            "Review current buying and market reference prices.",
        },
        {
          label: "Add Price Record",
          icon: "+",
          description:
            "Create a verified market price entry.",
        },
        {
          label: "Historical Prices",
          icon: "◷",
          description:
            "Review historical pricing records and trends.",
        },
        {
          label: "Price Validation",
          icon: "✓",
          description:
            "Identify unusual or inconsistent market prices.",
        },
      ]}
    >
      <div className="price-content">
        <div className="toolbar">
          <div>
            <h3>Live Price Dataset</h3>
            <p>
              Records are loaded directly from the Kabadiwala Connect
              database.
            </p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={fetchPriceBoard}
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
          records.length === 0 && (
            <div className="empty-box">
              No price records are available in the database yet.
            </div>
          )}

        <div className="price-grid">
          {records.map((record) => {
            const category =
              record.materialCategory?.name ??
              record.materialCategory?.code ??
              "Uncategorized";

            return (
              <article
                className="price-card"
                key={record.id}
              >
                <div className="card-top">
                  <div>
                    <span className="category-label">
                      MATERIAL CATEGORY
                    </span>

                    <h4>{category}</h4>
                  </div>

                  <span className="unit-badge">
                    {formatUnit(record.unit)}
                  </span>
                </div>

                <div className="location">
                  ⌖ {record.location || "Location not specified"}
                </div>

                <div className="price-row">
                  <div className="price-block">
                    <span>Buying Price</span>
                    <strong>
                      {formatMoney(record.buyingPrice)}
                    </strong>
                  </div>

                  <div className="price-block">
                    <span>Offered Price</span>
                    <strong>
                      {formatMoney(record.offeredPrice)}
                    </strong>
                  </div>
                </div>

                <div className="market-range">
                  <div>
                    <span>Market Minimum</span>
                    <strong>
                      {formatMoney(record.marketMin)}
                    </strong>
                  </div>

                  <div>
                    <span>Market Maximum</span>
                    <strong>
                      {formatMoney(record.marketMax)}
                    </strong>
                  </div>
                </div>

                <div className="record-footer">
                  <div>
                    <span>Effective Date</span>
                    <strong>
                      {formatDate(record.effectiveDate)}
                    </strong>
                  </div>

                  <div>
                    <span>Source</span>
                    <strong>
                      {record.source || "Not specified"}
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .price-content {
          margin-top: 28px;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .toolbar h3 {
          margin: 0;
          font-size: 17px;
          color: #193328;
        }

        .toolbar p {
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
          margin-bottom: 18px;
          border: 1px solid #f1d1cd;
          border-radius: 10px;
          background: #fff5f4;
          color: #a4463e;
          font-size: 11px;
        }

        .empty-box {
          padding: 30px;
          text-align: center;
          border: 1px dashed #d9e3de;
          border-radius: 14px;
          background: #fbfcfb;
          color: #7f8b85;
          font-size: 12px;
        }

        .price-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(280px, 1fr)
          );
          gap: 16px;
        }

        .price-card {
          background: #ffffff;
          border: 1px solid #e4ebe7;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 8px 24px rgba(24, 55, 41, 0.05);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .category-label {
          color: #92a099;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .price-card h4 {
          margin: 5px 0 0;
          color: #193328;
          font-size: 15px;
        }

        .unit-badge {
          flex-shrink: 0;
          padding: 5px 8px;
          border-radius: 999px;
          background: #eaf6ef;
          color: #237c4d;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .location {
          margin-top: 14px;
          padding: 8px 10px;
          border-radius: 9px;
          background: #f7faf8;
          color: #68766f;
          font-size: 10px;
        }

        .price-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 14px;
        }

        .price-block {
          padding: 12px;
          border: 1px solid #edf1ef;
          border-radius: 11px;
          background: #fbfcfc;
        }

        .price-block span,
        .market-range span,
        .record-footer span {
          display: block;
          margin-bottom: 4px;
          color: #8a9691;
          font-size: 8px;
        }

        .price-block strong {
          color: #237c4d;
          font-size: 14px;
        }

        .market-range {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
          padding-top: 12px;
          border-top: 1px solid #edf1ef;
        }

        .market-range strong {
          color: #35463e;
          font-size: 10px;
        }

        .record-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 13px;
          padding-top: 12px;
          border-top: 1px solid #edf1ef;
        }

        .record-footer strong {
          display: block;
          color: #53615b;
          font-size: 9px;
          line-height: 1.4;
          word-break: break-word;
        }

        @media (max-width: 700px) {
          .toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .refresh-button {
            width: 100%;
          }

          .price-row,
          .market-range,
          .record-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminSection>
  );
}