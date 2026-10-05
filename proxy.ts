import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The extension ships legacy help URLs shaped like
 * /getting-started/<collectionId>/<slug>/<docId> (old helpdesk export).
 * Redirect them to clean slugs so in-extension links never 404,
 * whatever the URL encoding. Substring match on the human-readable tail.
 */
const RULES: Array<[string, string]> = [
  ["why-does-recordful-ask-for-permissions", "/docs/getting-started/permissions"],
  [
    "how-to-grant-recordful-permission-to-record-your-camera-and-microphone",
    "/docs/getting-started/camera-mic",
  ],
  ["memory-limit", "/docs/troubleshooting/memory-limit"],
  ["how-to-hide-the-toolbar", "/docs/recording/toolbar"],
  ["changed-in-the-new-version", "/docs/getting-started/whats-new"],
  ["what-s-changed-in-the-new-version", "/docs/getting-started/whats-new"],
  ["technical-requirements", "/docs/getting-started/requirements"],
  ["5-minute-limit", "/docs/editing/five-minute-limit"],
  ["how-to-cut-trim-or-mute", "/docs/editing/trim-cut-mute"],
];

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname.toLowerCase();
  if (path === "/" || path === "/docs") return NextResponse.next();
  for (const [needle, dest] of RULES) {
    if (path.includes(needle)) {
      return NextResponse.redirect(new URL(dest, req.url), 308);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
