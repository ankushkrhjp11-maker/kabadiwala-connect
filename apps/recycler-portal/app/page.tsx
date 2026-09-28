"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

type Lot = {
  id: string;
  referenceId?: string;
  materialCategory?: {
    id: string;
    name: string;
    slug?: string;
  };
  description?: string;
  approximateWeightKg?: string | number;
  estimatedValueLow?: string | number | null;
  estimatedValueHigh?: string | number | null;
  collectionTimestamp?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
};

const prices = [
  ["PCB", "₹120 – ₹220", "+4.2%"],
  ["Cables", "₹80 – ₹150", "+2.8%"],
  ["Battery", "₹45 – ₹90", "+1.5%"],
  ["LCD / LED", "₹35 – ₹70", "-0.8%"],
  ["Motors", "₹70 – ₹130", "+3.1%"],
];

function formatValue(
  low?: string | number | null,
  high?: string | number | null,
) {
  if (low == null && high == null) return "—";

  const lowNumber = Number(low);
  const highNumber = Number(high);

  if (!Number.isFinite(lowNumber) || !Number.isFinite(highNumber)) {
    return "—";
  }

  return `₹${lowNumber.toLocaleString("en-IN")} – ₹${highNumber.toLocaleString("en-IN")}`;
}

function formatWeight(weight?: string | number) {
  if (weight == null) return "—";

  const number = Number(weight);

  if (!Number.isFinite(number)) return `${weight} kg`;

  return `${number.toLocaleString("en-IN")} kg`;
}

