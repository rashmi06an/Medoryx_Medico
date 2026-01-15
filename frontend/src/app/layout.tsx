import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "MEDORYX",
  description: "Unified Healthcare Operating System",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
