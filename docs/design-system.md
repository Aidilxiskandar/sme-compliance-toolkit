# Design system ("Groovy")

Shared visual language across Aidil's projects, adapted from the Groovy Grounds
cafe website for data-dense tools. The tokens live at the top of
[`app/styles.css`](../app/styles.css); copy that block to reuse them.

| Token | Value | Use |
| --- | --- | --- |
| `--cream` | `#E2D6BE` | page background |
| `--paper` / `--cream-soft` | `#F7F1E6` / `#EEE6D6` | cards, inputs |
| `--brown` | `#4A2C1D` | text, outlines, shadows (8.7:1 on cream) |
| `--muted` | `#6B4A38` | secondary text (5.5:1) |
| `--green` / `--green-deep` | `#356849` / `#24493a` | header band, primary buttons / links (7.0:1) |
| `--red` / `--red-text` | `#C9343A` / `#A42A2F` | danger fills with white text / danger text (4.95:1) |
| `--yellow` | `#EED86B` | active tab, badges, focus ring (fills only) |

- **Type:** Sigmar One for headings and big numbers (uppercase); Space Mono for
  everything else. Both are SIL OFL and self-hosted in `app/fonts/` (no
  third-party requests).
- **Shape:** 3px brown outline (2px on small controls), 14px radius, hard offset
  shadow `6px 6px 0` (`3px` on small elements). Buttons are pills that lift on
  hover and press flat on click.
- **Accessibility:** every text colour meets WCAG AA (4.5:1) on its background;
  the cafe's `#C9343A` red is used only as a fill, never as small text. Focus is
  a yellow ring with a brown halo; motion respects `prefers-reduced-motion`.
- **Brand boundary:** borrow the style, not the cafe's logo or mascot.
