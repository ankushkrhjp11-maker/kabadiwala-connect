import AdminSection from "../../components/AdminSection";

export default function AIMonitoringPage() {
  return (
    <AdminSection
      title="AI Monitoring"
      icon="✦"
      badge="AI Decision Support"
      subtitle="Monitor AI-assisted material classification, valuation, recycler matching and anomaly detection with confidence and evidence levels."
      stats={[
        {
          label: "AI Assessments",
          icon: "✦",
          description: "Recorded AI-assisted assessments",
        },
        {
          label: "Low Confidence",
          icon: "⚠",
          description: "Assessments requiring review",
        },
        {
          label: "Verification Queue",
          icon: "◷",
          description: "Cases requiring human verification",
        },
        {
          label: "Model Status",
          icon: "●",
          description: "AI service monitoring state",
        },
      ]}
      actions={[
        {
          label: "Classification Monitoring",
          icon: "✦",
          description:
            "Review material classification results and confidence.",
        },
        {
          label: "Valuation Monitoring",
          icon: "₹",
          description:
            "Review AI-assisted valuation ranges and evidence.",
        },
        {
          label: "Anomaly Detection",
          icon: "⚠",
          description:
            "Investigate unusual or inconsistent transaction patterns.",
        },
        {
          label: "Human Verification Queue",
          icon: "✓",
          description:
            "Review cases where AI confidence is insufficient.",
        },
      ]}
    />
  );
}