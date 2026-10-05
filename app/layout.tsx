import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Recordful Help",
    template: "%s | Recordful Help",
  },
  description:
    "How to record, edit, export and troubleshoot Recordful, the free private screen recorder for Chrome.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
