import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidCraft AI - AI Video Generation",
  description: "Create stunning videos with the power of AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body style={{ margin: 0, backgroundColor: "#09090b", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
