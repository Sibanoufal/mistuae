# Demo account + punchier headline

## 1. Always signed in as a demo student

Judges should land on the site and immediately see every feature — no email code step.

- On first load, if no profile is saved, the app creates a ready-made verified student:
  - Name shown to others: masked alias (e.g. "Amber Heron")
  - Campus: Heriot-Watt Dubai, Year 3, Computer Science
  - Interests, purposes (project partner, coffee chat, study partner) and availability pre-filled
  - Marked verified, so the Verified Student badge shows
- With that profile present, the pen pal, letters, masked chats, rooms, boards, discovery and Great Reveal states all populate exactly as they do for a real signed-up student.
- The sign-up page stays available and still works: it becomes "edit your profile", pre-filled with the demo details, and the email-code step becomes optional rather than a gate. Anyone who wants to see the verification flow can still run it.
- Add a small "Signed in as <alias> · demo account" line in the header menu with a "Start fresh" option that clears the demo and shows the normal sign-up flow.

## 2. Punchier headline

Current: "Every person here is a verified student at a real UAE university. / You just get to know them before names get in the way."

New headline, same meaning:

> **Real students. / *No names.* / Not yet.**

Sub-line: "Every account is a verified UAE university student — you just meet the person before the name."

Also update the page title/description wording to match.

## Technical notes

- Seed the demo profile inside the store's initial-state/migration path (`src/lib/mist-store.tsx`), bumped to a new storage key so existing saved state doesn't block it.
- `src/routes/join.tsx`: drop the verified-email gate on submit, keep the code widget as optional.
- `src/routes/index.tsx`: headline markup and `head()` meta.
- No backend involved; everything stays on the device as today.
