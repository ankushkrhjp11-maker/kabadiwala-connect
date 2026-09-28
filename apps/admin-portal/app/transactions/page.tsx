"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSection from "../../components/AdminSection";

type UserInfo = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string | null;
  isActive?: boolean;
};

type CollectorProfile = {
  id?: string;
  user?: UserInfo;
};

type MaterialCategory = {
  id?: string;
  name?: string;
};

type LotInfo = {
  id?: string;
  referenceId?: string;
  status?: string;
  materialCategory?: MaterialCategory | null;
};

type RecyclerInfo = {
  id?: string;
  businessName?: string;
  authorizationStatus?: string;
  user?: UserInfo;
};

type PaymentRecord = {
  id: string;
  amount?: string | number | null;
  method?: string | null;
  status?: string | null;
  transactionReference?: string | null;
  paidAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  collectorProfile?: CollectorProfile | null;
  recycler?: RecyclerInfo | null;
  lot?: LotInfo | null;
};

const API_URL = "http://localhost:3001/api";

function formatMoney(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "₹0";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0";
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

function formatDateTime(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalize(value?: string | null) {
  return (value ?? "UNKNOWN").toUpperCase();
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<
    PaymentRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTransactions() {
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
        `${API_URL}/admin/transactions`,
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
              : `Unable to load transactions (${response.status}).`,
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid transactions response from server.",
        );
      }

      setTransactions(data as PaymentRecord[]);
    } catch (err) {
      setTransactions([]);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load transaction data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const pendingCount = useMemo(
    () =>
      transactions.filter(
        (item) => normalize(item.status) === "PENDING",
      ).length,
    [transactions],
  );

  const verifiedCount = useMemo(
    () =>
      transactions.filter((item) =>
        ["PAID", "COMPLETED", "SUCCESS", "VERIFIED"].includes(
          normalize(item.status),
        ),
      ).length,
    [transactions],
  );

  const reviewCount = useMemo(
    () =>
      transactions.filter((item) =>
        ["FAILED", "REJECTED", "CANCELLED", "REVIEW_REQUIRED"].includes(
          normalize(item.status),
        ),
      ).length,
    [transactions],
  );

  return (
    <AdminSection
      title="Transactions"
      icon="⇄"
      badge="Transaction Monitoring"
      subtitle="Track payment records and digital handovers between collectors and recycling partners."
      stats={[
        {
          label: "Total Transactions",
          value: loading
            ? "Loading..."
            : String(transactions.length),
          icon: "⇄",
          description: "Recorded platform payment records",
        },
        {
          label: "Pending Handover",
          value: loading ? "Loading..." : String(pendingCount),
          icon: "◌",
          description: "Transactions awaiting completion",
        },
        {
          label: "Verified Handover",
          value: loading ? "Loading..." : String(verifiedCount),
          icon: "✓",
          description: "Successfully completed payment records",
        },
        {
          label: "Review Required",
          value: loading ? "Loading..." : String(reviewCount),
          icon: "⚠",
          description: "Failed or exceptional transactions",
        },
      ]}
      actions={[
        {
          label: "Transaction Ledger",
          icon: "⇄",
          description:
            "View live transaction references and lifecycle status.",
        },
        {
          label: "Handover Verification",
          icon: "✓",
          description:
            "Review completed payment and handover records.",
        },
        {
          label: "Payment Records",
          icon: "₹",
          description:
            "Review recorded transaction values and payment methods.",
        },
        {
          label: "Traceability",
          icon: "◷",
          description:
            "Follow each payment back to its collection lot.",
        },
      ]}
    >
      <div className="transactions-content">
        <div className="toolbar">
          <div>
            <h3>Live Transaction Ledger</h3>
            <p>
              Data is loaded directly from the Kabadiwala Connect
              payment records.
            </p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={fetchTransactions}
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
          transactions.length === 0 && (
            <div className="empty-box">
              No transaction records are available in the database yet.
            </div>
          )}

        <div className="transaction-list">
          {transactions.map((transaction) => {
            const status = normalize(transaction.status);

            const collectorName =
              transaction.collectorProfile?.user?.name ??
              "Unknown collector";

            const recyclerName =
              transaction.recycler?.businessName ??
              transaction.recycler?.user?.name ??
              "Unknown recycler";

            const lotReference =
              transaction.lot?.referenceId ??
              transaction.lot?.id ??
              "Unknown lot";

            const categoryName =
              transaction.lot?.materialCategory?.name ??
              "Uncategorized";

            return (
              <article
                className="transaction-card"
                key={transaction.id}
              >
                <div className="transaction-top">
                  <div className="transaction-id">
                    <span>TRANSACTION</span>
                    <strong>
                      {transaction.transactionReference ??
                        transaction.id}
                    </strong>
                  </div>

                  <span
                    className={`status status-${status.toLowerCase()}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="main-grid">
                  <div className="amount-box">
                    <span>Payment Amount</span>
                    <strong>
                      {formatMoney(transaction.amount)}
                    </strong>

                    <small>
                      {transaction.method
                        ? transaction.method.replaceAll("_", " ")
                        : "Payment method unavailable"}
                    </small>
                  </div>

                  <div className="detail-box">
                    <span>Collector</span>
                    <strong>{collectorName}</strong>
                    <small>
                      {transaction.collectorProfile?.user?.phone ??
                        "Phone unavailable"}
                    </small>
                  </div>

                  <div className="detail-box">
                    <span>Recycler</span>
                    <strong>{recyclerName}</strong>
                    <small>{categoryName}</small>
                  </div>

                  <div className="detail-box">
                    <span>Lot Reference</span>
                    <strong>{lotReference}</strong>
                    <small>
                      Lot status:{" "}
                      {transaction.lot?.status ?? "—"}
                    </small>
                  </div>
                </div>

                <div className="transaction-footer">
                  <div>
                    <span>Created</span>
                    <strong>
                      {formatDateTime(transaction.createdAt)}
                    </strong>
                  </div>

                  <div>
                    <span>Paid At</span>
                    <strong>
                      {formatDateTime(transaction.paidAt)}
                    </strong>
                  </div>

                  <div>
                    <span>Transaction ID</span>
                    <strong>{transaction.id}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .transactions-content {
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

        .transaction-list {
          display: grid;
          gap: 14px;
        }

        .transaction-card {
          background: #ffffff;
          border: 1px solid #e4ebe7;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 8px 24px rgba(24, 55, 41, 0.05);
        }

        .transaction-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid #edf1ef;
        }

        .transaction-id span,
        .detail-box span,
        .amount-box span,
        .transaction-footer span {
          display: block;
          color: #8a9691;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2px;
          margin-bottom: 4px;
        }

        .transaction-id strong {
          color: #193328;
          font-size: 11px;
          word-break: break-all;
        }

        .status {
          flex-shrink: 0;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
        }

        .status-paid,
        .status-completed,
        .status-success,
        .status-verified {
          background: #eaf8ef;
          color: #247447;
        }

        .status-pending {
          background: #fff7df;
          color: #977214;
        }

        .status-failed,
        .status-rejected,
        .status-cancelled,
        .status-review_required {
          background: #fff0ee;
          color: #a84940;
        }

        .status-unknown {
          background: #f0f2f2;
          color: #6d7774;
        }

        .main-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .amount-box,
        .detail-box {
          min-width: 0;
          padding: 12px;
          border: 1px solid #edf1ef;
          border-radius: 11px;
          background: #fbfcfc;
        }

        .amount-box strong {
          display: block;
          color: #237c4d;
          font-size: 17px;
        }

        .amount-box small,
        .detail-box small {
          display: block;
          margin-top: 4px;
          color: #7e8984;
          font-size: 9px;
        }

        .detail-box strong {
          display: block;
          color: #35463e;
          font-size: 10px;
          line-height: 1.4;
          word-break: break-word;
        }

        .transaction-footer {
          display: grid;
          grid-template-columns: 1fr 1fr 1.4fr;
          gap: 10px;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid #edf1ef;
        }

        .transaction-footer strong {
          display: block;
          color: #53615b;
          font-size: 9px;
          line-height: 1.4;
          word-break: break-word;
        }

        @media (max-width: 850px) {
          .main-grid {
            grid-template-columns: 1fr 1fr;
          }

          .transaction-footer {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .refresh-button {
            width: 100%;
          }

          .main-grid,
          .transaction-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminSection>
  );
}