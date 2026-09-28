"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

type Stat = {
  label: string;
  value?: string;
  icon: string;
  description: string;
};

type Action = {
  label: string;
  description: string;
  icon: string;
  path?: string;
};

type AdminSectionProps = {
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  stats?: Stat[];
  actions?: Action[];
  children?: ReactNode;
};

export default function AdminSection({
  title,
  subtitle,
  icon,
  badge,
  stats = [],
  actions = [],
  children,
}: AdminSectionProps) {
  const router = useRouter();

  return (
    <main className="section-page">
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

        .section-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 30px 32px 50px;
        }

        .section-container {
          max-width: 1500px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 25px;
        }

        .section-title-wrap {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .section-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          border-radius: 15px;
          background: #eaf7ef;
          color: #278653;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
          border: 1px solid #d7eee0;
        }

        .section-title {
          margin: 0;
          font-size: 25px;
          letter-spacing: -0.7px;
        }

        .section-subtitle {
          margin: 7px 0 0;
          color: #7c8992;
          font-size: 12px;
          line-height: 1.6;
          max-width: 700px;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 999px;
          background: #eef8f2;
          color: #27774c;
          border: 1px solid #d7eee0;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #38a169;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 18px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e7ecef;
          border-radius: 16px;
          padding: 19px;
          min-height: 138px;
          box-shadow: 0 4px 18px rgba(20, 35, 28, 0.025);
          transition: 0.18s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20, 35, 28, 0.06);
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-icon {
          width: 39px;
          height: 39px;
          border-radius: 11px;
          background: #eef8f2;
          color: #268653;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 800;
        }

        .stat-value {
          margin-top: 17px;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .stat-label {
          margin-top: 3px;
          font-size: 12px;
          font-weight: 750;
          color: #34434b;
        }

        .stat-description {
          margin-top: 5px;
          font-size: 10px;
          color: #8a969e;
        }

        .main-panel {
          background: white;
          border: 1px solid #e7ecef;
          border-radius: 17px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(20, 35, 28, 0.025);
        }

        .panel-heading {
          min-height: 65px;
          padding: 0 21px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #edf0f2;
        }

        .panel-heading h2 {
          margin: 0;
          font-size: 14px;
        }

        .panel-heading span {
          color: #89959d;
          font-size: 10px;
        }

        .panel-body {
          padding: 22px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-card {
          border: 1px solid #e7ecef;
          background: #fafcfc;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 13px;
          cursor: pointer;
          text-align: left;
          transition: 0.18s ease;
        }

        .action-card:hover {
          border-color: #b9dcc8;
          background: #f5faf7;
          transform: translateY(-1px);
        }

        .action-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #eaf7ef;
          color: #278653;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .action-content {
          flex: 1;
        }

        .action-content strong {
          display: block;
          font-size: 12px;
        }

        .action-content span {
          display: block;
          margin-top: 4px;
          color: #89959d;
          font-size: 10px;
          line-height: 1.45;
        }

        .action-arrow {
          color: #9aa6ad;
          font-size: 16px;
        }

        .section-footer {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid #e5e9eb;
          color: #929da4;
          font-size: 10px;
          display: flex;
          justify-content: space-between;
        }

        @media (max-width: 1000px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .section-page {
            padding: 20px 15px 35px;
          }

          .section-header {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 21px;
          }

          .section-footer {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>

      <div className="section-container">
        <header className="section-header">
          <div className="section-title-wrap">
            <div className="section-icon">{icon}</div>

            <div>
              <h1 className="section-title">{title}</h1>

              <p className="section-subtitle">{subtitle}</p>
            </div>
          </div>

          {badge && (
            <div className="header-badge">
              <span className="badge-dot" />
              {badge}
            </div>
          )}
        </header>

        {stats.length > 0 && (
          <section className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-top">
                  <div className="stat-icon">{stat.icon}</div>
                </div>

                <div className="stat-value">
                  {stat.value ?? "—"}
                </div>

                <div className="stat-label">{stat.label}</div>

                <div className="stat-description">
                  {stat.description}
                </div>
              </article>
            ))}
          </section>
        )}

        {actions.length > 0 && (
          <section className="main-panel">
            <div className="panel-heading">
              <h2>Management Tools</h2>
              <span>Available admin operations</span>
            </div>

            <div className="panel-body">
              <div className="actions-grid">
                {actions.map((action) => (
                  <button
                    type="button"
                    key={action.label}
                    className="action-card"
                    onClick={() => {
                      if (action.path) {
                        router.push(action.path);
                      }
                    }}
                  >
                    <div className="action-icon">
                      {action.icon}
                    </div>

                    <div className="action-content">
                      <strong>{action.label}</strong>

                      <span>{action.description}</span>
                    </div>

                    <div className="action-arrow">→</div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {children}

        <footer className="section-footer">
          <span>
            Kabadiwala Connect • Admin Portal
          </span>

          <span>
            Administration &amp; Monitoring Center
          </span>
        </footer>
      </div>
    </main>
  );
}