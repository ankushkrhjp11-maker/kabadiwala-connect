import AdminSection from "../../components/AdminSection";

export default function ReportsPage() {
  return (
    <AdminSection
      title="Reports"
      icon="▥"
      badge="Analytics & Reports"
      subtitle="Generate operational reports covering collectors, recyclers, lots, transactions, material movement and platform activity."
      stats={[
        {
          label: "Available Reports",
          icon: "▥",
          description: "Configured report types",
        },
        {
          label: "Collection Reports",
          icon: "♙",
          description: "Collector activity reports",
        },
        {
          label: "Transaction Reports",
          icon: "⇄",
          description: "Transaction and handover reports",
        },
        {
          label: "Material Reports",
          icon: "◇",
          description: "Material flow and category reports",
        },
      ]}
      actions={[
        {
          label: "Collection Report",
          icon: "♙",
          description:
            "Analyse collection activity and collector participation.",
        },
        {
          label: "Recycler Report",
          icon: "♻",
          description:
            "Review recycler network and facility activity.",
        },
        {
          label: "Transaction Report",
          icon: "⇄",
          description:
            "Review transaction and digital handover records.",
        },
        {
          label: "Material Flow Report",
          icon: "◇",
          description:
            "Analyse movement of e-waste materials through the platform.",
        },
      ]}
    />
  );
}