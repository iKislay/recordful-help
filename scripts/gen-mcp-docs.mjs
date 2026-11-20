// Writes content/docs/ai-agents/tools/*.mdx, one page per MCP tool group, from
// a tools/list answer of https://recordful.app/mcp saved as JSON (any MCP
// client signed in as a Pro owner with write access lists every tool):
//   node scripts/gen-mcp-docs.mjs tools.json content/docs/ai-agents/tools
// It fails when a tool is in no group, so a new tool can't go undocumented.
import fs from "node:fs";
const [, , dumpPath, outDir] = process.argv;
const tools = Object.fromEntries(JSON.parse(fs.readFileSync(dumpPath, "utf8")).map((t) => [t.name, t]));
const GROUPS = [
  ["library", "Library", "Find, read, rename, file, tag, trash, duplicate and upload videos.", ["list_videos", "search_videos", "get_video", "get_transcript", "get_summary", "update_video", "duplicate_video", "delete_video", "list_trash", "restore_video", "list_folders", "create_folder", "update_folder", "delete_folder", "move_videos", "list_tags", "list_video_tags", "create_tag", "update_tag", "delete_tag", "add_video_tag", "remove_video_tag", "create_source", "create_video"]],
  ["editing", "Edit a video", "Read how a video is edited and change it in one atomic batch.", ["get_timeline", "apply_video_edits"]],
  ["see", "See a video", "Look at a video before editing it: frames, a storyboard, where the pointer went, and a preview link.", ["get_storyboard", "get_video_frame", "get_mouse_events", "get_live_preview_link"]],
  ["clips", "Clips and cuts", "Split, reorder, delete, duplicate, speed up and cut clips, by time or by the words said.", ["list_clips", "split_clip", "reorder_clip", "delete_clip", "duplicate_clip", "set_clip_speed", "set_clip_transition", "cut_clip", "cut_clip_by_transcript"]],
  ["cleanup", "Silences and filler words", "Find and cut long pauses, and cut ums and uhs.", ["get_silences", "remove_silences", "remove_fillers"]],
  ["zooms", "Zooms", "Add, change and remove zooms, or make them from the recorded clicks.", ["list_zooms", "add_zoom", "update_zoom", "remove_zoom", "remove_zooms", "generate_auto_zooms"]],
  ["look", "Look", "Background, frame, canvas shape, camera layout and click effects.", ["list_backgrounds", "set_background", "set_frame", "set_aspect_ratio", "set_camera", "set_cursor_effects"]],
  ["captions", "Captions and chapters", "Captions from the transcript, their style, word fixes, a captions file and chapters.", ["add_captions", "remove_captions", "set_caption_style", "update_transcript_words", "get_captions_file", "get_chapters", "set_chapters"]],
  ["audio", "Audio", "Volumes, voice clean-up and EQ, and muted stretches.", ["get_audio", "set_volumes", "set_voice_enhancement", "mute_range", "unmute_range"]],
  ["overlays", "Shapes, blurs and watermark", "Arrows, boxes, highlights and badges; blurs and spotlights; the watermark.", ["list_overlays", "add_shape", "update_shape", "remove_shape", "add_mask", "update_mask", "remove_mask", "set_watermark"]],
  ["sharing", "Sharing", "Who may watch, link password and expiry, call to action, viewers, members, comments and embeds.", ["set_visibility", "set_share_password", "set_link_expiry", "set_cta", "get_embed_code", "get_recording_link", "list_viewers", "invite_viewer", "remove_viewer", "list_members", "invite_member", "remove_member", "list_comments", "comment_on_video", "delete_comment", "like_video"]],
  ["analytics", "Views and analytics", "Views over time, where they came from, and every view.", ["get_video_activity", "get_analytics", "get_video_analytics", "get_workspace_analytics", "list_video_views", "list_workspace_views"]],
  ["webhooks", "Webhooks", "Get a signed POST when a video is ready, viewed, transcribed or commented on.", ["list_webhooks", "create_webhook", "update_webhook", "delete_webhook", "send_test_webhook"]],
  ["account", "Account", "Your plan and credits, and a link to upgrade.", ["get_account", "create_checkout_link"]],
];
const covered = GROUPS.flatMap((g) => g[3]);
const missing = Object.keys(tools).filter((n) => !covered.includes(n));
const unknown = covered.filter((n) => !tools[n]);
if (missing.length || unknown.length) throw new Error(`missing ${missing} unknown ${unknown}`);

