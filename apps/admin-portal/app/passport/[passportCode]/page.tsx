type TraceabilityEvent = {
  eventType?: string;
  timestamp?: string;
  metadata?: Record<string, unknown> | null;
};

type PassportResponse = {
  passport: {
    passportCode: string;
    publicToken?: string;
    currentStage: string;
    finalOutcome?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };

  item: {
    lotReferenceId?: string;
    category?: string;
    description?: string | null;
    approximateWeight?: string | number | null;
    collectionTimestamp?: string | null;
  };

  collector?: {
    name?: string;
  };

  traceability?: TraceabilityEvent[];
};

/*
 * =========================================================
 * CONFIGURATION
 * =========================================================
 *
 * Passport API:
 * The Next.js server runs on the same PC as Nest API,
 * therefore localhost:3001 is correct here.
 *
 * Public QR:
 * The phone must open the laptop's LAN address.
 */

const API_BASE_URL =
  "http://localhost:3001/api";

const PUBLIC_APP_URL =
  "http://10.96.220.160:3000";

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function getPassport(
  publicToken: string,
): Promise<PassportResponse | null> {
  try {
    const cleanToken = decodeURIComponent(
      publicToken,
    ).trim();

    if (!cleanToken) {
      console.error(
        "[PUBLIC PASSPORT] Empty passport token",
      );

      return null;
    }

    const url =
      `${API_BASE_URL}/passports/public/` +
      encodeURIComponent(cleanToken);

    console.log(
      "[PUBLIC PASSPORT] Fetching:",
      url,
    );

    const response = await fetch(url, {
      cache: "no-store",
    });

    console.log(
      "[PUBLIC PASSPORT] Status:",
      response.status,
    );

    if (!response.ok) {
      console.error(
        "[PUBLIC PASSPORT] API failed:",
        response.status,
      );

      return null;
    }

    const data =
      (await response.json()) as PassportResponse;

    console.log(
      "[PUBLIC PASSPORT] Passport loaded:",
      data.passport?.passportCode,
    );

    return data;
  } catch (error) {
    console.error(
      "[PUBLIC PASSPORT] Fetch error:",
      error,
    );

    return null;
  }
}

