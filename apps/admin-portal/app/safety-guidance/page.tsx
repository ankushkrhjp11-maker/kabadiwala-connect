import AdminSection from "../../components/AdminSection";

export default function SafetyGuidancePage() {
  return (
    <AdminSection
      title="Safety Guidance"
      icon="⚠"
      badge="Safety Management"
      subtitle="Manage pictorial and multilingual safety guidance for hazardous e-waste handling, storage, transport and dismantling."
      stats={[
        {
          label: "Guidance Items",
          icon: "⚠",
          description: "Configured safety instructions",
        },
        {
          label: "Languages",
          icon: "文",
          description: "Supported guidance languages",
        },
        {
          label: "Hazard Categories",
          icon: "☣",
          description: "Configured hazard types",
        },
        {
          label: "Published Guidance",
          icon: "✓",
          description: "Currently available instructions",
        },
      ]}
      actions={[
        {
          label: "Safety Library",
          icon: "⚠",
          description:
            "Browse available e-waste safety instructions.",
        },
        {
          label: "Hazard Categories",
          icon: "☣",
          description:
            "Manage battery, CRT, chemical and electrical hazards.",
        },
        {
          label: "Language Management",
          icon: "文",
          description:
            "Manage Hindi, Marathi and other supported guidance.",
        },
        {
          label: "Publish Guidance",
          icon: "✓",
          description:
            "Review and publish verified safety information.",
        },
      ]}
    />
  );
}