const PRO = /^Recordful Pro only\.\s*/;
const esc = (s = "") => s.replace(/\|/g, "\|").replace(/\n+/g, " ").replace(/</g, "&lt;").replace(/{/g, "&#123;").replace(/}/g, "&#125;");
const typeOf = (s) => {
  if (!s) return "any";
  if (s.anyOf) return s.anyOf.map(typeOf).join(" or ");
  if (s.enum) return s.enum.map((v) => JSON.stringify(v)).join(", ");
  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.type === "array") return `${typeOf(s.items)}[]`;
  if (s.type === "object") return "object";
  if (Array.isArray(s.type)) return s.type.join(" or ");
  return s.type ?? "any";
};
const table = (schema, head) => {
  const props = Object.entries(schema?.properties ?? {});
  if (!props.length) return "None.\n";
  const req = new Set(schema.required ?? []);
  return [`| ${head} | Type | Required | What it is |`, "| --- | --- | --- | --- |",
    ...props.map(([k, v]) => `| \`${k}\` | ${esc(typeOf(v))} | ${req.has(k) ? "yes" : "no"} | ${esc(v.description ?? "")} |`)].join("\n") + "\n";
};
const returns = (schema) => {
  const props = Object.entries(schema?.properties ?? {});
  if (!props.length) return "";
  return "**Returns** " + props.map(([k, v]) => `\`${k}\`${v.description ? ` (${esc(v.description).replace(/\.$/, "")})` : ""}`).join(", ") + ".\n";
};
const kind = (t) => (t.annotations?.readOnlyHint ? "Reads only." : t.annotations?.destructiveHint ? "Changes something; can remove or replace what is there." : "Changes something.");
// A batch tool (apply_video_edits): each operation type with its own parameters.
const operations = (schema) => {
  const ops = Object.values(schema?.properties ?? {}).find((p) => p.items?.oneOf)?.items.oneOf;
  if (!ops) return "";
  const head = "**Operations** (each item of `operations` is one of these, by `type`; every one also takes an optional `operationId`)\n\n";
  return head + ops.map((op) => {
    const { type, operationId, ...rest } = op.properties;
    const about = op.description ? `${esc(op.description)}\n\n` : "";
    return `#### \`${type.const}\`\n\n${about}${table({ properties: rest, required: (op.required ?? []).filter((k) => k !== "type") }, "Parameter")}`;
  }).join("\n") + "\n";
};
for (const [slug, title, blurb, names] of GROUPS) {
  const body = names.map((n) => {
    const t = tools[n];
    const pro = PRO.test(t.description);
    return [`## \`${n}\``, "", `${pro ? "**Pro.** " : "**Every plan.** "}${kind(t)} ${esc(t.description.replace(PRO, ""))}`, "", "**Parameters**", "", table(t.inputSchema, "Parameter"), operations(t.inputSchema), returns(t.outputSchema)].join("\n");
  });
  fs.writeFileSync(`${outDir}/${slug}.mdx`, `---\ntitle: ${title}\ndescription: "${blurb}"\n---\n\n{/* Generated by scripts/gen-mcp-docs.mjs from the hosted server's tools/list. Regenerate, don't hand-edit. */}\n\n${blurb} ${names.length} tools.\n\n${body.join("\n")}`);
}
fs.writeFileSync(`${outDir}/meta.json`, JSON.stringify({ title: "MCP tools", pages: GROUPS.map((g) => g[0]) }, null, 2) + "\n");
console.log("wrote", GROUPS.length, "pages,", covered.length, "tools");