export default async function PublicPassportPage({
  params,
}: {
  params: Promise<{
    passportCode: string;
  }>;
}) {
  const { passportCode } = await params;

  console.log(
    "[PUBLIC PASSPORT] Route loaded:",
    passportCode,
  );

  const data =
    await getPassport(passportCode);

  /*
   * =======================================================
   * ERROR PAGE
   * =======================================================
   */

  if (!data) {
    return (
      <main className="page">
        <style>{`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family:
              Inter,
              Arial,
              Helvetica,
              sans-serif;
            background: #f4f8f6;
            color: #17211f;
          }

          .page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }

          .error-card {
            width: 100%;
            max-width: 560px;
            background: #ffffff;
            border-radius: 28px;
            padding: 42px 30px;
            text-align: center;
            border: 1px solid #dce8e3;
            box-shadow:
              0 24px 70px rgba(11, 107, 87, 0.08);
          }

          .error-icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 18px;
            border-radius: 50%;
            background: #fff0ee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
          }

          .error-card h1 {
            margin: 0;
            font-size: 28px;
          }

          .error-card p {
            color: #71807c;
            line-height: 1.6;
            margin-top: 10px;
          }

          .error-code {
            display: inline-block;
            margin-top: 16px;
            padding: 9px 12px;
            border-radius: 10px;
            background: #f5f7f6;
            color: #5d6c68;
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
          }
        `}</style>

        <section className="error-card">
          <div className="error-icon">
            ⚠️
          </div>

          <h1>Passport Not Found</h1>

          <p>
            This E-Waste Passport could not be
            verified.
          </p>

          <div className="error-code">
            {passportCode}
          </div>
        </section>
      </main>
    );
  }

  const passport = data.passport;
  const item = data.item;

  const collector =
    data.collector?.name ||
    "Verified Collector";

  const events =
    data.traceability || [];

  const qrToken =
    passport.publicToken || "";

  /*
   * =======================================================
   * QR URL
   * =======================================================
   *
   * IMPORTANT:
   *
   * Do NOT use localhost here.
   *
   * Phone scans:
   * http://10.96.220.160:3000/passport/...
   *
   * Then Next.js server fetches:
   * http://localhost:3001/api/...
   */

  const qrUrl = qrToken
    ? `${PUBLIC_APP_URL}/passport/${encodeURIComponent(
        qrToken,
      )}`
    : "";

  const qrImageUrl = qrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        qrUrl,
      )}`
    : "";

  console.log(
    "[PUBLIC PASSPORT] QR URL generated:",
    qrUrl
      ? `${PUBLIC_APP_URL}/passport/[token]`
      : "NO QR URL",
  );

  /*
   * =======================================================
   * MAIN PASSPORT PAGE
   * =======================================================
   */

  return (
    <main className="page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
          background:
            radial-gradient(
              circle at top right,
              rgba(16, 133, 105, 0.12),
              transparent 30%
            ),
            #f4f8f6;
          color: #17211f;
        }

        .page {
          min-height: 100vh;
          padding: 24px;
        }

        .container {
          max-width: 1080px;
          margin: 0 auto;
        }

        .hero {
          background:
            linear-gradient(
              135deg,
              #084c3e,
              #0b6b57
            );
          color: #ffffff;
          border-radius: 30px;
          padding: 32px;
          box-shadow:
            0 24px 60px rgba(8, 76, 62, 0.18);
          margin-bottom: 22px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 18px;
          margin-bottom: 30px;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.14);
          font-size: 22px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 28px;
          align-items: center;
        }

        .eyebrow {
          margin: 0 0 8px;
          opacity: 0.72;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(30px, 5vw, 48px);
          line-height: 1.08;
        }

        .passport-code {
          display: inline-block;
          margin-top: 16px;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          font-family: monospace;
          font-size: 14px;
        }

        .verified {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 9px 13px;
          border-radius: 999px;
          background: #dff8ea;
          color: #17653f;
          font-size: 13px;
          font-weight: 800;
        }

        .verified-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #20a464;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 22px;
        }

        .card {
          background: #ffffff;
          border: 1px solid #dce8e3;
          border-radius: 24px;
          padding: 24px;
          box-shadow:
            0 16px 40px rgba(11,107,87,.06);
        }

        .card + .card {
          margin-top: 22px;
        }

        .card-title {
          margin: 0;
          font-size: 20px;
        }

        .card-subtitle {
          margin: 6px 0 22px;
          color: #71807c;
          font-size: 14px;
          line-height: 1.55;
        }

        .stage {
          padding: 18px;
          border-radius: 18px;
          background: #e8f5f0;
          border: 1px solid #cfe8de;
          margin-bottom: 20px;
        }

        .stage-label {
          color: #4e7167;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .stage-value {
          margin-top: 7px;
          font-size: 25px;
          font-weight: 900;
          color: #0b6b57;
        }

        .details {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .detail {
          padding: 15px;
          border-radius: 16px;
          background: #f7faf8;
          border: 1px solid #e1ebe7;
        }

        .detail-label {
          color: #71807c;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .detail-value {
          margin-top: 7px;
          font-size: 15px;
          font-weight: 750;
          word-break: break-word;
        }

        .timeline {
          margin-top: 5px;
        }

        .timeline-event {
          display: flex;
          gap: 14px;
          padding-bottom: 23px;
        }

        .timeline-event:last-child {
          padding-bottom: 0;
        }

        .timeline-rail {
          width: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .timeline-dot {
          width: 13px;
          height: 13px;
          margin-top: 3px;
          border-radius: 50%;
          background: #0b6b57;
          box-shadow:
            0 0 0 3px #dff2eb;
        }

        .timeline-line {
          flex: 1;
          width: 2px;
          background: #d8e8e2;
          margin-top: 4px;
        }

        .timeline-title {
          font-size: 14px;
          font-weight: 850;
        }

        .timeline-date {
          margin-top: 4px;
          color: #71807c;
          font-size: 12px;
        }

        .timeline-meta {
          margin-top: 6px;
          color: #6b7975;
          font-size: 12px;
          line-height: 1.5;
        }

        .qr-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .qr-box {
          width: 260px;
          min-height: 260px;
          margin: 10px 0 16px;
          padding: 18px;
          border: 1px solid #dce8e3;
          border-radius: 22px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-image {
          width: 220px;
          height: 220px;
          display: block;
        }

        .qr-missing {
          color: #71807c;
          font-size: 13px;
          line-height: 1.5;
        }

        .qr-note {
          margin: 0;
          color: #71807c;
          font-size: 13px;
          line-height: 1.55;
        }

        .qr-url-box {
          width: 100%;
          margin-top: 12px;
          padding: 10px 12px;
          background: #f6faf8;
          border: 1px solid #dce8e3;
          border-radius: 12px;
          font-size: 11px;
          color: #60736c;
          word-break: break-all;
          text-align: left;
        }

        .footer {
          max-width: 1080px;
          margin: 22px auto 0;
          padding-bottom: 20px;
          text-align: center;
          color: #71807c;
          font-size: 12px;
        }

        @media (max-width: 800px) {
          .page {
            padding: 14px;
          }

          .hero {
            padding: 24px;
          }

          .hero-grid,
          .content-grid {
            grid-template-columns: 1fr;
          }

          .details {
            grid-template-columns: 1fr;
          }

          .qr-box {
            width: 100%;
            min-width: 0;
          }

          .qr-url-box {
            font-size: 10px;
          }
        }
      `}</style>

      <div className="container">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">
          <div className="brand">
            <div className="brand-icon">
              ♻
            </div>

            Kabadiwala Connect
          </div>

          <div className="hero-grid">

            <div>
              <p className="eyebrow">
                Digital E-Waste Passport
              </p>

              <h1>
                Verified Item Journey
              </h1>

              <div className="passport-code">
                {passport.passportCode}
              </div>

              <div className="verified">
                <span className="verified-dot" />
                Public verification active
              </div>
            </div>

            <div>
              <strong>
                ♻ E-Waste Passport
              </strong>
            </div>

          </div>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="content-grid">

          <div>

            {/* CURRENT STATUS */}

            <section className="card">

              <h2 className="card-title">
                Current Status
              </h2>

              <p className="card-subtitle">
                Latest verified stage of this
                e-waste item.
              </p>

              <div className="stage">

                <div className="stage-label">
                  Current Stage
                </div>

                <div className="stage-value">
                  {passport.currentStage}
                </div>

              </div>

              <div className="details">

                <div className="detail">

                  <div className="detail-label">
                    Category
                  </div>

                  <div className="detail-value">
                    {item.category || "—"}
                  </div>

                </div>

                <div className="detail">

                  <div className="detail-label">
                    Lot Reference
                  </div>

                  <div className="detail-value">
                    {item.lotReferenceId || "—"}
                  </div>

                </div>

                <div className="detail">

                  <div className="detail-label">
                    Approx. Weight
                  </div>

                  <div className="detail-value">
                    {item.approximateWeight
                      ? `${item.approximateWeight} kg`
                      : "—"}
                  </div>

                </div>

                <div className="detail">

                  <div className="detail-label">
                    Collector
                  </div>

                  <div className="detail-value">
                    {collector}
                  </div>

                </div>

                <div className="detail">

                  <div className="detail-label">
                    Collection Time
                  </div>

                  <div className="detail-value">
                    {formatDate(
                      item.collectionTimestamp,
                    )}
                  </div>

                </div>

                <div className="detail">

                  <div className="detail-label">
                    Final Outcome
                  </div>

                  <div className="detail-value">
                    {passport.finalOutcome ||
                      "In progress"}
                  </div>

                </div>

              </div>

              <div
                className="detail"
                style={{
                  marginTop: 14,
                }}
              >

                <div className="detail-label">
                  Description
                </div>

                <div className="detail-value">
                  {item.description || "—"}
                </div>

              </div>

            </section>

            {/* TRACEABILITY */}

            <section className="card">

              <h2 className="card-title">
                Traceability Timeline
              </h2>

              <p className="card-subtitle">
                Recorded journey events for this
                e-waste item.
              </p>

              {events.length === 0 ? (

                <div className="detail">

                  <div className="detail-value">
                    No traceability events yet.
                  </div>

                </div>

              ) : (

                <div className="timeline">

                  {events.map(
                    (event, index) => (

                      <div
                        className="timeline-event"
                        key={
                          `${event.eventType}-${index}`
                        }
                      >

                        <div className="timeline-rail">

                          <div className="timeline-dot" />

                          {index <
                            events.length - 1 && (
                            <div className="timeline-line" />
                          )}

                        </div>

                        <div>

                          <div className="timeline-title">
                            {event.eventType ||
                              "TRACEABILITY UPDATE"}
                          </div>

                          <div className="timeline-date">
                            {formatDate(
                              event.timestamp,
                            )}
                          </div>

                          <div className="timeline-meta">
                            Verified event recorded
                            in the Kabadiwala Connect
                            traceability ledger.
                          </div>

                        </div>

                      </div>

                    ),
                  )}

                </div>

              )}

            </section>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <aside>

            {/* QR */}

            <section className="card qr-card">

              <h2 className="card-title">
                Scan to Verify
              </h2>

              <p className="card-subtitle">
                Scan this QR code to open the
                public E-Waste Passport.
              </p>

              <div className="qr-box">

                {qrToken ? (

                  <img
                    src={qrImageUrl}
                    alt="E-Waste Passport QR Code"
                    className="qr-image"
                  />

                ) : (

                  <div className="qr-missing">
                    QR code unavailable because
                    the public token is missing.
                  </div>

                )}

              </div>

              {qrToken && (
                <div className="qr-url-box">
                  {qrUrl}
                </div>
              )}

              <p
                className="qr-note"
                style={{
                  marginTop: 14,
                }}
              >
                Public verification intentionally
                hides private phone numbers,
                addresses and exact personal
                location information.
              </p>

            </section>

            {/* PASSPORT INFO */}

            <section className="card">

              <h2 className="card-title">
                Passport Information
              </h2>

              <p className="card-subtitle">
                Digital identity for this
                e-waste item.
              </p>

              <div className="detail">

                <div className="detail-label">
                  Passport Created
                </div>

                <div className="detail-value">
                  {formatDate(
                    passport.createdAt,
                  )}
                </div>

              </div>

              <div
                className="detail"
                style={{
                  marginTop: 12,
                }}
              >

                <div className="detail-label">
                  Last Updated
                </div>

                <div className="detail-value">
                  {formatDate(
                    passport.updatedAt,
                  )}
                </div>

              </div>

              <div
                className="detail"
                style={{
                  marginTop: 12,
                }}
              >

                <div className="detail-label">
                  Verification Status
                </div>

                <div className="detail-value">
                  Public Passport Verified
                </div>

              </div>

            </section>

          </aside>

        </section>

        <footer className="footer">
          Kabadiwala Connect • E-Waste Passport
          • Collect Smart. Repair More. Reuse
          Longer. Recycle Responsibly.
        </footer>

      </div>
    </main>
  );
}