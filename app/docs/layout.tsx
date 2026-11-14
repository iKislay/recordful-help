import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: "Recordful Help",
        children: (
          <a
            href="https://recordful.app/blog"
            className="text-sm text-fd-muted-foreground hover:text-fd-foreground"
          >
            Blog
          </a>
        ),
      }}
      sidebar={{ defaultOpenLevel: 1 }}
    >
      {children}
    </DocsLayout>
  );
}
