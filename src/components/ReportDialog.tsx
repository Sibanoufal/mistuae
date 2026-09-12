import { useState } from "react";
import { REPORT_REASONS } from "@/lib/mist-social";

export function ReportDialog({
  alias,
  onClose,
  onReport,
  onBlock,
}: {
  alias: string;
  onClose: () => void;
  onReport: (reason: string, note: string) => void;
  onBlock: () => void;
}) {
  const [reason, setReason] = useState(REPORT_REASONS[0]!);
  const [note, setNote] = useState("");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Report or block ${alias}`}
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass animate-pop my-8 w-full max-w-md rounded-[28px] p-5 sm:p-6">
        <h2 className="text-xl font-bold">Report or block {alias}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderators see the report, never your identity. Blocking hides them from you immediately.
        </p>

        <p className="mt-4 text-sm font-semibold">What happened?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {REPORT_REASONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={reason === r}
              onClick={() => setReason(r)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                reason === r ? "bg-ink text-background" : "bg-ink/5 hover:bg-ink/10"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <label htmlFor="report-note" className="sr-only">
          Extra detail for moderators
        </label>
        <textarea
          id="report-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Anything the moderators should know (optional)"
          className="mt-3 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
        />

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onReport(reason, note)}
            className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-coral-foreground"
          >
            Send report
          </button>
          <button
            type="button"
            onClick={onBlock}
            className="rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold"
          >
            Report and block
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
