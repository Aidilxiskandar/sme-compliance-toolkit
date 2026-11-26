# Design system ("Trust navy", sticker style)

Shared visual language for Aidil's projects: the clean, credible look of
established compliance tools (navy sidebar, white cards, one blue accent,
calm status colours). Tokens live at the top of
[`app/styles.css`](../app/styles.css); copy that block to reuse them.

| Token | Value | Use |
| --- | --- | --- |
| `--navy` | `#14213D` | sidebar, headings and body text (16:1 on white) |
| `--bg` / `--surface` / `--surface-2` | `#F7F8FA` / `#FFFFFF` / `#F1F3F7` | page / cards / table headers, tracks |
| `--muted` | `#5A6478` | secondary text (5.9:1) |
| `--accent` | `#2F5BEA` | buttons, links, active nav (5.5:1, white text 5.5:1) |
| `--ok-fill` / `--ok` | `#0F8A6A` / `#0B6B53` | compliant: fills / text (5.7:1 on its tint) |
| `--warn-fill` / `--warn` | `#B7791F` / `#8A5A0B` | partly: fills / text (5.9:1) |
| `--gap-fill` / `--bad` | `#C2410C` / `#A8370A` | gap or risk: fills / text (5.6:1) |

- **Type:** Sigmar One for headings and big numbers (uppercase), Space Mono for
  everything else. Both self-hosted in `app/fonts/` (SIL OFL); no third-party
  font requests.
- **Layout:** left sidebar grouped as Overview / Inventory / Risk & controls /
  PDPA (the pattern Vanta and Drata use); a top bar for the current business and
  file actions; a dashboard led by a readiness ring, progress per area and a
  short "next steps" list. On screens under 900px the sidebar becomes a
  swipeable strip.
- **Shape ("sticker" style):** 3px navy outline (2px on small controls), 14px
  radius, hard offset shadow `6px 6px 0` navy (`3px` on small elements), pill
  buttons that lift on hover and press flat on click, outlined status pills,
  dashed row dividers. Motion respects `prefers-reduced-motion`.
- **Rules:** fill colours (bars, rings, dots) may be bright; text always uses
  the deeper variant so it meets WCAG AA (4.5:1). Values for rings and bars are
  set through the CSSOM, never inline `style=""` (the CSP forbids it).