function formatDate(date?: string) {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Recently";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("Dashboard");

  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLots() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch<Lot[]>("/recyclers/lots");

      setLots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load recycler lots:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Unable to load available lots.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLots();
  }, []);

  const filteredLots = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return lots;

    return lots.filter((lot) => {
      const text = [
        lot.id,
        lot.referenceId,
        lot.materialCategory?.name,
        lot.materialCategory?.slug,
        lot.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [lots, search]);

  const totalWeight = lots.reduce((total, lot) => {
    const weight = Number(lot.approximateWeightKg);
    return Number.isFinite(weight) ? total + weight : total;
  }, 0);

  const totalEstimatedValue = lots.reduce((total, lot) => {
    const value = Number(lot.estimatedValueHigh);
    return Number.isFinite(value) ? total + value : total;
  }, 0);

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">♻</div>

          <div>
            <h2>Kabadiwala</h2>
            <span>Connect</span>
          </div>
        </div>

        <p className="menu-title">MAIN MENU</p>

        {[
          ["⌂", "Dashboard"],
          ["▣", "Available Lots"],
          ["◈", "My Offers"],
          ["↔", "Transactions"],
          ["₹", "Earnings"],
        ].map(([icon, name]) => (
          <button
            key={name}
            className={`menu-item ${active === name ? "active" : ""}`}
            onClick={() => setActive(name)}
          >
            <span>{icon}</span>
            {name}
          </button>
        ))}

        <p className="menu-title account-title">ACCOUNT</p>

        <button
          className={`menu-item ${active === "Profile" ? "active" : ""}`}
          onClick={() => setActive("Profile")}
        >
          <span>◉</span>
          My Profile
        </button>

        <button
          className={`menu-item ${active === "Settings" ? "active" : ""}`}
          onClick={() => setActive("Settings")}
        >
          <span>⚙</span>
          Settings
        </button>

        <div className="sidebar-bottom">
          <div className="verified">
            <div className="verify-icon">✓</div>

            <div>
              <strong>Verified Recycler</strong>
              <small>Authorization active</small>
            </div>
          </div>

          <button
            className="logout"
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              window.location.reload();
            }}
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* HEADER */}
        <header className="header">
          <div>
            <h1>{active}</h1>
            <p>Authorized e-waste recycling marketplace</p>
          </div>

          <div className="header-right">
            <button className="notification">♢</button>

            <div className="avatar">BR</div>

            <div className="user-info">
              <strong>Bhopal Recycler</strong>
              <span>Authorized Recycler</span>
            </div>

            <span className="arrow">⌄</span>
          </div>
        </header>

        <div className="content">
          {/* WELCOME */}
          <section className="welcome">
            <div>
              <span className="eyebrow">RECYCLER DASHBOARD</span>

              <h2>Welcome back, Bhopal Recycler 👋</h2>

              <p>
                Find valuable e-waste lots and grow your recycling business.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setActive("Available Lots")}
            >
              ＋ Browse Available Lots
            </button>
          </section>

          {/* STATS */}
          <section className="stats">
            <div className="stat-card">
              <div className="stat-icon green">▣</div>

              <div>
                <span>Available Lots</span>
                <h3>{loading ? "—" : lots.length}</h3>

                <small className="positive">
                  Live <em>from database</em>
                </small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">◈</div>

              <div>
                <span>Active Offers</span>
                <h3>0</h3>

                <small className="positive">
                  Ready <em>for marketplace</em>
                </small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">₹</div>

              <div>
                <span>Estimated Lot Value</span>

                <h3>
                  {loading
                    ? "—"
                    : `₹${totalEstimatedValue.toLocaleString("en-IN")}`}
                </h3>

                <small className="positive">
                  Current <em>available inventory</em>
                </small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">⚖</div>

              <div>
                <span>Total Weight</span>

                <h3>
                  {loading
                    ? "—"
                    : `${totalWeight.toLocaleString("en-IN")} kg`}
                </h3>

                <small className="positive">
                  Live <em>lot inventory</em>
                </small>
              </div>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="error-banner">
              <div>
                <strong>Unable to load available lots</strong>
                <p>{error}</p>
              </div>

              <button onClick={loadLots}>Retry</button>
            </div>
          )}

          {/* MAIN GRID */}
          <section className="main-grid">
            {/* LOTS */}
            <div className="panel lots-panel">
              <div className="panel-header">
                <div>
                  <h3>Available E-waste Lots</h3>

                  <p>
                    Recently posted by collectors near your service area
                  </p>
                </div>

                <button
                  className="view-btn"
                  onClick={() => setActive("Available Lots")}
                >
                  View all →
                </button>
              </div>

              <div className="toolbar">
                <div className="search-box">
                  <span>⌕</span>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search lot ID, material or description..."
                  />
                </div>

                <button className="filter-btn">☷ Filter</button>

                <button
                  className="refresh-btn"
                  onClick={loadLots}
                  disabled={loading}
                  title="Refresh lots"
                >
                  ↻
                </button>
              </div>

              <div className="table">
                <div className="table-head">
                  <span>LOT</span>
                  <span>MATERIAL</span>
                  <span>WEIGHT</span>
                  <span>EST. VALUE</span>
                  <span>POSTED</span>
                  <span></span>
                </div>

                {loading ? (
                  <div className="empty-state">
                    <div className="loading-spinner">⟳</div>

                    <strong>Loading available lots...</strong>

                    <p>
                      Fetching the latest inventory from the marketplace.
                    </p>
                  </div>
                ) : filteredLots.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>

                    <strong>
                      {search
                        ? "No matching lots found"
                        : "No available lots yet"}
                    </strong>

                    <p>
                      {search
                        ? "Try another lot ID, material or description."
                        : "New collector lots will appear here automatically."}
                    </p>
                  </div>
                ) : (
                  filteredLots.map((lot) => (
                    <div
                      className="table-row"
                      key={lot.id}
                    >
                      <div>
                        <strong>
                          {lot.referenceId || lot.id.slice(0, 8)}
                        </strong>

                        <small>
                          {formatDate(lot.collectionTimestamp)}
                        </small>
                      </div>

                      <div>
                        <span className="material-tag">
                          {lot.materialCategory?.name || "E-waste"}
                        </span>
                      </div>

                      <div>
                        {formatWeight(lot.approximateWeightKg)}
                      </div>

                      <div>
                        <strong>
                          {formatValue(
                            lot.estimatedValueLow,
                            lot.estimatedValueHigh,
                          )}
                        </strong>
                      </div>

                      <div>
                        {lot.latitude && lot.longitude
                          ? `⌖ ${Number(lot.latitude).toFixed(3)}, ${Number(
                              lot.longitude,
                            ).toFixed(3)}`
                          : "Location available"}
                      </div>

                      <button
                        className="offer-btn"
                        onClick={() =>
                          alert(
                            `Make offer for ${
                              lot.referenceId || lot.id
                            }`,
                          )
                        }
                      >
                        Make Offer
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PRICE BOARD */}
            <div className="panel price-panel">
              <div className="panel-header">
                <div>
                  <h3>Price Board</h3>
                  <p>Current market reference</p>
                </div>

                <span className="live">● LIVE</span>
              </div>

              {prices.map(([name, price, change]) => (
                <div className="price-row" key={name}>
                  <div className="price-name">
                    <i></i>

                    <strong>{name}</strong>
                  </div>

                  <div className="price-value">
                    <strong>{price}</strong>

                    <small
                      className={
                        change.startsWith("-") ? "negative" : ""
                      }
                    >
                      {change}
                    </small>
                  </div>
                </div>
              ))}

              <button className="full-price-btn">
                View Full Price Board →
              </button>
            </div>
          </section>

          {/* BOTTOM */}
          <section className="bottom-grid">
            {/* ACTIVITY */}
            <div className="panel activity-panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Activity</h3>
                  <p>Your latest marketplace actions</p>
                </div>

                <button className="view-btn">
                  View all →
                </button>
              </div>

              <div className="activity">
                <div className="activity-icon">◈</div>

                <div>
                  <strong>Marketplace connected</strong>

                  <small>
                    Live inventory is now connected to your portal
                  </small>
                </div>

                <b>LIVE</b>
              </div>

              <div className="activity">
                <div className="activity-icon">✓</div>

                <div>
                  <strong>Recycler account active</strong>

                  <small>
                    Authorization profile loaded successfully
                  </small>
                </div>

                <b>OK</b>
              </div>

              <div className="activity">
                <div className="activity-icon">↻</div>

                <div>
                  <strong>Inventory synchronized</strong>

                  <small>
                    Latest available lots fetched from server
                  </small>
                </div>

                <b>{lots.length}</b>
              </div>
            </div>

            {/* VERIFICATION */}
            <div className="panel verification-panel">
              <div className="big-check">✓</div>

              <span className="eyebrow">
                TRUST & COMPLIANCE
              </span>

              <h3>Authorization Verified</h3>

              <p>
                Your recycler authorization is active. Collectors can see
                your verified badge and trust your offers.
              </p>

              <div className="info-row">
                <span>Authorization No.</span>

                <strong>MP-EWASTE-TEST-001</strong>
              </div>

              <div className="info-row">
                <span>Service Area</span>

                <strong>Bhopal • Sehore • Vidisha</strong>
              </div>

              <button className="details-btn">
                View Verification Details
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}