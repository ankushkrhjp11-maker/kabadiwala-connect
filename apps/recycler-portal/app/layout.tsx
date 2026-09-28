import "./globals.css";

export const metadata = {
  title: "Kabadiwala Connect | Recycler Portal",
  description: "Authorized e-waste recycling marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}