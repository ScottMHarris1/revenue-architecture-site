import "./globals.css";

export const metadata = {
  title: "Revenue Architecture Diagnostic",
  description: "Fix revenue system instability before it impacts valuation."
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
