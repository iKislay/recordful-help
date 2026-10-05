import Link from "next/link";

const SECTIONS = [
  {
    href: "/docs/getting-started/install",
    title: "Getting started",
    body: "Install, pin the extension, and grant permissions.",
  },
  {
    href: "/docs/recording/modes",
    title: "Recording",
    body: "Tab, screen, camera, audio, toolbar, and limits.",
  },
  {
    href: "/docs/editing/trim-cut-mute",
    title: "Editing and exporting",
    body: "Trim, crop, audio, MP4, GIF, and Drive.",
  },
  {
    href: "/docs/troubleshooting/memory-limit",
    title: "Troubleshooting",
    body: "Memory limits, stopped recordings, recovery.",
  },
  {
    href: "/docs/pro/free-vs-pro",
    title: "Accounts and Pro",
    body: "Free vs Pro, login, storage, share links.",
  },
];

export default function Home() {
  return (
    <main className="relative flex-1">
      <div className="gradient-field" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
        <p className="text-sm font-medium text-[#5f5f5d]">
          Recordful Help Center
        </p>
        <h1
          className="mt-3 max-w-2xl text-6xl font-semibold text-[#1c1c1c]"
          style={{ letterSpacing: "-1.5px", lineHeight: 1.05 }}
        >
          How can we help?
        </h1>
        <p className="mt-4 max-w-xl text-lg text-[#5f5f5d]">
          Guides for recording, editing, exporting, and fixing things when a
          recording goes wrong.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/docs"
            className="rounded-[10px] px-4 py-2 text-base font-medium text-[#fcfbf8]"
            style={{
              background:
                "linear-gradient(135deg, #FC7B20 0%, #FC3969 38%, #E537DF 62%, #8A34FA 100%)",
            }}
          >
            Browse the docs
          </Link>
          <Link
            href="https://recordful.app/contact"
            className="rounded-[10px] border border-[#D4D3D0] px-4 py-2 text-base text-[#1c1c1c]"
          >
            Contact support
          </Link>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-[14px] border border-[#EDEBE7] bg-white p-6"
            >
              <h2 className="text-xl font-medium text-[#1c1c1c]">{s.title}</h2>
              <p className="mt-1 text-sm text-[#5f5f5d]">{s.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
