/**
 * Placeholder where the owner will drop a real screenshot, GIF or video.
 * Rendered as a labelled grey box so missing media is obvious, never silent.
 */
export function MediaPlaceholder({
  kind = "screenshot",
  label,
  ratio = "16 / 9",
}: {
  kind?: "screenshot" | "gif" | "video";
  label: string;
  ratio?: string;
}) {
  return (
    <div
      className="my-4 flex items-center justify-center rounded-[12px] border border-[#EDEBE7] bg-[#FAF9F6] p-8 text-center"
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`TODO media (${kind}): ${label}`}
    >
      <div>
        <p className="text-sm font-medium text-[#1c1c1c]">
          TODO media ({kind})
        </p>
        <p className="mt-1 text-sm text-[#5f5f5d]">{label}</p>
      </div>
    </div>
  );
}
